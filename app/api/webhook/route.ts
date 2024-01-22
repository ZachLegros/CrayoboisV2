import Stripe from "stripe";
import prisma from "@/lib/prisma";
import { deleteCheckoutSessionInDB } from "../checkout_sessions/route";
import { orZero } from "../utils";
import { getTps, getTvq } from "@/lib/utils";

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
    if (
      !email ||
      !name ||
      !address ||
      !line1 ||
      !postal_code ||
      !city ||
      !country ||
      !state
    )
      throw new Error("Missing customer details");

    const checkoutSession = await prisma.checkoutSession.findUnique({
      where: { sid: event.data.object.id },
      include: { items: true, custom_items: true },
    });
    if (!checkoutSession) throw new Error("Checkout session not found");
    const { items, custom_items, shipping_id, user_id } = checkoutSession;

    // Get shipping object
    const shipping = await prisma.shipping.findUnique({
      where: { id: shipping_id },
    });

    // Get profile id from user id if it exists
    let profileId: string | undefined;
    const profile = await prisma.profile.findMany({
      where: {
        OR: [{ id: user_id as string | undefined }, { email }],
      },
    });
    if (profile[0]) profileId = profile[0].id;

    const eventAmount = orZero(event.data.object.amount_total) / 100;
    const totalTax = orZero(getTps(eventAmount)) + orZero(getTvq(eventAmount));
    const totalShipping = orZero(shipping?.price);
    const totalAmount = orZero(eventAmount) - totalShipping - totalTax;
    const [products, customProducts] = await Promise.all([
      prisma.product.findMany({
        where: {
          id: {
            in: items?.map((item) => item.productId) || [],
          },
        },
        select: {
          id: true,
          name: true,
          price: true,
          image: true,
        },
      }),
      prisma.customProduct.findMany({
        where: {
          id: {
            in: custom_items?.map((item) => item.customProductId) || [],
          },
        },
        include: {
          material: {
            select: {
              id: true,
              name: true,
              price: true,
              image: true,
            },
          },
          hardware: {
            select: {
              id: true,
              name: true,
              price: true,
              image: true,
            },
          },
        },
      }),
    ]);

    const order = await prisma.clientOrder.create({
      data: {
        products: products,
        custom_products: customProducts,
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
        user_id: profileId,
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
  setCheckoutSessionCompleted(checkoutSessionId);
  const order = await createOrder(event);
  if (!order) throw new Error("Order not created");
  return new Response(JSON.stringify({ order_id: order.id }), { status: 200 });
}

async function handleExpire(event: Stripe.CheckoutSessionExpiredEvent) {
  const checkoutSid = event.data.object.id;
  console.log("Checkout session expired:", checkoutSid);
  await deleteCheckoutSessionInDB(checkoutSid);
  return new Response(null, { status: 200 });
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
        return await handleSuccess(event);
      case "checkout.session.expired":
        return await handleExpire(event);
      default:
        console.log(`Unhandled event type ${event.type} for ${event.id}`);
        throw new Error(`Unhandled event type ${event.type} for ${event.id}`);
    }
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
