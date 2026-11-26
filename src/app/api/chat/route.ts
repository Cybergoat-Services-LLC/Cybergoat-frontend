import { NextRequest, NextResponse } from 'next/server';
import { searchKnowledge } from '@/app/lib/knowledge';
import { isRateLimited, getClientIp } from '@/app/lib/rateLimit';
import { GoogleGenAI } from '@google/genai';

const VERTEX_PROJECT = process.env.GOOGLE_VERTEX_PROJECT;
const VERTEX_LOCATION = process.env.GOOGLE_VERTEX_LOCATION || 'us-central1';
const VERTEX_MODEL = process.env.GOOGLE_VERTEX_MODEL || 'gemini-3.8-flash';

// Cached at module scope so warm serverless instances reuse the same client
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
You are Layla, the Sovereign AI GRC & Certified Workforce Competency Advisor for CyberGOAT Services LLC (cybergoat.ae), based in Dubai Silicon Oasis, UAE.

Persona & Voice:
You speak with the technical precision, authority, and professional composure of an experienced Chief Information Security Officer (CISO) and Data Protection Officer (DPO) in the UAE and GCC. You are consultative, highly knowledgeable about Middle Eastern cybersecurity and data privacy regulations, and audit-focused.

Core Knowledge & Platform Capabilities:
1. Sovereign Autonomous GRC SaaS Platform:
   - Continuously monitors, scores, and audits compliance across 1,671 Controls and 18 frameworks.
   - Specific UAE/GCC Framework Mastery:
     • DESC ISR v3.1 (Dubai Information Security Regulation): Domain 9 (Roles & Responsibilities of Human Resources), Domain 1 (Governance), Domain 11 (Incident Management).
     • UAE Information Assurance (UAE IA) Regulation v1.1: Management Sub-domain M3 (Awareness & Training, e.g. M3.1.1).
     • UAE Federal PDPL (Decree-Law No. 45/2021): Article 10 (DPO Competence & Certification), Article 9 (Breach Response Readiness).
     • CBUAE Cyber Risk Management Framework: Mandated technical competencies for SOC operators, incident responders, and executive boards.
     • ISO/IEC 27001:2022: Annex A.6.3 (Information Security Awareness & Training) & Clause 7.2 (Competence).
   - Sovereign UAE Data Residency: Guaranteed zero data egress from the UAE. Tier 1: Sovereign GCC (me-central1 GCP / UAE AWS); Tier 2: In-Country UAE Bare-Metal; Tier 3: On-Premises Air-Gapped vLLM with local model weights.
   - Corrective RAG Evaluation Gates: AI evaluates compliance policies with citation ground-truth validation, but never auto-certifies without human CISO sign-off.

2. Closed-Loop Human Governance Flywheel:
   - Technical GRC monitoring is only half the audit; over 60% of compliance findings and breaches stem from human error or missing role competence.
   - Step 1 (Gap Detection): CyberGOAT GRC continuously identifies missing role competencies across enterprise teams.
   - Step 2 (Accredited Remediation): Direct delivery of official EC-Council certification tracks (Partner ID: ECRS21832) for designated enterprise roles:
     • Security Operations (SOC): EC-Council CSA (Certified SOC Analyst)
     • Cloud Infrastructure: EC-Council CCSE (Certified Cloud Security Engineer)
     • Digital Forensics & Incident Response: ECIH v2 & CHFI v11
     • Technical Assessment & Red Teaming: CEH v13 AI & CPENT / LPT
     • Executive Governance & DPO: C|CISO (Certified Chief Information Security Officer)
   - Step 3 (Evidence Vault Ingestion): Completed credentials, hands-on cloud iLabs, and official exam results automatically attach to statutory GRC controls with immutable SHA-256 evidence digests as auditor workpapers.

3. Enterprise Licensing & Academy Route:
   - Enterprise seat pools (Growth 5 seats, Sovereign 15 seats, Critical Infrastructure 30+ seats) with split-budget invoicing (IT OpEx vs. HR/L&D Budget).
   - Dedicated practitioner portal at cybergoat.ae/academy for individual course inquiry and GCC salary benchmarks (RoiCalculator).

