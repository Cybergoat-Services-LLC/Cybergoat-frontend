import fs from 'fs';
import path from 'path';

export type QAPair = {
  id: string;
  category: string;
  question: string;
  answer: string;
};

export type KnowledgeBase = {
  companyInfo: {
    name: string;
    accreditation: string;
    address: string;
    phone: string;
    email: string;
    website: string;
  };
  qaPairs: QAPair[];
};

const KNOWLEDGE_FILE = path.join(process.cwd(), 'src', 'app', 'data', 'knowledge-base.json');

let memoryKBCache: KnowledgeBase | null = null;

export function getKnowledgeBase(): KnowledgeBase {
  if (memoryKBCache) {
    return memoryKBCache;
  }

  try {
    if (!fs.existsSync(KNOWLEDGE_FILE)) {
      memoryKBCache = {
        companyInfo: {
          name: "CyberGOAT Services LLC",
          accreditation: "Official EC-Council Authorized Reseller & Training Partner",
          address: "Dubai Silicon Oasis, DSO-IFZA, Building A1, Dubai, UAE",
          phone: "+971 55 184 6786",
          email: "admin@cybergoat.ae",
          website: "https://www.cybergoat.ae"
        },
        qaPairs: []
      };
      return memoryKBCache;
    }
    const data = fs.readFileSync(KNOWLEDGE_FILE, 'utf-8');
    memoryKBCache = JSON.parse(data);
    return memoryKBCache!;
  } catch (err) {
    console.error('Error reading knowledge base file, serving memory default:', err);
    return {
      companyInfo: {
        name: "CyberGOAT Services LLC",
        accreditation: "Official EC-Council Authorized Reseller & Training Partner",
        address: "Dubai Silicon Oasis, DSO-IFZA, Building A1, Dubai, UAE",
        phone: "+971 55 184 6786",
        email: "admin@cybergoat.ae",
        website: "https://www.cybergoat.ae"
      },
      qaPairs: []
    };
  }
}

export function saveKnowledgeBase(kb: KnowledgeBase) {
  memoryKBCache = kb; // Update in-memory state immediately for instant serverless availability
  try {
    const dir = path.dirname(KNOWLEDGE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(KNOWLEDGE_FILE, JSON.stringify(kb, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Notice: Serverless read-only filesystem detected (Vercel Production). Knowledge updated in-memory for session.', err);
  }
}

export function searchKnowledge(userQuery: string): string {
  const kb = getKnowledgeBase();
  const lower = userQuery.toLowerCase().trim();

  // 1. Direct Q&A Match
  const exact = kb.qaPairs.find((pair) => {
    const qLower = pair.question.toLowerCase();
    return lower.includes(qLower) || qLower.includes(lower);
  });

  if (exact) {
    return exact.answer;
  }

  // 2. Keyword Context Aggregation
  const relevantPairs = kb.qaPairs.filter((pair) => {
    const keywords = pair.question.toLowerCase().split(/\s+/).filter((w) => w.length > 3);
    return keywords.some((kw) => lower.includes(kw));
  });

  if (relevantPairs.length > 0) {
    return relevantPairs
      .map((p) => `Q: ${p.question}\nA: ${p.answer}`)
      .join('\n\n');
  }

  return '';
}
