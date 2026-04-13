import { NextResponse } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.error('[Stripe API Error]: STRIPE_SECRET_KEY is missing from environment variables.');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(req: Request) {
  try {
    const { items } = await req.json();
    
    // Log intent creation attempt (sanitized)
    console.log(`[Stripe INFO]: Creating PaymentIntent for ${items?.length} items.`);

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    // Calculate total amount in Cents (AED)
    const subtotal = items.reduce((acc: number, item: any) => acc + (item.price * item.quantity), 0);
    const totalAED = subtotal; // Shipping is now free for all orders
    
    // Stripe expects the amount in the smallest currency unit (fils for AED)
    const amountInCents = Math.round(totalAED * 100);

    if (amountInCents < 1) {
      throw new Error(`Invalid amount: ${amountInCents}`);
    }

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: 'aed',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (err: any) {
    console.error('[Stripe API Error Details]:', {
      message: err.message,
      type: err.type,
      code: err.code,
      param: err.param
    });
    return NextResponse.json({ 
      error: err.message || 'Failed to create payment intent' 
    }, { status: 500 });
  }
}
