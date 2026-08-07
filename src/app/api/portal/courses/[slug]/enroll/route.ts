import { NextRequest, NextResponse } from 'next/server';
import { callPortalApi, getPortalToken } from '@/app/lib/portalAuth';

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const token = await getPortalToken();
  if (!token) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const apiRes = await callPortalApi(`/v1/courses/${slug}/enroll`, { method: 'POST', token });
  const data = await apiRes.json();

  if (!apiRes.ok) {
    return NextResponse.json({ message: data?.message || 'Failed to enroll in this course.' }, { status: apiRes.status });
  }

  return NextResponse.json(data);
}
