import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json();
    const reportId = parseInt(params.id);

    if (!status || !reportId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const report = await prisma.report.update({
      where: { id: reportId },
      data: { status },
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error("Failed to update report status:", error);
    return NextResponse.json({ error: 'Failed to update report status' }, { status: 500 });
  }
}
