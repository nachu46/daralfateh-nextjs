import { NextResponse } from 'next/server';
import { callOdoo, getCategoryImageUrl } from '@/lib/odoo';

export const revalidate = 300;

interface Category {
  id: number;
  name: string;
  parent_id: [number, string] | false;
}

export async function GET() {
  try {
    // Fetch ALL categories (parent + child) at once using unified bridge
    const allCats = await callOdoo<Category[]>(
      'product.public.category', 'search_read', [[]],
      { fields: ['id', 'name', 'parent_id'], limit: 100 }
    );

    // Build parent → children map
    const parents = allCats.filter((c: any) => !c.parent_id);
    const children = allCats.filter((c: any) => !!c.parent_id);

    const tree = parents.map((parent: any) => ({
      id: parent.id,
      name: parent.name,
      image_url: getCategoryImageUrl(parent.id),
      children: children
        .filter((c: any) => Array.isArray(c.parent_id) && c.parent_id[0] === parent.id)
        .map((c: any) => ({ id: c.id, name: c.name, image_url: getCategoryImageUrl(c.id) })),
    }));

    // If everything is flat (no parents), just return them all as top-level
    if (parents.length === 0) {
      return NextResponse.json(allCats.map((c: any) => ({
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
