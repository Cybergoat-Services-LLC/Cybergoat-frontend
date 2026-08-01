import { Redis } from '@upstash/redis';

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

const KB_KEY = 'cybergoat:knowledge_base';

const DEFAULT_KB: KnowledgeBase = {
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

const redis = Redis.fromEnv();

export async function getKnowledgeBase(): Promise<KnowledgeBase> {
  try {
    const kb = await redis.get<KnowledgeBase>(KB_KEY);
    return kb ?? DEFAULT_KB;
  } catch (err) {
    console.error('Error reading knowledge base from Redis, serving default:', err);
    return DEFAULT_KB;
  }
}

export async function saveKnowledgeBase(kb: KnowledgeBase): Promise<void> {
  await redis.set(KB_KEY, kb);
}

export async function searchKnowledge(userQuery: string): Promise<string> {
  const kb = await getKnowledgeBase();
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
