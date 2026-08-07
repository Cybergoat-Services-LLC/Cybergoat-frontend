import { NextRequest, NextResponse } from 'next/server';
import { callPortalApi, getPortalToken } from '@/app/lib/portalAuth';

export async function GET(request: NextRequest, { params }: { params: Promise<{ invoiceNumber: string }> }) {
  const { invoiceNumber } = await params;

  const token = await getPortalToken();
  if (!token) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const apiRes = await callPortalApi(`/v1/invoices/${invoiceNumber}`, { token });
  const data = await apiRes.json();

  if (!apiRes.ok) {
    return NextResponse.json({ message: data?.message || 'Invoice not found' }, { status: apiRes.status });
  }

  return NextResponse.json(data);
}
