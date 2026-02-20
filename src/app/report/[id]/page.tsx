import { prisma } from '@/lib/prisma';
import ReportDetailClient from './ReportDetailClient';

export const revalidate = 0;

export async function generateStaticParams() {
  const reports = await prisma.report.findMany();
  return reports.map((report) => ({ id: report.id.toString() }));
}

export default async function Page({ params }: { params: { id: string } }) {
  const report = await prisma.report.findUnique({
    where: { id: parseInt(params.id) },
    include: { comments: { orderBy: { createdAt: 'desc' } } },
  });

  if (!report) return <div>Report not found</div>;

  return <ReportDetailClient report={report} />;
}
