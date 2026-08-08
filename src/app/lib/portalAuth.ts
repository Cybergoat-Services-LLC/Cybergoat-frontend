import { cookies } from 'next/headers';
import type { NextResponse } from 'next/server';

export const PORTAL_TOKEN_COOKIE = 'portal_token';

// The backend Sanctum token itself never expires (see config/sanctum.php) -
// this cookie's lifetime is the only thing that ever forces a student back
// to the login screen, so keep it long. Shared by login/register/social-callback
// so the three routes can't drift out of sync with each other.
const PORTAL_TOKEN_MAX_AGE = 60 * 60 * 24 * 90;

export function setPortalTokenCookie(response: NextResponse, token: string): void {
  response.cookies.set(PORTAL_TOKEN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: PORTAL_TOKEN_MAX_AGE,
  });
}

function apiBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error('NEXT_PUBLIC_API_BASE_URL is not set');
  return base;
}

// Server-only call to the Laravel API. Never used from client components -
// the Sanctum token lives in an httpOnly cookie the browser can't read.
//
// Network failures (backend unreachable, DNS blip, timeout) are caught here
// and turned into a synthetic non-ok Response rather than left to throw -
// every existing caller already branches on `res.ok`/`res.status`, so this
// keeps them all working without a caller-side try/catch, and avoids an
// uncaught exception crashing a Server Component's render into Next's
// generic error page.
export async function callPortalApi(path: string, init?: RequestInit & { token?: string; clientIp?: string }) {
  const { token, clientIp, ...rest } = init ?? {};
  const headers = new Headers(rest.headers);
  headers.set('Accept', 'application/json');
  // FormData bodies (multipart file uploads) must NOT get a manual
  // Content-Type - fetch sets its own with the correct random boundary.
  // Setting it ourselves (or leaving a stale one from a caller) breaks
  // the backend's multipart parser.
  if (rest.body && !(rest.body instanceof FormData)) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  // Lets the backend's own per-IP login throttle key on the real visitor
  // instead of a shared identity - only meaningful once the backend trusts
  // its proxy enough to read this instead of the raw socket IP.
  if (clientIp) headers.set('X-Forwarded-For', clientIp);

  try {
    return await fetch(`${apiBaseUrl()}${path}`, { ...rest, headers, cache: 'no-store' });
  } catch {
    return new Response(JSON.stringify({ success: false, message: 'Could not reach the backend.' }), {
      status: 599,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function getPortalToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(PORTAL_TOKEN_COOKIE)?.value;
}
