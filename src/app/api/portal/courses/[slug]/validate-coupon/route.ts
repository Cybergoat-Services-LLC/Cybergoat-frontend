import { NextRequest, NextResponse } from 'next/server';
import { callPortalApi, getPortalToken } from '@/app/lib/portalAuth';
import { isRateLimited, getClientIp } from '@/app/lib/rateLimit';

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const token = await getPortalToken();
  if (!token) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const ip = getClientIp(request);
  // The backend endpoint itself is public/unauthenticated, which makes it a
  // brute-force target for guessing valid coupon codes - throttle it here
  // the same way login/register are throttled.
  if (await isRateLimited('portal_validate_coupon', ip, 15, 60)) {
    return NextResponse.json({ message: 'Too many coupon attempts. Please try again in a minute.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 });
  }

  const { code } = (body ?? {}) as { code?: unknown };
  if (typeof code !== 'string' || !code.trim() || code.length > 100) {
    return NextResponse.json({ message: 'A valid coupon code is required.' }, { status: 400 });
  }

  const apiRes = await callPortalApi(`/v1/courses/${slug}/validate-coupon`, {
    method: 'POST',
    token,
    body: JSON.stringify({ code: code.trim() }),
    clientIp: ip,
  });
  const data = await apiRes.json();

  if (!apiRes.ok) {
    return NextResponse.json({ message: data?.message || 'This coupon code is invalid, expired, or fully redeemed.' }, { status: apiRes.status });
  }

  return NextResponse.json(data);
}
