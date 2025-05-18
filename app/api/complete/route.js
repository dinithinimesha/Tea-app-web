import Stripe from 'stripe';

export async function GET(req) {
  // Initialize Stripe inside the function
  const stripe = process.env.STRIPE_SECRET_KEY 
    ? new Stripe(process.env.STRIPE_SECRET_KEY)
    : null;
    
  // Check if Stripe is properly initialized
  if (!stripe) {
    return new Response('Error: Stripe API key is missing', { status: 500 });
  }
  
  const { searchParams } = new URL(req.url);
  const session_id = searchParams.get('session_id');

  if (!session_id) {
    return new Response('Error: Session ID is missing', { status: 400 });
  }

  try {
    const [session, items] = await Promise.all([
      stripe.checkout.sessions.retrieve(session_id, {
        expand: ['payment_intent.payment_method'],
      }),
      stripe.checkout.sessions.listLineItems(session_id),
    ]);

    console.log(JSON.stringify({ session, items }));

    return new Response('Your payment was successful');
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}