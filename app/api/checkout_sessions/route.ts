import Stripe from "stripe";
import {
  CartItemType,
  CartProductType,
  getCartProductHardwareId,
  getCartProductMaterialId,
} from "@/app/cart/store";
import { syncCartWithComponents } from "@/app/cart/actions";
import { getHardwareId, getMaterialId } from "@/utils/productUtils";
import { cookies } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const cart = (await req.json()) as CartItemType<CartProductType>[];
    if (!Array.isArray(cart) || !cart.length) throw new Error("cart_is_empty");
    const syncedCart = await syncCartWithComponents(cart);
    const isCartInSync = cart.every((item) =>
      syncedCart.some(
        (syncedItem) =>
          item.product.id === syncedItem.product.id &&
          getCartProductMaterialId(item.product) === getMaterialId(syncedItem.product) &&
          getCartProductHardwareId(item.product) === getHardwareId(syncedItem.product)
      )
    );
    if (!isCartInSync) throw new Error("cart_out_of_sync");

    const checkoutSid = cookies().get("checkout_sid")?.value;
    if (checkoutSid) {
      const session = await stripe.checkout.sessions.retrieve(checkoutSid);
      if (session.payment_status === "paid") {
        throw new Error("session_already_paid");
      }
      return new Response(JSON.stringify({ clientSecret: session.client_secret }), { status: 200 });
    }

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = syncedCart.map((item) => {
      return {
        price_data: {
          currency: "cad",
          product_data: {
            name: item.product.name,
          },
          unit_amount: item.product.price * 100,
        },
        quantity: item.quantity,
      };
    });
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      payment_method_types: ["card"],
      billing_address_collection: "required",
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
      line_items: lineItems,
      mode: "payment",
      return_url: `${req.headers.get("origin")}/checkout?session_id={CHECKOUT_SESSION_ID}`,
    });
    // TODO: Save session.id to database alongside order details
    console.log("New checkout session:", session.id);
    const expires = new Date(Date.now() + 60 * 30 * 1000).toUTCString();
    return new Response(JSON.stringify({ clientSecret: session.client_secret }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": `checkout_sid=${session.id}; httpOnly=true; expires=${expires}`,
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: err.statusCode || 500,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": "checkout_sid=; httpOnly=true; expires=Thu, 01 Jan 1970 00:00:00 GMT",
      },
    });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get("session_id");
    if (!sessionId) throw new Error("Missing session_id");
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return new Response(
      JSON.stringify({
        status: session.status,
        customer_details: session.customer_details,
      })
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: err.statusCode || 500 });
  }
}
