import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const vets = await prisma.vet.findMany();
    return NextResponse.json(vets);
  } catch (error) {
    console.error("Failed to fetch vets:", error);
    return NextResponse.json({ error: 'Failed to fetch vets' }, { status: 500 });
  }
}
