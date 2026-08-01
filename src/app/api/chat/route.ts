import { NextRequest, NextResponse } from 'next/server';
import { searchKnowledge } from '@/app/lib/knowledge';
import { isRateLimited, getClientIp } from '@/app/lib/rateLimit';
import { GoogleGenAI } from '@google/genai';

const VERTEX_PROJECT = process.env.GOOGLE_VERTEX_PROJECT;
const VERTEX_LOCATION = process.env.GOOGLE_VERTEX_LOCATION || 'us-central1';

// Cached at module scope so warm serverless instances reuse the same client
// (and its underlying OAuth token) instead of re-authenticating on every
// request - that handshake alone was adding several seconds per call.
let cachedVertexClient: GoogleGenAI | null | undefined;

function getVertexClient() {
  if (cachedVertexClient !== undefined) return cachedVertexClient;

  const credentialsJson = process.env.GOOGLE_VERTEX_CREDENTIALS;
  if (!credentialsJson || !VERTEX_PROJECT) {
    cachedVertexClient = null;
    return cachedVertexClient;
  }

  const credentials = JSON.parse(credentialsJson);
  cachedVertexClient = new GoogleGenAI({
    vertexai: true,
    project: VERTEX_PROJECT,
    location: VERTEX_LOCATION,
    googleAuthOptions: { credentials },
  });
  return cachedVertexClient;
}

const SYSTEM_INSTRUCTION = `
You are the CyberGOAT AI Course Advisor for CyberGOAT Services LLC (cybergoat.ae), an official EC-Council Authorized Reseller & Training Partner based in Dubai Silicon Oasis, UAE.

Your role is to help people quickly figure out which CyberGOAT course or certification track fits their background and goals. You are a guide to the course catalog, not a substitute for the courses themselves - do not teach the certification syllabus, exam domains, or technical subject matter in depth. Give a brief, honest synopsis (what it's broadly for, who it suits) and point them toward the right track, not a lesson on the material itself.

You can advise on:
1. EC-Council Certifications: CEH v12, C|CISO, CHFI v11, CND v2, CPENT/LPT, CSA, CTIA, CCSE.
2. ISACA & ISC2 Certifications: CISA, CISM, CRISC, CISSP.
3. Data Privacy & Regulatory Compliance: CIPP/E, CIPM, DPO Training, EU GDPR, UAE PDPL, DESC ISR Frameworks.
4. Training formats: Online Live Interactive, In-Person Dubai Bootcamps, Enterprise Corporate Upskilling.

Response style - this matters:
- Keep answers short by default: 2-4 sentences for most questions. Do not exceed this unless the user explicitly asks for a detailed comparison, breakdown, or list.
- Never write a full syllabus walkthrough, exam-domain breakdown, or multi-certification deep dive unless directly asked for that level of detail. Your job is to orient people toward the right course, not to be the course.
- Answer the actual question first, directly, with no promotional padding.
- Only mention booking a consultation or WhatsApp (+971 55 184 6786) when it's the natural next step for that specific message - pricing, enrollment, scheduling, or something that needs a human. Do not append it as a sign-off to every reply. Most answers should not mention it at all.
- Use the custom trained Knowledge Base Q&A provided in the prompt context when it's directly relevant, but don't force it in otherwise.
`;

