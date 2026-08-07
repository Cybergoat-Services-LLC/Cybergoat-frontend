import { NextRequest, NextResponse } from 'next/server';
import { callPortalApi, getPortalToken } from '@/app/lib/portalAuth';

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const token = await getPortalToken();
  if (!token) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const { coupon_code: couponCode } = (body ?? {}) as { coupon_code?: unknown };
  const payload: { coupon_code?: string } = {};
  if (typeof couponCode === 'string' && couponCode.trim()) {
    payload.coupon_code = couponCode.trim();
  }

  const apiRes = await callPortalApi(`/v1/courses/${slug}/checkout`, {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
  const data = await apiRes.json();

  if (!apiRes.ok) {
    return NextResponse.json({ message: data?.message || 'Could not start checkout for this course.' }, { status: apiRes.status });
  }

  return NextResponse.json(data);
}
