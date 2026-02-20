import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { analyzeImage } from '@/lib/gemini';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { rateLimit } from '@/lib/rate-limit';

export async function GET(request: Request) {
  try {
    const reports = await prisma.report.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Handle Privacy: Obfuscate location if privacy is enabled
    // This is a public feed, so we obfuscate for everyone for now.
    // In a real app with auth, we would check if user is admin/owner.
    const safeReports = reports.map(r => {
        if (r.privacy) {
            return {
                ...r,
                // Simple fuzzing: round to 2 decimals (~1.1km precision)
                // or just don't send exact coordinates if you want to rely on the "approx" label
                locationLat: r.locationLat ? Math.round(r.locationLat * 100) / 100 : null,
                locationLng: r.locationLng ? Math.round(r.locationLng * 100) / 100 : null,
            };
        }
        return r;
    });

    return NextResponse.json(safeReports);
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (!rateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests. Please wait.' }, { status: 429 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const description = formData.get('description') as string;
    const animalType = formData.get('animalType') as string;
    const tags = formData.get('tags') as string;
    const lat = formData.get('lat') as string;
    const lng = formData.get('lng') as string;
    const privacy = formData.get('privacy') === 'true';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `report-${uniqueSuffix}.${extension}`;
    const uploadDir = join(process.cwd(), 'public/uploads');

    try {
      await mkdir(uploadDir, { recursive: true });
    } catch {
      // ignore
    }

    const filePath = join(uploadDir, filename);
    await writeFile(filePath, buffer);

    let analysis = { breed: "Unknown", age: "Unknown", type: "unknown" };
    try {
       analysis = await analyzeImage(buffer, file.type || 'image/jpeg');
    } catch (e) {
       console.error("Analysis failed, proceeding with default", e);
    }

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
        status: 'REPORTED',
        privacy: privacy,
      },
    });

    return NextResponse.json(report);
  } catch (error) {
    console.error('Error processing report:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
