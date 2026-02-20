import { prisma } from '@/lib/prisma';
import VetsClient from './VetsClient';

export const revalidate = 3600;

export default async function VetsPage() {
  const vets = await prisma.vet.findMany();

  return (
    <div className="space-y-6">
      <VetsClient vets={vets} />
    </div>
  );
}
