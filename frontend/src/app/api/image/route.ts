import { NextResponse } from 'next/server';
import { callOdoo } from '@/lib/odoo';

async function servePlaceholder() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
    <rect width="512" height="512" fill="#F7F3EF"/>
    <text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle" 
      font-family="sans-serif" font-size="26" font-weight="bold" fill="#C8A97E" letter-spacing="6">
      NO IMAGE
    </text>
  </svg>`;
  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400'
    }
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const model = searchParams.get('model');
  const idStr = searchParams.get('id');
  const field = searchParams.get('field') || 'image_512';

  if (!model || !idStr) {
    return new NextResponse('Missing model or id', { status: 400 });
  }

  const id = parseInt(idStr);
  if (isNaN(id)) return servePlaceholder();

  try {
    const result = await callOdoo<any[]>(model, 'read', [[id], [field]]);
    
    if (!result || result.length === 0 || !result[0][field]) {
         return servePlaceholder();
    }
    
    const base64 = result[0][field];
    // In rare cases (e.g. some SVGs or URLs stored), Odoo might not return base64.
    // If it's a binary field it should be base64.
    if (typeof base64 !== 'string') {
        return servePlaceholder();
    }
    
    const buffer = Buffer.from(base64, 'base64');
    const isWebP = buffer.toString('utf8', 0, 4) === 'RIFF';

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': isWebP ? 'image/webp' : 'image/png',
        'Cache-Control': 'public, max-age=3600'
      }
    });

  } catch (err) {
    console.error(`[Image Proxy Error] ${model} ${id} ${field}`, err);
    return servePlaceholder();
  }
}
