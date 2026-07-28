import { NextRequest, NextResponse } from 'next/server';
import { getKnowledgeBase, saveKnowledgeBase, QAPair } from '@/app/lib/knowledge';

// GET /api/knowledge: Returns all custom trained Q&A pairs
export async function GET() {
  const kb = getKnowledgeBase();
  return NextResponse.json(kb);
}

// POST /api/knowledge: Adds a new custom Q&A training item
export async function POST(req: NextRequest) {
  try {
    const { question, answer, category } = await req.json();

    if (!question || !answer) {
      return NextResponse.json({ error: 'Question and Answer are required' }, { status: 400 });
    }

    const kb = getKnowledgeBase();

    const newPair: QAPair = {
      id: Date.now().toString(),
      category: category || 'General',
      question: question.trim(),
      answer: answer.trim(),
    };

    kb.qaPairs.push(newPair);
    saveKnowledgeBase(kb);

    return NextResponse.json({ success: true, item: newPair });
  } catch (err) {
    console.error('Error adding knowledge base pair:', err);
    return NextResponse.json({ error: 'Failed to save training item' }, { status: 500 });
  }
}

// DELETE /api/knowledge?id=123: Deletes a trained Q&A pair by ID
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID parameter is required' }, { status: 400 });
    }

    const kb = getKnowledgeBase();
    kb.qaPairs = kb.qaPairs.filter((item) => item.id !== id);
    saveKnowledgeBase(kb);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error deleting training item:', err);
    return NextResponse.json({ error: 'Failed to delete item' }, { status: 500 });
  }
}
