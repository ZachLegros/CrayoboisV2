import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

function handleSuccess(event: Stripe.Event) {
  const checkoutSessionId = event.id;
  console.log("Checkout session succeed:", checkoutSessionId);
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) throw new Error("Missing stripe-signature");

  const data = await req.json();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(data, sig, endpointSecret);
  } catch (err: any) {
    return new Response(JSON.stringify({ error: `Webhook Error: ${err.message}` }), {
      status: 400,
    });
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      handleSuccess(event);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
}
