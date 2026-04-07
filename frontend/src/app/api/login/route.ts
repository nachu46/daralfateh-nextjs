import { NextResponse } from 'next/server';

const ODOO_URL = process.env.ODOO_URL!;
const ODOO_DB = process.env.ODOO_DB!;

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // Call Odoo authenticate service via JSON-RPC
    const res = await fetch(`${ODOO_URL}/jsonrpc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method: 'call',
        id: 1,
        params: {
          service: 'common',
          method: 'authenticate',
          args: [ODOO_DB, email, password, {}],
        },
      }),
    });

    const json = await res.json();

    if (json.error) {
      return NextResponse.json({ error: json.error.data?.message || 'Odoo auth error' }, { status: 401 });
    }

    const uid = json.result;

    if (!uid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Success - return user data (mocking the session/token for this basic integration)
    return NextResponse.json({
      id: uid,
      name: email === 'admin' ? 'Administrator' : email.split('@')[0],
      email: email,
      token: `session_${uid}_${Date.now()}`,
    });

  } catch (err) {
    console.error('[API /login]', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
