import { NextRequest, NextResponse } from 'next/server';
import { callPortalApi, getPortalToken } from '@/app/lib/portalAuth';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const token = await getPortalToken();
  if (!token) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const apiRes = await callPortalApi(`/v1/lessons/${id}/download-url`, { method: 'POST', token });
  const data = await apiRes.json();

  if (!apiRes.ok) {
    return NextResponse.json({ message: data?.message || 'Failed to get download link' }, { status: apiRes.status });
  }

  return NextResponse.json(data);
}
