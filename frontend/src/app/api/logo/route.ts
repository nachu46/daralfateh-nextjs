import { NextResponse } from 'next/server';
import { callOdoo } from '@/lib/odoo';

export async function GET() {
  try {
    // Fetch website record using JSON-RPC
    // ID 1 is the default website ID in Odoo
    const result = await callOdoo<any[]>('website', 'read', [[1], ['logo']]);
    
    if (!result || result.length === 0 || !result[0].logo) {
      // Try fallback to website ID 2 or company logo if website 1 fails
      const companyResult = await callOdoo<any[]>('res.company', 'read', [[1], ['logo']]);
      if (!companyResult || companyResult.length === 0 || !companyResult[0].logo) {
           return new NextResponse('Logo not found', { status: 404 });
      }
      
      const buffer = Buffer.from(companyResult[0].logo, 'base64');
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }

    const buffer = Buffer.from(result[0].logo, 'base64');
    const isWebP = buffer.toString('utf8', 0, 4) === 'RIFF';
    
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': isWebP ? 'image/webp' : 'image/png',
        'Cache-Control': 'public, max-age=3600'
      }
    });

  } catch (err) {
    console.error('[API Logo Error]', err);
    return new NextResponse('Error fetching logo via RPC', { status: 500 });
  }
}
