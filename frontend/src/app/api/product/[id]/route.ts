import { NextResponse } from 'next/server';
import { fetchProductById } from '@/lib/odoo';

export const revalidate = 60;

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await fetchProductById(Number(id));
    if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(product);
  } catch (err) {
    console.error('[API /product/[id]]', err);
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
