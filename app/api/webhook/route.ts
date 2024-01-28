import Stripe from "stripe";
import { handleExpire, handleSuccess } from "./createOrder";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) throw new Error("Missing stripe-signature");

  let event: Stripe.Event;
  try {
    const data = await req.text();
    event = stripe.webhooks.constructEvent(data, sig, endpointSecret);
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: `Webhook Error: ${
          (err as Stripe.errors.StripeSignatureVerificationError).message
        }`,
      }),
      {
        status: 400,
      },
    );
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
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
    });
  }
}
