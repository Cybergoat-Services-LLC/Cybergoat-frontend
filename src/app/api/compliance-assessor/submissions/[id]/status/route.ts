import { NextRequest, NextResponse } from 'next/server';
import { callPortalApi } from '@/app/lib/portalAuth';
import { isRateLimited, getClientIp } from '@/app/lib/rateLimit';

// GET /api/compliance-assessor/submissions/[id]/status: PUBLIC, unauthenticated.
// Thin proxy for the submitted-confirmation page to poll while a visitor's
// tab is open. No portal_token involved - this is the same anonymous
// top-of-funnel flow as /api/compliance-assessor/submit.
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (!/^\d+$/.test(id)) {
    return NextResponse.json({ success: false, message: 'Invalid submission id.' }, { status: 400 });
  }

  const ip = getClientIp(req);
  // Generous limit relative to /submit - this is a cheap read meant to be
  // polled repeatedly by a single visitor's open tab, not a per-submission cost.
  if (await isRateLimited('compliance_assessor_status', ip, 60, 60)) {
    return NextResponse.json({ success: false, message: 'Too many status checks. Please slow down.' }, { status: 429 });
  }

  const apiRes = await callPortalApi(`/v1/compliance-assessor/submissions/${id}/status`, { method: 'GET' });

  let data: unknown;
  try {
    data = await apiRes.json();
  } catch {
    return NextResponse.json({ success: false, message: 'Could not check status right now.' }, { status: 502 });
  }

  return NextResponse.json(data, { status: apiRes.status });
}
