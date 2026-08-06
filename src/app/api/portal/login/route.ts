import { NextRequest, NextResponse } from 'next/server';
import { callPortalApi, setPortalTokenCookie } from '@/app/lib/portalAuth';

export async function POST(request: NextRequest) {
  const body = await request.json();

  const apiRes = await callPortalApi('/v1/login', {
    method: 'POST',
    body: JSON.stringify(body),
  });

  const data = await apiRes.json();

  if (!apiRes.ok) {
    const message = data?.errors?.email?.[0] || data?.message || 'Sign in failed.';
    return NextResponse.json({ message }, { status: apiRes.status });
  }

  const response = NextResponse.json({ user: data.user });
  setPortalTokenCookie(response, data.token);
  return response;
}
