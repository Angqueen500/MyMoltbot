import { prisma } from '@/lib/prisma';
import Home from './Home';

// Use 'force-dynamic' to ensure the page is always fresh,
// or stick to revalidate = 0 if ISR is preferred.
export const dynamic = 'force-dynamic';

export default async function Page() {
  const reports = await prisma.report.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <Home reports={reports} />
    </div>
  );
}
