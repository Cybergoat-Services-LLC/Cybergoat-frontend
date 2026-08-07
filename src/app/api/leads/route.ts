import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { saveLead, getLeads, TrackLead } from '@/app/lib/leads';
import { TRACK_DETAILS } from '@/app/lib/trackDetails';
import { isRateLimited, getClientIp } from '@/app/lib/rateLimit';
import { sendMail, escapeHtml } from '@/app/lib/mailer';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_FORMATS = ['Online Live Interactive', 'In-Person Dubai Bootcamp', 'Corporate Enterprise Team'];

function isAuthorized(req: NextRequest): boolean {
  const adminKey = process.env.ADMIN_API_KEY;
  if (!adminKey) return false;
  const provided = req.headers.get('x-admin-key');
  if (!provided) return false;
  // Length check first - timingSafeEqual throws on mismatched-length buffers
  // rather than returning false.
  const a = Buffer.from(provided);
  const b = Buffer.from(adminKey);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

function renderLeadEmail(lead: TrackLead): string {
  const rows = [
    lead.companyName ? `<p><strong>Company:</strong> ${escapeHtml(lead.companyName)}</p>` : '',
    `<p><strong>Track:</strong> ${escapeHtml(lead.trackTitle)} (${escapeHtml(lead.trackStage)})</p>`,
    `<p><strong>Name:</strong> ${escapeHtml(lead.name)}</p>`,
    `<p><strong>Email:</strong> ${escapeHtml(lead.email)}</p>`,
    `<p><strong>Phone / WhatsApp:</strong> ${escapeHtml(lead.phone)}</p>`,
    `<p><strong>Preferred Format:</strong> ${escapeHtml(lead.format)}</p>`,
    lead.details ? `<p><strong>Details:</strong> ${escapeHtml(lead.details)}</p>` : '',
    `<p><strong>Submitted:</strong> ${escapeHtml(lead.submittedAt)}</p>`,
  ];
  return `<h2>New ${lead.type === 'b2b' ? 'B2B Corporate' : 'Enrollment & Schedule'} Inquiry</h2>${rows.join('\n')}`;
}

// POST /api/leads: Public. Records a track enrollment inquiry or a B2B
// corporate training inquiry (discriminated by body.type).
export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    if (await isRateLimited('leads', ip, 5, 60)) {
      return NextResponse.json({ error: 'Too many submissions. Please try again in a minute.' }, { status: 429 });
    }

    const body = await req.json();
    const isB2B = body.type === 'b2b';

    if (typeof body.name !== 'string' || !body.name.trim() || body.name.length > 200) {
      return NextResponse.json({ error: 'A valid name is required.' }, { status: 400 });
    }

    if (typeof body.email !== 'string' || !EMAIL_PATTERN.test(body.email) || body.email.length > 200) {
      return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
    }

    if (typeof body.phone !== 'string' || !body.phone.trim() || body.phone.length > 50) {
      return NextResponse.json({ error: 'A valid phone number is required.' }, { status: 400 });
    }

    let lead: TrackLead;

    if (isB2B) {
      if (typeof body.companyName !== 'string' || !body.companyName.trim() || body.companyName.length > 200) {
        return NextResponse.json({ error: 'A valid company name is required.' }, { status: 400 });
      }

      lead = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type: 'b2b',
        trackStage: 'B2B',
        trackTitle: 'Corporate Training Inquiry',
        companyName: body.companyName.trim(),
        details: typeof body.details === 'string' ? body.details.trim().slice(0, 500) : undefined,
        name: body.name.trim(),
        email: body.email.trim(),
        phone: body.phone.trim(),
        format: 'Corporate Enterprise Team',
        submittedAt: new Date().toISOString(),
      };
    } else {
      const track = typeof body.stageKey === 'string' ? TRACK_DETAILS[body.stageKey] : undefined;
      if (!track) {
        return NextResponse.json({ error: 'Invalid track selected.' }, { status: 400 });
      }

      const safeFormat = typeof body.format === 'string' && VALID_FORMATS.includes(body.format) ? body.format : VALID_FORMATS[0];

      lead = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type: 'track',
        trackStage: track.stage,
        trackTitle: track.title,
        name: body.name.trim(),
        email: body.email.trim(),
        phone: body.phone.trim(),
        format: safeFormat,
        submittedAt: new Date().toISOString(),
      };
    }

    await saveLead(lead);

    const notifyTo = process.env.LEAD_NOTIFICATION_EMAIL || 'admin@cybergoat.ae';
    // Awaited deliberately - on Vercel's serverless runtime, a fire-and-forget
    // promise can be torn down the moment the response is returned, silently
    // dropping the notification. sendMail() already catches its own errors
    // and returns false rather than throwing, so this can't fail the request.
    await sendMail({
      to: notifyTo,
      subject: `New ${isB2B ? 'B2B Corporate' : 'Enrollment'} Inquiry: ${lead.name}${lead.companyName ? ` (${lead.companyName})` : ` - ${lead.trackTitle}`}`,
      html: renderLeadEmail(lead),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error saving lead:', err);
    return NextResponse.json({ error: 'Failed to save your inquiry.' }, { status: 500 });
  }
}

// GET /api/leads: Admin only. Returns all recorded enrollment inquiries.
export async function GET(req: NextRequest) {
  const ip = getClientIp(req);
  if (await isRateLimited('leads_admin', ip, 20, 60)) {
    return NextResponse.json({ error: 'Too many requests. Please try again in a minute.' }, { status: 429 });
  }

  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const leads = await getLeads();
  return NextResponse.json({ leads });
}