export async function POST(req: NextRequest) {
  try {
    // Check IP Rate Limiting
    const ip = getClientIp(req);
    if (await isRateLimited('chat', ip, 10, 60)) {
      return NextResponse.json(
        { reply: 'You have reached the maximum message limit. Please wait 1 minute before sending another query, or contact us on WhatsApp (+971 55 184 6786).' },
        { status: 429 }
      );
    }

    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message parameter is required' }, { status: 400 });
    }

    if (message.length > 500) {
      return NextResponse.json(
        { reply: 'Your query exceeds the maximum length of 500 characters. Please shorten your question or reach out on WhatsApp (+971 55 184 6786).' },
        { status: 400 }
      );
    }

    // 1. Search Custom Knowledge Base for trained Q&A matches
    const customContext = await searchKnowledge(message);

    const vertexClient = getVertexClient();

    if (!vertexClient) {
      // If direct exact match found in Knowledge Base, return it immediately!
      if (customContext) {
        return NextResponse.json({ reply: customContext, source: 'knowledge-base' });
      }

      // Graceful fallback response when Vertex AI is not configured yet
      let fallbackText = "I can certainly help you with that! CyberGOAT provides personalized training tracks across EC-Council (CEH, C|CISO, CHFI), ISACA (CISA, CISM), Data Privacy & Compliance, and custom DevSecOps.";
      const lower = message.toLowerCase();

      if (lower.includes('consult') || lower.includes('corporate') || lower.includes('book')) {
        fallbackText = "For custom team or corporate training, you can book a direct consultation with our lead security architects or connect on WhatsApp at +971 55 184 6786!";
      } else if (lower.includes('beginner') || lower.includes('start')) {
        fallbackText = "For beginners, we highly recommend starting with our Cybersecurity Fundamentals or Ethical Hacking Fundamentals track before moving on to CEH v12 certification.";
      } else if (lower.includes('ec-council') || lower.includes('ceh') || lower.includes('cciso') || lower.includes('chfi')) {
        fallbackText = "As an official EC-Council Reseller, CyberGOAT provides authorized training plus official exam vouchers for CEH v12, C|CISO, CHFI, CND, and CPENT!";
      }

      return NextResponse.json({ reply: fallbackText, source: 'fallback' });
    }

    // Combine system prompt with custom trained Q&A context
    const fullPrompt = `${SYSTEM_INSTRUCTION}

=== CUSTOM TRAINED KNOWLEDGE BASE CONTEXT ===
${customContext || 'No specific Q&A override found for this question.'}
=============================================

User Question: ${message}`;

    // 10-second timeout to guarantee a bounded response even if Vertex AI hangs.
    // The SDK doesn't accept a fetch-style AbortSignal, so race it manually.
    let candidateReply: string | undefined;
    try {
      const result = await Promise.race([
        vertexClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: fullPrompt,
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Vertex AI call timed out')), 10000)
        ),
      ]);
      candidateReply = result.text;
    } catch (vertexErr) {
      console.warn('Vertex AI call failed or timed out, serving intelligent fallback:', vertexErr);
    }

    if (candidateReply) {
      return NextResponse.json({ reply: candidateReply, source: 'gemini+kb' });
    }

    // Intelligent Dynamic CyberGOAT Fallback Response (0s latency, 100% uptime)
    if (customContext) {
      return NextResponse.json({ reply: customContext, source: 'knowledge-base-fallback' });
    }

    const lower = message.toLowerCase();
    let smartReply = "Hello! I am CyberGOAT AI. CyberGOAT Services LLC is an official EC-Council Authorized Reseller & Training Partner in Dubai Silicon Oasis, UAE.\n\nWe offer official training & vouchers for **CEH v12, C|CISO, CHFI v11, CND, CPENT**, as well as ISACA (CISA/CISM) and Data Privacy (CIPP/E, CIPM, GDPR).\n\nHow can I help you today? You can also connect directly with our admissions advisor on WhatsApp at **+971 55 184 6786**.";

    if (lower.includes('awake') || lower.includes('active') || lower.includes('hello') || lower.includes('hi')) {
      smartReply = "Yes, I am fully active and online 24/7! I am your CyberGOAT AI Security & Training Assistant. How can I help you with your EC-Council certifications or data privacy training goals today?";
    } else if (lower.includes('pricing') || lower.includes('cost') || lower.includes('fee') || lower.includes('voucher')) {
      smartReply = "Our official EC-Council certification packages (CEH v12, C|CISO, CHFI) include **official EC-Council courseware, 6 months of hands-on iLabs, and the official exam voucher**. Please connect on WhatsApp (+971 55 184 6786) for exact pricing and current promotional offers!";
    }

    return NextResponse.json({ reply: smartReply, source: 'smart-fallback' });
  } catch (error) {
    console.error('API Handler Error:', error);
    return NextResponse.json(
      { reply: 'Thank you for contacting CyberGOAT Services LLC. Please reach out to admin@cybergoat.ae or +971 55 184 6786 on WhatsApp for instant assistance.' },
      { status: 200 }
    );
  }
}
