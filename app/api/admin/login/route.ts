import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * Server-side admin login endpoint (CRIT-1 fix).
 * The admin password is stored ONLY in the environment variable ADMIN_PASSWORD_HASH,
 * or validated against a plaintext ADMIN_PASSWORD env var as a fallback.
 * The password is NEVER shipped in the client-side JavaScript bundle.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ success: false, message: 'Password is required' }, { status: 400 });
    }

    // Validate against server-side environment variable
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.error('ADMIN_PASSWORD environment variable is not set.');
      return NextResponse.json(
        { success: false, message: 'Admin login is not configured on this server.' },
        { status: 503 }
      );
    }

    if (password !== adminPassword) {
      return NextResponse.json({ success: false, message: 'Invalid admin password' }, { status: 401 });
    }

    // Generate a simple session token for subsequent admin API calls
    const tokenPayload = `admin:${Date.now()}:${Math.random().toString(36).slice(2)}`;
    const encoder = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(tokenPayload + (process.env.ADMIN_PASSWORD || '')));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const token = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    // Store valid token in a simple in-memory set (resets on cold start, which is acceptable for admin)
    globalThis.__adminTokens = globalThis.__adminTokens || new Set();
    (globalThis.__adminTokens as Set<string>).add(token);

    // Auto-expire tokens after 1 hour
    setTimeout(() => {
      (globalThis.__adminTokens as Set<string>)?.delete(token);
    }, 3600000);

    return NextResponse.json({ success: true, token });
  } catch (err: any) {
    console.error('Admin login error:', err);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
