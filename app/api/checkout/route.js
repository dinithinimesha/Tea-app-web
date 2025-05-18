// app/api/payment-sheet/route.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, cart_items } = body;

    const paymentAmount = amount || 1099; // amount in cents

    // Create a new customer
    const customer = await stripe.customers.create();

    // Create an ephemeral key for the customer
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2023-10-16' }
    );

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: paymentAmount,
      currency: 'lkr', // Updated to match frontend currency
      customer: customer.id,
      automatic_payment_methods: { enabled: true },
      metadata: {
        cart_items: JSON.stringify(cart_items.map(item => ({
          id: item.id,
          product_name: item.product_name,
          price: item.price,
          quantity: item.quantity,
        }))),
      },
    });

    return Response.json({
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
      publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
  } catch (error) {
    console.error('Payment sheet error:', error);
    return Response.json({ error: error.message }, { status: 400 });
  }
}
