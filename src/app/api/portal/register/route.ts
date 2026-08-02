import { NextRequest, NextResponse } from 'next/server';
import { callPortalApi, PORTAL_TOKEN_COOKIE } from '@/app/lib/portalAuth';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const apiRes = await callPortalApi('/v1/register', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  const data = await apiRes.json();

  if (!apiRes.ok) {
    const firstFieldError = data?.errors && Object.values(data.errors)[0] as string[] | undefined;
    const message = firstFieldError?.[0] || data?.message || 'Registration failed.';
    return NextResponse.json({ message }, { status: apiRes.status });
  }

  const response = NextResponse.json({ user: data.user });
  response.cookies.set(PORTAL_TOKEN_COOKIE, data.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
