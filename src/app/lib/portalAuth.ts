import { cookies } from 'next/headers';

export const PORTAL_TOKEN_COOKIE = 'portal_token';

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
export async function callPortalApi(path: string, init?: RequestInit & { token?: string }) {
  const { token, ...rest } = init ?? {};
  const headers = new Headers(rest.headers);
  headers.set('Accept', 'application/json');
  if (rest.body) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

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
