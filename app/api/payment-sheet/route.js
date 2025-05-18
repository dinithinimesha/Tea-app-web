// app/api/payment-sheet/route.js
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  try {
    const body = await req.json();
    const { amount, cart_items } = body;
    
    // Use the actual cart total if provided, otherwise fallback to a default
    const paymentAmount = amount || 1099; // amount in cents
    
    // Create or retrieve customer
    // You might want to tie this to the user's ID in a real app
    const customer = await stripe.customers.create();
    
    // Create an ephemeral key for the customer
    const ephemeralKey = await stripe.ephemeralKeys.create(
      { customer: customer.id },
      { apiVersion: '2023-10-16' }
    );
    
    // Create a payment intent with minimal metadata
    const paymentIntent = await stripe.paymentIntents.create({
      amount: paymentAmount,
      currency: 'usd', // Use the appropriate currency
      customer: customer.id,
      automatic_payment_methods: { enabled: true },
      metadata: {
        // Store minimal information
        item_count: cart_items.length.toString(),
        total_amount: paymentAmount.toString()
        // You could store a reference to a database record if needed
        // order_reference: generateOrderReference()
      }
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

// Optional: If you need to store the full cart details
// You could implement this function to save cart data to your database
// and return a reference ID
function storeCartDetailsInDatabase(cartItems) {
  // Store cart items in your database (Supabase, MongoDB, etc.)
  // Return a reference ID that can be stored in metadata
  return 'order_ref_123'; // This would be a real reference from your DB
}