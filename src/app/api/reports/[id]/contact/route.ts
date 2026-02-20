import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const { name, contact, message } = await request.json();
    const reportId = parseInt(params.id);

    if (!name || !contact || !reportId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const contactRequest = await prisma.contactRequest.create({
      data: {
        name,
        email: contact.includes('@') ? contact : undefined,
        phone: !contact.includes('@') ? contact : undefined,
        message,
        reportId,
      },
    });

    return NextResponse.json(contactRequest);
  } catch (error) {
    console.error("Failed to post contact request:", error);
    return NextResponse.json({ error: 'Failed to post contact request' }, { status: 500 });
  }
}