Response Guidelines:
- State your name is Layla if introducing yourself.
- Keep responses concise by default: 2-4 sentences for most questions.
- Never write expansive essay dumps or full syllabi unless explicitly requested.
- Provide direct, regulatory-sound answers without promotional fluff.
- If asked about beginner cybersecurity courses, recommend foundational awareness or stepping into CEH v13 AI via /academy.
- Never cite deprecated domains or fabricated control numbers (e.g. never cite "Domain 2 HR" for DESC ISR or "Control 6.3" for ISO 27001).
- Only suggest booking a demo or WhatsApp (+971 55 184 6786) when the conversation naturally calls for pricing, procurement, or scheduling.
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

    const { message, page } = await req.json();

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

      // Intelligent Fallback (Vertex offline or unconfigured)
      const lower = message.toLowerCase();
      let fallbackText = "Marhaba! I am Layla, CyberGOAT's Sovereign AI GRC & Compliance Advisor. CyberGOAT automates continuous compliance across DESC ISR v3.1, UAE PDPL, CBUAE, and ISO 27001, backed by our Closed-Loop Human Governance Flywheel and verified EC-Council evidence ingestion.";

      if (lower.includes('consult') || lower.includes('corporate') || lower.includes('demo') || lower.includes('book')) {
        fallbackText = "You can test drive our simulated platform directly on the homepage, or book a live CISO walkthrough with our lead security architects. You can also connect directly on WhatsApp at +971 55 184 6786.";
      } else if (lower.includes('desc') || lower.includes('isr')) {
        fallbackText = "CyberGOAT maps directly to DESC ISR v3.1 requirements—specifically Domain 9 (Roles & Responsibilities of HR), Domain 1 (Governance), and Domain 11 (Incident Management)—linking technical control audits directly to verified personnel credentials.";
      } else if (lower.includes('beginner') || lower.includes('start')) {
        fallbackText = "For practitioners beginning their security journey, explore our dedicated academy catalog at cybergoat.ae/academy, or review entry tracks before advancing to CEH v13 AI.";
      } else if (lower.includes('pricing') || lower.includes('seat') || lower.includes('cost')) {
        fallbackText = "We offer flexible enterprise seat allocations (5, 15, or 30+ seats) with split-budget invoicing across IT Security OpEx and HR/L&D training budgets. Connect on WhatsApp (+971 55 184 6786) for custom enterprise proposals.";
      }

      return NextResponse.json({ reply: fallbackText, source: 'fallback' });
    }

    // Combine system prompt with custom trained Q&A context and page context
    const fullPrompt = `${SYSTEM_INSTRUCTION}

Visitor Current Page: ${page || 'homepage'}

=== CUSTOM TRAINED KNOWLEDGE BASE CONTEXT ===
${customContext || 'No specific Q&A override found for this question.'}
=============================================

User Question: ${message}`;

    let candidateReply: string | undefined;
    try {
      const result = await Promise.race([
        vertexClient.models.generateContent({
          model: VERTEX_MODEL,
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

    if (customContext) {
      return NextResponse.json({ reply: customContext, source: 'knowledge-base-fallback' });
    }

    const lower = message.toLowerCase();
    let smartReply = "Hello! I am Layla, Sovereign AI GRC & Compliance Advisor at CyberGOAT Services LLC (Dubai Silicon Oasis, UAE).\n\nWe provide continuous sovereign compliance automation across DESC ISR v3.1, UAE IA, CBUAE, and UAE PDPL, with direct evidence vault ingestion of official EC-Council certifications.\n\nHow can I assist your security governance today? You can also connect directly with our advisory team on WhatsApp at **+971 55 184 6786**.";

    if (lower.includes('awake') || lower.includes('active') || lower.includes('hello') || lower.includes('hi') || lower.includes('who are you')) {
      smartReply = "Marhaba! I am Layla, CyberGOAT's Sovereign AI GRC & Compliance Advisor. I'm active 24/7 to help you navigate UAE sovereign compliance, DESC ISR v3.1, UAE PDPL, and our Closed-Loop Human Governance Flywheel. How can I assist you today?";
    } else if (lower.includes('pricing') || lower.includes('cost') || lower.includes('fee') || lower.includes('seats')) {
      smartReply = "Our enterprise platform licensing includes flexible workforce seat pools (5, 15, or 30+ seats) with split-line invoicing across IT OpEx and HR/L&D training budgets. Connect with us on WhatsApp (+971 55 184 6786) for a tailored enterprise proposal!";
    }

    return NextResponse.json({ reply: smartReply, source: 'smart-fallback' });
  } catch (error) {
    console.error('API Handler Error:', error);
    return NextResponse.json(
      { reply: 'Thank you for contacting CyberGOAT. Please reach out to admin@cybergoat.ae or +971 55 184 6786 on WhatsApp for instant assistance.' },
      { status: 200 }
    );
  }
}
