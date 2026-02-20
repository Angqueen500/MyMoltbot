import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { name, contact, message, type, availability } = await request.json();
    const reportId = parseInt(params.id);

    if (!name || !contact || !reportId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const helpOffer = await prisma.helpOffer.create({
      data: {
        name,
        contact, // Storing combined as schema has 'contact' field
        message,
        helpType: type,
        availability,
        reportId,
      },
    });

    return NextResponse.json(helpOffer);
  } catch (error) {
    console.error("Failed to post help offer:", error);
    return NextResponse.json({ error: 'Failed to post help offer' }, { status: 500 });
  }
}
