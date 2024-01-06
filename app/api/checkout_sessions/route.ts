import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "cad",
            product_data: {
              name: "Custom Product",
            },
            unit_amount: 12345,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      return_url: `${req.headers.get("origin")}/return?session_id={CHECKOUT_SESSION_ID}`,
    });
    return new Response(JSON.stringify({ clientSecret: session.client_secret }));
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: err.statusCode || 500 });
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
