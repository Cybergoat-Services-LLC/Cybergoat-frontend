import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'crypto';
import { getKnowledgeBase, saveKnowledgeBase, QAPair } from '@/app/lib/knowledge';
import { isRateLimited, getClientIp } from '@/app/lib/rateLimit';

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

async function isAdminRateLimited(req: NextRequest): Promise<boolean> {
  return isRateLimited('knowledge_admin', getClientIp(req), 20, 60);
}

// GET /api/knowledge: Returns all custom trained Q&A pairs (admin only)
export async function GET(req: NextRequest) {
  if (await isAdminRateLimited(req)) {
    return NextResponse.json({ error: 'Too many requests. Please try again in a minute.' }, { status: 429 });
  }
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const kb = await getKnowledgeBase();
  return NextResponse.json(kb);
}

// POST /api/knowledge: Adds a new custom Q&A training item (admin only)
export async function POST(req: NextRequest) {
  if (await isAdminRateLimited(req)) {
    return NextResponse.json({ error: 'Too many requests. Please try again in a minute.' }, { status: 429 });
  }
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { question, answer, category } = await req.json();

    if (!question || !answer) {
      return NextResponse.json({ error: 'Question and Answer are required' }, { status: 400 });
    }

    const kb = await getKnowledgeBase();

    const newPair: QAPair = {
      id: Date.now().toString(),
      category: category || 'General',
      question: question.trim(),
      answer: answer.trim(),
    };

    kb.qaPairs.push(newPair);
    await saveKnowledgeBase(kb);

    return NextResponse.json({ success: true, item: newPair });
  } catch (err) {
    console.error('Error adding knowledge base pair:', err);
    return NextResponse.json({ error: 'Failed to save training item' }, { status: 500 });
  }
}

// DELETE /api/knowledge?id=123: Deletes a trained Q&A pair by ID (admin only)
export async function DELETE(req: NextRequest) {
  if (await isAdminRateLimited(req)) {
    return NextResponse.json({ error: 'Too many requests. Please try again in a minute.' }, { status: 429 });
  }
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 });
    }

    const kb = await getKnowledgeBase();
    kb.qaPairs = kb.qaPairs.filter((item) => item.id !== id);
    await saveKnowledgeBase(kb);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting training item:', err);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
