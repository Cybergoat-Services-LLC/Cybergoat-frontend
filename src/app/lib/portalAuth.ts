import { cookies } from 'next/headers';

export const PORTAL_TOKEN_COOKIE = 'portal_token';

function apiBaseUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!base) throw new Error('NEXT_PUBLIC_API_BASE_URL is not set');
  return base;
}

// Server-only call to the Laravel API. Never used from client components -
// the Sanctum token lives in an httpOnly cookie the browser can't read.
export async function callPortalApi(path: string, init?: RequestInit & { token?: string }) {
  const { token, ...rest } = init ?? {};
  const headers = new Headers(rest.headers);
  headers.set('Accept', 'application/json');
  if (rest.body) headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  return fetch(`${apiBaseUrl()}${path}`, { ...rest, headers, cache: 'no-store' });
}

export async function getPortalToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(PORTAL_TOKEN_COOKIE)?.value;
}
