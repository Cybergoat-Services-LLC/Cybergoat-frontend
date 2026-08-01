import { NextRequest, NextResponse } from 'next/server';
import { saveLead, getLeads, TrackLead } from '@/app/lib/leads';
import { TRACK_DETAILS } from '@/app/lib/trackDetails';
import { isRateLimited, getClientIp } from '@/app/lib/rateLimit';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_FORMATS = ['Online Live Interactive', 'In-Person Dubai Bootcamp', 'Corporate Enterprise Team'];

function isAuthorized(req: NextRequest): boolean {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) return false;
  return req.headers.get('x-admin-key') === adminKey;
}

// POST /api/leads: Public. Records a track enrollment inquiry.
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (await isRateLimited('leads', ip, 5, 60)) {
      return NextResponse.json({ error: 'Too many submissions. Please try again in a minute.' }, { status: 429 });
    }

    const body = await req.json();
    const { stageKey, name, email, phone, format } = body;

    const track = typeof stageKey === 'string' ? TRACK_DETAILS[stageKey] : undefined;
    if (!track) {
      return NextResponse.json({ error: 'Invalid track selected.' }, { status: 400 });
    }

    if (typeof name !== 'string' || !name.trim() || name.length > 200) {
      return NextResponse.json({ error: 'A valid name is required.' }, { status: 400 });
    }

    if (typeof email !== 'string' || !EMAIL_PATTERN.test(email) || email.length > 200) {
      return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
    }

    if (typeof phone !== 'string' || !phone.trim() || phone.length > 50) {
      return NextResponse.json({ error: 'A valid phone number is required.' }, { status: 400 });
    }

    const safeFormat = typeof format === 'string' && VALID_FORMATS.includes(format) ? format : VALID_FORMATS[0];

    const lead: TrackLead = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      trackStage: track.stage,
      trackTitle: track.title,
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      format: safeFormat,
      submittedAt: new Date().toISOString(),
    };

    await saveLead(lead);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error saving track lead:', err);
    return NextResponse.json({ error: 'Failed to save your inquiry.' }, { status: 500 });
  }
}

// GET /api/leads: Admin only. Returns all recorded enrollment inquiries.
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const leads = await getLeads();
  return NextResponse.json({ leads });
}
