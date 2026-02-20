'use client';
import { Button } from '@/components/ui/button';
import { Camera, Search, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HeroSection({ onSearchClick }: { onSearchClick: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-blue-700 text-primary-foreground p-8 md:p-12 mb-8 shadow-xl">
      <div className="relative z-10 space-y-6 max-w-lg">
        <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
            Every Stray Deserves <br/> a Way Home.
            </h1>
            <p className="text-blue-100/90 text-sm md:text-base leading-relaxed">
            Join the community network helping to report, rescue, and reunite stray animals in your area.
            </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Button asChild variant="secondary" size="lg" className="shadow-sm font-semibold rounded-full h-12 px-6">
            <Link href="/report">
              <Camera className="mr-2 h-5 w-5" />
              Report a Stray
            </Link>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-md rounded-full h-12 px-6"
            onClick={onSearchClick}
          >
            <Search className="mr-2 h-5 w-5" />
            Find Lost Pet
          </Button>
        </div>
      </div>

      {/* Abstract Shapes */}
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/10 blur-[60px]" />
      <div className="absolute top-1/2 -right-12 h-48 w-48 rounded-full bg-indigo-500/30 blur-[50px]" />
      <div className="absolute -bottom-32 left-12 h-64 w-64 rounded-full bg-blue-400/20 blur-[60px]" />
    </div>
  );
}
