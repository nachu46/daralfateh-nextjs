import { NextResponse } from 'next/server';
import { trackOrder } from '@/lib/odoo';

export async function POST(req: Request) {
  try {
    const { orderRef, email } = await req.json();

    if (!orderRef || !email) {
      return NextResponse.json({ error: 'Order Number and Email are required.' }, { status: 400 });
    }

    const order = await trackOrder(orderRef.trim(), email.trim());

    if (!order) {
      return NextResponse.json({ 
        error: 'No matching order found. Please check your Order Number and Email address.' 
      }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (err: any) {
    console.error('[Tracking API Error]:', err);
    return NextResponse.json({ error: 'Failed to retrieve order tracking information.' }, { status: 500 });
  }
}
