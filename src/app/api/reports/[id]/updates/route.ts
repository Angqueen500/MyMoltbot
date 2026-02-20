import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { text, type } = await request.json();
    const reportId = parseInt(params.id);

    if (!text || !reportId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const update = await prisma.reportUpdate.create({
      data: {
        text,
        type: type || 'COMMENT',
        reportId,
      },
    });

    return NextResponse.json(update);
  } catch (error) {
    console.error("Failed to post update:", error);
    return NextResponse.json({ error: 'Failed to post update' }, { status: 500 });
  }
}
