import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getKnowledgeBase, searchKnowledge } from '@/app/lib/knowledge';

const SYSTEM_INSTRUCTION = `
You are the official CyberGOAT AI Security & Training Assistant for CyberGOAT Services LLC (cybergoat.ae).
CyberGOAT is an official EC-Council Authorized Reseller & Training Partner based in Dubai Silicon Oasis, UAE (Makani A1).

Your job is to assist users with inquiries regarding:
1. EC-Council Certifications: CEH v12, C|CISO, CHFI v11, CND v2, CPENT/LPT, CSA, CTIA, CCSE. Emphasize that CyberGOAT provides official training alongside official EC-Council exam vouchers, official courseware, and hands-on iLabs.
2. ISACA & ISC2 Certifications: CISA, CISM, CRISC, CISSP.
3. Data Privacy & Regulatory Compliance: CIPP/E, CIPM, DPO Training, EU GDPR, UAE PDPL, and DESC ISR Frameworks.
4. Flexible Formats: Online Live Interactive, In-Person Dubai Bootcamps, and Enterprise Corporate Upskilling.

Always prioritize the custom trained Knowledge Base Q&A provided in the prompt context. Be professional, concise, encouraging, and advise users to book a direct consultation or connect via WhatsApp at +971 55 184 6786.
`;

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message parameter is required' }, { status: 400 });
    }

    // 1. Search Custom Knowledge Base for trained Q&A matches
    const customContext = searchKnowledge(message);

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // If direct exact match found in Knowledge Base, return it immediately!
      if (customContext) {
        return NextResponse.json({ reply: customContext, source: 'knowledge-base' });
      }

      // Graceful fallback response when GEMINI_API_KEY is not configured yet
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

    // AbortController timeout (6 seconds max) to guarantee ultra-fast response
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    let response;
    try {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: fullPrompt }],
              },
            ],
          }),
        }
      );
      clearTimeout(timeoutId);
    } catch (fetchErr) {
      clearTimeout(timeoutId);
      console.warn('Gemini API fetch timeout or error, serving intelligent fallback:', fetchErr);
    }

    if (response && response.ok) {
      const data = await response.json();
      const candidateReply = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (candidateReply) {
        return NextResponse.json({ reply: candidateReply, source: 'gemini+kb' });
      }
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
