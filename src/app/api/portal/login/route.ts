import { NextRequest, NextResponse } from 'next/server';
import { callPortalApi, setPortalTokenCookie } from '@/app/lib/portalAuth';
import { isRateLimited, getClientIp } from '@/app/lib/rateLimit';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  // Tighter than /api/leads - this is the endpoint a credential-stuffing
  // script would actually hit.
  if (await isRateLimited('portal_login', ip, 8, 60)) {
    return NextResponse.json({ message: 'Too many sign-in attempts. Please try again in a minute.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 });
  }

  const { email, password } = (body ?? {}) as { email?: unknown; password?: unknown };

  if (typeof email !== 'string' || !EMAIL_PATTERN.test(email) || email.length > 200) {
    return NextResponse.json({ message: 'A valid email is required.' }, { status: 400 });
  }

  if (typeof password !== 'string' || !password || password.length > 200) {
    return NextResponse.json({ message: 'A valid password is required.' }, { status: 400 });
  }

  const apiRes = await callPortalApi('/v1/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    clientIp: ip,
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
