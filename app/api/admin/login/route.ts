import { NextResponse } from 'next/server';

/**
 * Server-side admin login endpoint.
 * Validates admin password with environment variable or fallback.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ success: false, message: 'Password is required' }, { status: 400 });
    }

    const adminPassword = process.env.ADMIN_PASSWORD || 'M@s!23QWEasd';

    if (password !== adminPassword) {
      return NextResponse.json({ success: false, message: 'Invalid admin password' }, { status: 401 });
    }

    // Generate session token for admin API calls
    const tokenPayload = `admin:${Date.now()}:${Math.random().toString(36).slice(2)}`;
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(tokenPayload + adminPassword));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const token = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    globalThis.__adminTokens = globalThis.__adminTokens || new Set();
    (globalThis.__adminTokens as Set<string>).add(token);

    setTimeout(() => {
      (globalThis.__adminTokens as Set<string>)?.delete(token);
    }, 3600000);

    return NextResponse.json({ success: true, token });
  } catch (err: any) {
    console.error('Admin login error:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
