import { NextResponse } from 'next/server';
import { callPortalApi, getPortalToken, PORTAL_TOKEN_COOKIE } from '@/app/lib/portalAuth';

export async function POST() {
  const token = await getPortalToken();

  if (token) {
    await callPortalApi('/v1/logout', { method: 'POST', token }).catch(() => {
      // Cookie gets cleared below regardless - a dead/expired token on the
      // Laravel side shouldn't block the user from logging out client-side.
    });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.delete(PORTAL_TOKEN_COOKIE);
  return response;
}
