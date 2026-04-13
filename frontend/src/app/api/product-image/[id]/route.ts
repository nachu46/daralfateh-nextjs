import { NextResponse } from 'next/server';
import { callOdoo } from '@/lib/odoo';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: idStr } = await params;
  const id = parseInt(idStr);
  if (isNaN(id)) {
    return new NextResponse('Invalid ID', { status: 400 });
  }

  // Helper to serve the inline "NO IMAGE" SVG
  const servePlaceholder = () => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
      <rect width="512" height="512" fill="#F7F3EF"/>
      <text x="50%" y="48%" dominant-baseline="middle" text-anchor="middle"
        font-family="sans-serif" font-size="26" font-weight="bold" fill="#C8A97E" letter-spacing="6">
        NO IMAGE
      </text>
    </svg>`;
    return new NextResponse(svg, {
      headers: { 'Content-Type': 'image/svg+xml', 'Cache-Control': 'public, max-age=86400' }
    });
  };

  try {
    let imageBase64: string | null = null;

    // 1. Try product.template first
    try {
      const result = await callOdoo<any[]>('product.template', 'read', [[id], ['image_512']]);
      if (result?.[0]?.image_512) {
        imageBase64 = result[0].image_512;
      }
    } catch (e) {
      console.warn(`[Proxy] Template read failed for ID ${id}, trying variant...`);
    }

    // 2. Try product.product if template failed or had no image
    if (!imageBase64) {
      try {
        const variantResult = await callOdoo<any[]>('product.product', 'read', [[id], ['image_512']]);
        if (variantResult?.[0]?.image_512) {
          imageBase64 = variantResult[0].image_512;
        }
      } catch (e) {
        console.warn(`[Proxy] Variant read failed for ID ${id}`);
      }
    }

    if (!imageBase64) {
      return servePlaceholder();
    }

    const buffer = Buffer.from(imageBase64, 'base64');
    const isWebP = buffer.toString('utf8', 0, 4) === 'RIFF';

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': isWebP ? 'image/webp' : 'image/png',
        'Cache-Control': 'public, max-age=3600'
      }
    });

  } catch (err) {
    console.error('[Product Image Proxy Global Error]', err);
    return servePlaceholder();
  }
}
