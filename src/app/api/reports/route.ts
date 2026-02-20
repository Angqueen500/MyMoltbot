import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { analyzeImage } from '@/lib/gemini';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(reports);
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const description = formData.get('description') as string;
    const animalType = formData.get('animalType') as string;
    const tags = formData.get('tags') as string;
    const lat = formData.get('lat') as string;
    const lng = formData.get('lng') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `report-${uniqueSuffix}.${extension}`;
    const uploadDir = join(process.cwd(), 'public/uploads');

    // Ensure directory exists
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch {
      // ignore
    }

    const filePath = join(uploadDir, filename);
    await writeFile(filePath, buffer);

    // Analyze with Gemini
    let analysis = { breed: "Unknown", age: "Unknown", type: "unknown" };
    try {
       analysis = await analyzeImage(buffer, file.type || 'image/jpeg');
    } catch (e) {
       console.error("Analysis failed, proceeding with default", e);
    }

    // Save to DB
    const report = await prisma.report.create({
      data: {
        imagePath: `/uploads/${filename}`,
        description: description || `Found a ${animalType || analysis.type} (${analysis.breed})`,
        locationLat: lat ? parseFloat(lat) : null,
        locationLng: lng ? parseFloat(lng) : null,
        breed: analysis.breed,
        age: analysis.age,
        animalType: animalType || analysis.type,
        tags: tags || "[]",
        status: 'open',
      },
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error('Error processing report:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
