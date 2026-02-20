'use client';
import { Button } from '@/components/ui/button';
import { Camera, Search } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection({ onSearchClick }: { onSearchClick: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 md:p-10 mb-6 shadow-md">
      <div className="relative z-10 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Help Strays Find a Home</h1>
        <p className="text-blue-100 max-w-sm text-sm md:text-base">
          Connect with your community to report, rescue, and adopt stray animals nearby.
        </p>
        <div className="flex gap-3 pt-2">
          <Button asChild variant="secondary" className="shadow-sm font-medium">
            <Link href="/report">
              <Camera className="mr-2 h-4 w-4" />
              Report Stray
            </Link>
          </Button>
          <Button
            variant="outline"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm"
            onClick={onSearchClick}
          >
            <Search className="mr-2 h-4 w-4" />
            Find Pet
          </Button>
        </div>
      </div>
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute bottom-0 right-20 h-32 w-32 rounded-full bg-indigo-500/30 blur-2xl" />
    </div>
  );
}
