import { prisma } from '@/lib/prisma';
import Card from '@/components/Card';
import Link from 'next/link';

export const revalidate = 0;

export default async function Home() {
  const reports = await prisma.report.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6 pb-20">
      <header className="flex justify-between items-center mb-4 sticky top-0 bg-gray-50/90 backdrop-blur-sm z-10 py-2">
        <h1 className="text-2xl font-bold text-gray-900">Recent Reports</h1>
        <Link href="/report" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm">
          + Report
        </Link>
      </header>

      {reports.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-lg mb-2">No stray animals reported yet.</p>
          <p className="text-sm">Help the community by reporting sightings!</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {reports.map((report) => (
            <Card
              key={report.id}
              title={`${report.breed || "Unknown"} ${report.age ? `(${report.age})` : ''}`}
              description={report.description || undefined}
              image={report.imagePath}
              footer={
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${report.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {report.status.toUpperCase()}
                  </span>
                </div>
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
