import { NextRequest, NextResponse } from 'next/server';
import { callPortalApi, setPortalTokenCookie } from '@/app/lib/portalAuth';
import { isRateLimited, getClientIp } from '@/app/lib/rateLimit';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (await isRateLimited('portal_register', ip, 8, 60)) {
    return NextResponse.json({ message: 'Too many attempts. Please try again in a minute.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 });
  }

  const { name, email, password, password_confirmation: passwordConfirmation } = (body ?? {}) as {
    name?: unknown;
    email?: unknown;
    password?: unknown;
    password_confirmation?: unknown;
  };

  if (typeof name !== 'string' || !name.trim() || name.length > 200) {
    return NextResponse.json({ message: 'A valid name is required.' }, { status: 400 });
  }

  if (typeof email !== 'string' || !EMAIL_PATTERN.test(email) || email.length > 200) {
    return NextResponse.json({ message: 'A valid email is required.' }, { status: 400 });
  }

  if (typeof password !== 'string' || !password || password.length > 200) {
    return NextResponse.json({ message: 'A valid password is required.' }, { status: 400 });
  }

  if (typeof passwordConfirmation !== 'string' || !passwordConfirmation || passwordConfirmation.length > 200) {
    return NextResponse.json({ message: 'Password confirmation is required.' }, { status: 400 });
  }

  const apiRes = await callPortalApi('/v1/register', {
    method: 'POST',
    body: JSON.stringify({ name: name.trim(), email, password, password_confirmation: passwordConfirmation }),
    clientIp: ip,
  });

  const data = await apiRes.json();

  if (!apiRes.ok) {
    const firstFieldError = data?.errors && Object.values(data.errors)[0] as string[] | undefined;
    const message = firstFieldError?.[0] || data?.message || 'Registration failed.';
    return NextResponse.json({ message }, { status: apiRes.status });
  }

  const response = NextResponse.json({ user: data.user });
  setPortalTokenCookie(response, data.token);
  return response;
}
