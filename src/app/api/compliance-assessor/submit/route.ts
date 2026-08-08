import { NextRequest, NextResponse } from 'next/server';
import { callPortalApi } from '@/app/lib/portalAuth';
import { isRateLimited, getClientIp } from '@/app/lib/rateLimit';

// POST /api/compliance-assessor/submit: PUBLIC, unauthenticated - unlike
// every other route handler in this codebase, this one deliberately does
// NOT call getPortalToken()/require a portal_token cookie. It's the
// top-of-funnel DESC ISR Readiness Score lead-gen tool, open to anonymous
// site visitors who have never logged in.
//
// Rate-limited here in addition to whatever the backend enforces, since
// each submission triggers real AI processing cost - defense in depth
// against someone hammering this endpoint directly, bypassing the client.

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FILE_BYTES = 20 * 1024 * 1024; // 20MB per file, mirrors client-side check
const MAX_FILES = 10;
const ALLOWED_EXTENSIONS = ['.pdf', '.docx'];
const VALID_FRAMEWORKS = ['desc_isr', 'pdpl', 'ai_security_policy'] as const;
const VALID_AI_ROLES = ['provider', 'consumer', 'end_user'] as const;

function hasAllowedExtension(filename: string): boolean {
  const lower = filename.toLowerCase();
  return ALLOWED_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  if (await isRateLimited('compliance_assessor_submit', ip, 3, 300)) {
    return NextResponse.json(
      { success: false, message: 'Too many submissions from this connection. Please try again in a few minutes.' },
      { status: 429 }
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ success: false, message: 'Invalid form submission.' }, { status: 400 });
  }

  const name = form.get('name');
  const company = form.get('company');
  const workEmail = form.get('work_email');
  const documents = form.getAll('documents[]').filter((v): v is File => v instanceof File);
  const frameworks = form
    .getAll('frameworks[]')
    .filter((v): v is string => typeof v === 'string');
  const isFreeZoneEntityRaw = form.get('is_free_zone_entity');
  const aiStakeholderRole = form.get('ai_stakeholder_role');

  if (typeof name !== 'string' || !name.trim() || name.length > 200) {
    return NextResponse.json({ success: false, message: 'A valid name is required.' }, { status: 422 });
  }
  if (typeof company !== 'string' || !company.trim() || company.length > 200) {
    return NextResponse.json({ success: false, message: 'A valid company name is required.' }, { status: 422 });
  }
  if (typeof workEmail !== 'string' || !EMAIL_PATTERN.test(workEmail) || workEmail.length > 200) {
    return NextResponse.json({ success: false, message: 'A valid work email is required.' }, { status: 422 });
  }
  if (documents.length === 0) {
    return NextResponse.json({ success: false, message: 'Please attach at least one policy document.' }, { status: 422 });
  }
  if (documents.length > MAX_FILES) {
    return NextResponse.json({ success: false, message: `Please attach no more than ${MAX_FILES} files.` }, { status: 422 });
  }
  for (const file of documents) {
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        { success: false, message: `"${file.name}" is larger than 20MB. Please upload a smaller file.` },
        { status: 422 }
      );
    }
    if (!hasAllowedExtension(file.name)) {
      return NextResponse.json(
        { success: false, message: `"${file.name}" is not a supported file type. Please upload PDF or DOCX only.` },
        { status: 422 }
      );
    }
  }
  if (frameworks.length === 0 || !frameworks.every((f) => (VALID_FRAMEWORKS as readonly string[]).includes(f))) {
    return NextResponse.json(
      { success: false, message: 'Please select at least one framework to be assessed against.' },
      { status: 422 }
    );
  }
  const frameworksSelected = new Set(frameworks);
  if (frameworksSelected.has('pdpl') && isFreeZoneEntityRaw !== 'true' && isFreeZoneEntityRaw !== 'false') {
    return NextResponse.json(
      { success: false, message: 'Please tell us whether your business is registered onshore or in a free zone.' },
      { status: 422 }
    );
  }
  if (
    frameworksSelected.has('ai_security_policy') &&
    (typeof aiStakeholderRole !== 'string' || !(VALID_AI_ROLES as readonly string[]).includes(aiStakeholderRole))
  ) {
    return NextResponse.json(
      { success: false, message: 'Please select the option that best describes your organization’s relationship to AI.' },
      { status: 422 }
    );
  }

  const forwardForm = new FormData();
  forwardForm.set('name', name.trim());
  forwardForm.set('company', company.trim());
  forwardForm.set('work_email', workEmail.trim());
  for (const framework of frameworks) {
    forwardForm.append('frameworks[]', framework);
  }
  if (frameworksSelected.has('pdpl')) {
    forwardForm.set('is_free_zone_entity', isFreeZoneEntityRaw as string);
  }
  if (frameworksSelected.has('ai_security_policy')) {
    forwardForm.set('ai_stakeholder_role', aiStakeholderRole as string);
  }
  for (const file of documents) {
    forwardForm.append('documents[]', file, file.name);
  }

  const apiRes = await callPortalApi('/v1/compliance-assessor/submit', {
    method: 'POST',
    body: forwardForm,
    clientIp: ip,
  });

  let data: unknown;
  try {
    data = await apiRes.json();
  } catch {
    return NextResponse.json(
      { success: false, message: 'Could not reach the assessment service. Please try again shortly.' },
      { status: 502 }
    );
  }

  return NextResponse.json(data, { status: apiRes.status });
}
