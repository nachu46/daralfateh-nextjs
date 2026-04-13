import { NextResponse } from 'next/server';
import { callOdoo } from '@/lib/odoo';

export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim();
    if (!q || q.length < 2) return NextResponse.json([]);

    const products = await callOdoo<{ id: number; name: string; list_price: number }[]>(
      'product.template', 'search_read',
      [[['name', 'ilike', q], ['sale_ok', '=', true], ['is_published', '=', true]]],
      { fields: ['id', 'name', 'list_price'], limit: 6, order: 'name asc' }
    );

    const categories = await callOdoo<{ id: number; name: string }[]>(
      'product.public.category', 'search_read',
      [[['name', 'ilike', q]]],
      { fields: ['id', 'name'], limit: 3 }
    );

    return NextResponse.json({
      products: products.map(p => ({ id: p.id, name: p.name, price: p.list_price })),
      categories: categories.map(c => ({ id: c.id, name: c.name })),
    });
  } catch (err) {
    console.error('[API /search]', err);
    return NextResponse.json({ products: [], categories: [] });
  }
}
