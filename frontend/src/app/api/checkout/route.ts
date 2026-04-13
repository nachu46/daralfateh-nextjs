import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { 
  createOrUpdatePartner, 
  createSaleOrder, 
  confirmSaleOrder, 
  callOdoo,
  sendOrderConfirmationEmail
} from '@/lib/odoo';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');

export async function POST(req: Request) {
  try {
    const { items, customer, billing, paymentIntentId } = await req.json();

    if (!paymentIntentId) {
       return NextResponse.json({ error: 'Payment information is missing.' }, { status: 400 });
    }

    // 1. Verify Payment with Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    if (paymentIntent.status !== 'succeeded') {
      return NextResponse.json({ error: `Payment status is ${paymentIntent.status}. Order cannot be finalized.` }, { status: 400 });
    }

    if (!items || !items.length) {
      return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 });
    }

    if (!customer || !customer.email || !customer.name) {
      return NextResponse.json({ error: 'Customer details are required for checkout.' }, { status: 400 });
    }

    // 2. Synchronize Partners with Odoo
    const partnerId = await createOrUpdatePartner(customer);
    let invoicePartnerId = partnerId;

    if (billing && billing.email && billing.email !== customer.email) {
       invoicePartnerId = await createOrUpdatePartner(billing);
    } else if (billing && billing.street && billing.street !== customer.street) {
       // Even if email is same, if address is different, create/update billing record
       invoicePartnerId = await createOrUpdatePartner({ ...billing, email: billing.email || customer.email });
    }

    // 3. Create the Sales Order in Odoo (Draft)
    const orderId = await createSaleOrder(partnerId, items, invoicePartnerId, partnerId);

    // 4. Confirm the Order (Draft -> Sale)
    await confirmSaleOrder(orderId);

    // 5. Trigger automated Odoo Email
    await sendOrderConfirmationEmail(orderId);

    // 6. Fetch final order details for success page
    const orderDetails = await callOdoo<{ name: string }[]>('sale.order', 'search_read', [[['id', '=', orderId]]], {
      fields: ['name'],
      limit: 1
    });

    const orderName = orderDetails.length ? orderDetails[0].name : `ORD-${orderId}`;

    return NextResponse.json({ 
      orderId, 
      orderName,
      success: true
    });

  } catch (err: any) {
    console.error('[API /checkout]', err);
    return NextResponse.json({ 
      error: err.message || 'We encountered an error while finalizing your order.' 
    }, { status: 500 });
  }
}
