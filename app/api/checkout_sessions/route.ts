import { syncCartWithComponents } from "@/app/cart/actions";
import type { CartItems } from "@/app/cart/types";
import { isShippingFree } from "@/app/cart/utils";
import prisma from "@/lib/prisma";
import { isCustomProductWithComponents, isProduct } from "@/lib/productUtils";
import Stripe from "stripe";
import {
  type FilteredCart,
  createCheckoutSessionInDB,
  getLineItems,
  getTotalTps,
  getTotalTvq,
  inCents,
  isCartInSync,
} from "../utils";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const cart = data.cart as CartItems;
    const shippingId = data.shippingId as string;
    const userId = data.userId as string | undefined;

    if (!Array.isArray(cart) || !cart.length) throw new Error("cart_is_empty");
    // Sync cart with DB
    const syncedCart = await syncCartWithComponents(cart);
    const cartInSync = isCartInSync(cart, syncedCart);
    if (!cartInSync) throw new Error("cart_out_of_sync");

    const filteredCart: FilteredCart = { items: [], customItems: [] };
    for (const item of syncedCart) {
      if (isProduct(item.product)) {
        filteredCart.items.push({
          product: item.product,
          quantity: item.quantity,
        });
      } else if (isCustomProductWithComponents(item.product)) {
        filteredCart.customItems.push({
          product: item.product,
          quantity: item.quantity,
        });
      }
    }

    // Create new checkout session
    const shipping = await prisma.shipping.findUnique({
      where: { id: shippingId },
    });
    if (!shipping || Number.isNaN(shipping.price))
      throw new Error("shipping_invalid");
    // Make sure that free shipping is applied only if the conditions are met
    if (shipping.price === 0) {
      const totalQuantiy =
        filteredCart.items.reduce((acc, item) => acc + item.quantity, 0) +
        filteredCart.customItems.reduce((acc, item) => acc + item.quantity, 0);
      const totalPrice =
        filteredCart.items.reduce(
          (acc, item) => acc + item.product.price * item.quantity,
          0,
        ) +
        filteredCart.customItems.reduce(
          (acc, item) => acc + item.product.price * item.quantity,
          0,
        );
      if (!isShippingFree(totalQuantiy, totalPrice))
        throw new Error("shipping_invalid");
    }

    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      payment_method_types: ["card"],
      billing_address_collection: "required",
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      line_items: [
        ...getLineItems(syncedCart),
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: "TPS",
            },
            unit_amount: inCents(getTotalTps(syncedCart)),
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: "TVQ",
            },
            unit_amount: inCents(getTotalTvq(syncedCart)),
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: "Shipping",
            },
            unit_amount: inCents(shipping.price),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      return_url: `${req.headers.get(
        "origin",
      )}/checkout?session_id={CHECKOUT_SESSION_ID}`,
    });

    console.log("New checkout session:", session.id);
    const expiresAt = new Date(Date.now() + 60 * 30 * 1000);
    // Save checkout session in DB
    await createCheckoutSessionInDB({
      sessionId: session.id,
      cart: filteredCart,
      expiresAt,
      shippingId,
      userId,
    });

    return new Response(
      JSON.stringify({
        clientSecret: session.client_secret,
        sessionId: session.id,
      }),
      {
        status: 200,
      },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
    });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");
    if (!sessionId) throw new Error("missing_session_id");
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return new Response(
      JSON.stringify({
        status: session.status,
      }),
      {
        status: 200,
      },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
    });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");
    if (!sessionId) throw new Error("missing_session_id");
    const session = await stripe.checkout.sessions.expire(sessionId);
    return new Response(
      JSON.stringify({
        status: session.status,
      }),
      {
        status: 200,
      },
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 500,
    });
  }
}
