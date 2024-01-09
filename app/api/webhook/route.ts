import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { deleteCheckoutSessionInDB } from "../checkout_sessions/route";
import { orZero } from "../utils";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

async function setCheckoutSessionCompleted(checkoutSid: string) {
  return prisma.checkoutSession.update({
    where: { sid: checkoutSid },
    data: { status: "completed" },
  });
}

async function createOrder(event: Stripe.CheckoutSessionCompletedEvent) {
  try {
    const customerDetails = event.data.object.customer_details;
    const email = customerDetails?.email;
    const name = customerDetails?.name;
    const address = customerDetails?.address;
    const line1 = address?.line1;
    const postal_code = address?.postal_code;
    const city = address?.city;
    const country = address?.country;
    const state = address?.state;
    if (!email || !name || !address || !line1 || !postal_code || !city || !country || !state)
      throw new Error("Missing customer details");

    const checkoutSession = await prisma.checkoutSession.findUnique({
      where: { sid: event.data.object.id },
      include: { items: true, custom_items: true },
    });
    if (!checkoutSession) throw new Error("Checkout session not found");
    const { items, custom_items, shipping_id } = checkoutSession;
    const shipping = await prisma.shipping.findUnique({ where: { id: shipping_id } });
    const eventAmount = orZero(event.data.object.amount_total) / 100;
    const totalTax = orZero(0.05 * eventAmount) - orZero(0.09975 * eventAmount);
    const totalShipping = orZero(shipping?.price);
    const totalAmount = orZero(eventAmount) - totalShipping - totalTax;
    const order = await prisma.clientOrder.create({
      data: {
        products: {
          connect: items?.map((item) => ({ id: item.productId })) || [],
        },
        custom_products: {
          connect: custom_items?.map((item) => ({ id: item.customProductId })) || [],
        },
        payer_email: email,
        payer_name: name,
        address_street: line1,
        address_city: city,
        address_country: country,
        address_zip: postal_code,
        address_state: state,
        shipping: totalShipping,
        amount: totalAmount,
        tax: totalTax,
      },
    });
    console.log("Order created:", order.id);
    return order;
  } catch (error) {
    console.error(error);
  }
}

async function handleSuccess(event: Stripe.CheckoutSessionCompletedEvent) {
  const checkoutSessionId = event.data.object.id;
  console.log("Checkout session completed:", checkoutSessionId);
  await createOrder(event);
  return await setCheckoutSessionCompleted(checkoutSessionId);
}

async function handleExpire(event: Stripe.CheckoutSessionExpiredEvent) {
  const checkoutSid = event.data.object.id;
  console.log("Checkout session expired:", checkoutSid);
  return await deleteCheckoutSessionInDB(checkoutSid);
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) throw new Error("Missing stripe-signature");

  let event: Stripe.Event;
  try {
    const data = await req.text();
    event = stripe.webhooks.constructEvent(data, sig, endpointSecret);
  } catch (err: any) {
    return new Response(JSON.stringify({ error: `Webhook Error: ${err.message}` }), {
      status: 400,
    });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleSuccess(event);
        break;
      case "checkout.session.expired":
        await handleExpire(event);
        break;
      default:
        console.log(`Unhandled event type ${event.type} for ${event.id}`);
    }
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
