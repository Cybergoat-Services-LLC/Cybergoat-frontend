import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { callPortalApi, PORTAL_TOKEN_COOKIE } from '@/app/lib/portalAuth';

/**
 * NextAuth redirects here after a real Google/LinkedIn OAuth handshake
 * completes. We read the raw provider token NextAuth stashed server-side
 * (see authOptions.ts jwt callback - never exposed to the client) and hand
 * it to the Laravel backend, which independently re-verifies it with
 * Google/LinkedIn before issuing a Sanctum token. This route never trusts
 * an email by itself - only a token the provider actually issued.
 */
export async function GET(request: NextRequest) {
  const loginUrl = new URL('/login', request.url);

  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  if (!token?.socialProvider || !token.socialToken) {
    loginUrl.searchParams.set('error', 'social_auth_failed');
    return NextResponse.redirect(loginUrl);
  }

  const apiRes = await callPortalApi('/v1/auth/social-login', {
    method: 'POST',
    body: JSON.stringify({
      provider: token.socialProvider,
      token: token.socialToken,
      bridge_secret: process.env.SOCIAL_LOGIN_BRIDGE_SECRET,
    }),
  });

  if (!apiRes.ok) {
    loginUrl.searchParams.set('error', 'social_auth_failed');
    return NextResponse.redirect(loginUrl);
  }

  const data = await apiRes.json();

  const response = NextResponse.redirect(new URL('/dashboard', request.url));
  response.cookies.set(PORTAL_TOKEN_COOKIE, data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
