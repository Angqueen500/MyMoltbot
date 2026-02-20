import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { text } = await request.json();
    const reportId = parseInt(params.id);

    if (!text || !reportId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        reportId,
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error("Failed to post comment:", error);
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
  }
}
