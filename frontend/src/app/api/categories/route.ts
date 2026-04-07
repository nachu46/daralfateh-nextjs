import { NextResponse } from 'next/server';
import { getCategoryImageUrl } from '@/lib/odoo';

const ODOO_URL = process.env.ODOO_URL!;
const ODOO_DB = process.env.ODOO_DB!;
const ODOO_PASSWORD = process.env.ODOO_PASSWORD!;
const ODOO_USERNAME = process.env.ODOO_USERNAME!;

async function getUid() {
  const res = await fetch(`${ODOO_URL}/jsonrpc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0', method: 'call', id: 1,
      params: { service: 'common', method: 'authenticate', args: [ODOO_DB, ODOO_USERNAME, ODOO_PASSWORD, {}] },
    }),
    cache: 'no-store',
  });
  const json = await res.json();
  return json.result as number;
}

async function callOdoo<T>(uid: number, model: string, method: string, args: unknown[], kwargs = {}): Promise<T> {
  const res = await fetch(`${ODOO_URL}/jsonrpc`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0', method: 'call', id: 2,
      params: { service: 'object', method: 'execute_kw', args: [ODOO_DB, uid, ODOO_PASSWORD, model, method, args, kwargs] },
    }),
    next: { revalidate: 300 },
  });
  const json = await res.json();
  if (json.error) throw new Error(json.error.data?.message || 'Odoo error');
  return json.result as T;
}

export const revalidate = 300;

export async function GET() {
  try {
    const uid = await getUid();

    // Fetch ALL categories (parent + child) at once
    const allCats = await callOdoo<{ id: number; name: string; parent_id: number[] | false }[]>(
      uid, 'product.public.category', 'search_read', [[]],
      { fields: ['id', 'name', 'parent_id'], limit: 100 }
    );

    // Build parent → children map
    const parents = allCats.filter(c => !c.parent_id);
    const children = allCats.filter(c => !!c.parent_id);

    const tree = parents.map(parent => ({
      id: parent.id,
      name: parent.name,
      image_url: getCategoryImageUrl(parent.id),
      children: children
        .filter(c => Array.isArray(c.parent_id) && c.parent_id[0] === parent.id)
        .map(c => ({ id: c.id, name: c.name, image_url: getCategoryImageUrl(c.id) })),
    }));

    // If everything is flat (no parents), just return them all as top-level
    if (parents.length === 0) {
      return NextResponse.json(allCats.map(c => ({
        id: c.id,
        name: c.name,
        image_url: getCategoryImageUrl(c.id),
        children: [],
      })));
    }

    return NextResponse.json(tree);
  } catch (err) {
    console.error('[API /categories]', err);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}
