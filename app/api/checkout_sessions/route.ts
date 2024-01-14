import Stripe from "stripe";
import {
  Cart,
  CartItemType,
  CartProductType,
  getCartProductHardwareId,
  getCartProductMaterialId,
} from "@/app/cart/store";
import { syncCartWithComponents } from "@/app/cart/actions";
import {
  CustomProductWithComponents,
  DbProduct,
  getHardwareId,
  getMaterialId,
  isCustomProductWithComponents,
  isProduct,
} from "@/utils/productUtils";
import prisma from "@/lib/prisma";
import { Product } from "@prisma/client";
import { getLineItems, getTotalTps, getTotalTvq, inCents } from "../utils";
import { isShippingFree } from "@/app/cart/utils";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

type FilteredCart = {
  items: CartItemType<Product>[];
  customItems: CartItemType<CustomProductWithComponents>[];
};

async function createCheckoutSessionInDB(params: {
  sessionId: string;
  cart: FilteredCart;
  expiresAt: Date;
  shippingId: string;
}) {
  try {
    const { sessionId, cart, expiresAt, shippingId } = params;
    await prisma.checkoutSession.create({
      data: {
        sid: sessionId,
        expires_at: expiresAt,
        items: {
          create: cart.items.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
        },
        custom_items: {
          create: cart.customItems.map((item) => ({
            customProduct: {
              create: {
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
                material_id: item.product.material_id,
                hardware_id: item.product.hardware_id,
              },
            },
            quantity: item.quantity,
          })),
        },
        shipping_id: shippingId,
      },
      include: {
        items: true,
        custom_items: true,
      },
    });
  } catch (err) {
    throw new Error("failed_to_create_session_in_db");
  }
}

export async function deleteCheckoutSessionInDB(checkoutSid: string) {
  return prisma.checkoutSession.delete({
    where: {
      sid: checkoutSid,
    },
  });
}

function isCartInSync(cart: Cart, syncedCart: CartItemType<DbProduct>[]) {
  return cart.every((item) =>
    syncedCart.some(
      (syncedItem) =>
        item.product.id === syncedItem.product.id &&
        getCartProductMaterialId(item.product) ===
          getMaterialId(syncedItem.product) &&
        getCartProductHardwareId(item.product) === getHardwareId(syncedItem.product)
    )
  );
}

export async function POST(req: Request) {
  try {
    const { cart, shippingId } = (await req.json()) as {
      cart: CartItemType<CartProductType>[];
      shippingId: string;
    };
    if (!Array.isArray(cart) || !cart.length) throw new Error("cart_is_empty");
    // Sync cart with DB
    const syncedCart = await syncCartWithComponents(cart);
    const cartInSync = isCartInSync(cart, syncedCart);
    if (!cartInSync) throw new Error("cart_out_of_sync");

    const filteredCart: FilteredCart = { items: [], customItems: [] };
    for (const item of syncedCart) {
      if (isProduct(item.product)) {
        filteredCart.items.push({ product: item.product, quantity: item.quantity });
      } else if (isCustomProductWithComponents(item.product)) {
        filteredCart.customItems.push({
          product: item.product,
          quantity: item.quantity,
        });
      }
    }

    // Create new checkout session
    const shipping = await prisma.shipping.findUnique({ where: { id: shippingId } });
    if (!shipping || isNaN(shipping.price)) throw new Error("shipping_invalid");
    // Make sure that free shipping is applied only if the conditions are met
    if (shipping.price === 0) {
      const totalQuantiy =
        filteredCart.items.reduce((acc, item) => acc + item.quantity, 0) +
        filteredCart.customItems.reduce((acc, item) => acc + item.quantity, 0);
      const totalPrice =
        filteredCart.items.reduce(
          (acc, item) => acc + item.product.price * item.quantity,
          0
        ) +
        filteredCart.customItems.reduce(
          (acc, item) => acc + item.product.price * item.quantity,
          0
        );
      console.log(totalQuantiy, totalPrice);
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
        "origin"
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
    });

    return new Response(
      JSON.stringify({ clientSecret: session.client_secret, sessionId: session.id }),
      {
        status: 200,
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: err.statusCode || 500,
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
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: err.statusCode || 500,
    });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");
    if (!sessionId) throw new Error("missing_session_id");
    const session = await stripe.checkout.sessions.expire(sessionId);
    await deleteCheckoutSessionInDB(sessionId);
    return new Response(
      JSON.stringify({
        status: session.status,
      }),
      {
        status: 200,
      }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: err.statusCode || 500,
    });
  }
}
