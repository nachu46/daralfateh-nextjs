import { NextResponse } from 'next/server';
import { fetchProducts } from '@/lib/odoo';

export const revalidate = 60;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get('limit') || '20');
    const offset = Number(searchParams.get('offset') || '0');
    const categoryId = searchParams.get('category_id') ? Number(searchParams.get('category_id')) : undefined;
    const products = await fetchProducts({ limit, offset, categoryId });
    return NextResponse.json(products);
  } catch (err) {
    console.error('[API /products]', err);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
