import { NextResponse } from 'next/server';
import { 
  createOrUpdatePartner, 
  createSaleOrder, 
  confirmSaleOrder, 
  getPaymentLink 
} from '@/lib/odoo';

export async function POST(req: Request) {
  try {
    const { items, customer } = await req.json();

    if (!items || !items.length) {
      return NextResponse.json({ error: 'Your pantry is empty.' }, { status: 400 });
    }

    if (!customer || !customer.email || !customer.name) {
      return NextResponse.json({ error: 'Customer details are required for checkout.' }, { status: 400 });
    }

    // 1. Synchronize Partner with Odoo
    const partnerId = await createOrUpdatePartner(customer);

    // 2. Create the Sales Order in Odoo (Draft)
    const orderId = await createSaleOrder(partnerId, items);

    // 3. Confirm the Order (Draft -> Sale)
    await confirmSaleOrder(orderId);

    // 4. Generate the secure native payment link
    const paymentUrl = await getPaymentLink(orderId);

    return NextResponse.json({ paymentUrl });

  } catch (err: any) {
    console.error('[API /checkout]', err);
    return NextResponse.json({ 
      error: err.message || 'We encountered an error while securing your payment portal.' 
    }, { status: 500 });
  }
}
