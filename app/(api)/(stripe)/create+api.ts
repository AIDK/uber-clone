import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, amount } = body;

  if (!name || !email || !amount) {
    return new Response(
      JSON.stringify({
        error: "Please enter a valid email address",
        status: 400,
      }),
    );
  }

  let customer;
  const existingCustomer = await stripe.customers.list({ email });

  if (existingCustomer.data.length > 0) {
    // assign existing customer to variable
    customer = existingCustomer.data[0];
  } else {
    // create new customer and assign
    customer = await stripe.customers.create({
      name,
      email,
    });
  }

  // get the key for the transaction
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: "2025-01-27.acacia" },
  );

  // create payment intent
  const paymentIntent = await stripe.paymentIntents.create({
    amount: parseInt(amount) * 100, // payments are in cents to we must multiply to get real value
    currency: "usd", //TODO: get currency code from region
    customer: customer.id,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: "never",
    },
  });

  return new Response(
    JSON.stringify({
      paymentIntent: paymentIntent,
      ephemeralKey: ephemeralKey,
      customer: customer.id,
    }),
  );
}
