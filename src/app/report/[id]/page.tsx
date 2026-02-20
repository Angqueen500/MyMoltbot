import { prisma } from '@/lib/prisma';
import ReportDetailClient from './ReportDetailClient';

export const revalidate = 0;

export default async function Page({ params }: { params: { id: string } }) {
  const report = await prisma.report.findUnique({
    where: { id: parseInt(params.id) },
    include: { updates: { orderBy: { createdAt: 'desc' } } },
  });

  if (!report) return <div>Report not found</div>;

  return <ReportDetailClient report={report} />;
}
