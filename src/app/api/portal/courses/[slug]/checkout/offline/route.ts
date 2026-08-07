import { NextRequest, NextResponse } from 'next/server';
import { callPortalApi, getPortalToken } from '@/app/lib/portalAuth';

const VALID_METHODS = new Set(['bank_transfer', 'aani_qr']);

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
    return NextResponse.json({ message: 'Invalid request body.' }, { status: 400 });
  }

  const { payment_method: paymentMethod, coupon_code: couponCode } = (body ?? {}) as {
    payment_method?: unknown;
    coupon_code?: unknown;
  };

  if (typeof paymentMethod !== 'string' || !VALID_METHODS.has(paymentMethod)) {
    return NextResponse.json({ message: 'A valid payment method is required.' }, { status: 400 });
  }

  const payload: { payment_method: string; coupon_code?: string } = { payment_method: paymentMethod };
  if (typeof couponCode === 'string' && couponCode.trim()) {
    payload.coupon_code = couponCode.trim();
  }

  const apiRes = await callPortalApi(`/v1/courses/${slug}/checkout/offline`, {
    method: 'POST',
    token,
    body: JSON.stringify(payload),
  });
  const data = await apiRes.json();

  if (!apiRes.ok) {
    return NextResponse.json({ message: data?.message || 'Could not start offline checkout for this course.' }, { status: apiRes.status });
  }

  return NextResponse.json(data);
}
