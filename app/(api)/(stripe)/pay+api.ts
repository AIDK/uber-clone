import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { payment_method_id, payment_intent_id, customer_id } = body;

    // validate payment information
    if (!payment_intent_id || !payment_method_id || !customer_id) {
      return new Response(
        JSON.stringify({
          error: "Missing required payment information",
          status: 400,
        }),
      );
    }

    // create new payment method
    const paymentMethod = await stripe.paymentMethods.attach(
      payment_method_id,
      {
        customer: customer_id,
      },
    );

    // payment result
    const result = await stripe.paymentIntents.confirm(payment_intent_id, {
      payment_method: paymentMethod.id,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Payment successful",
        result: result,
      }),
    );
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: error, status: 500 }));
  }
}
