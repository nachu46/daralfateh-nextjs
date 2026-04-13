import { NextResponse } from 'next/server';

export async function GET() {
  const odooUrl = process.env.ODOO_URL;
  if (!odooUrl) {
    return new NextResponse('Missing ODOO_URL', { status: 500 });
  }
  
  try {
    // In Odoo, the main company / website logo is typically available at this path.
    // We add a unique cache buster or simply let Next.js cache it.
    const res = await fetch(`${odooUrl}/web/image/website/1/logo`);
    
    if (!res.ok) {
      return new NextResponse('Failed to fetch logo from Odoo', { status: res.status });
    }
    
    const buffer = await res.arrayBuffer();
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': res.headers.get('Content-Type') || 'image/png',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (err) {
    console.error('[API Logo Error]', err);
    return new NextResponse('Error fetching logo', { status: 500 });
  }
}
