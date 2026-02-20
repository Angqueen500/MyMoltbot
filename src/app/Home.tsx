'use client';
import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getDistanceFromLatLonInKm } from '@/lib/distance';
import useGeolocation from '@/hooks/useGeolocation';
import useBookmarks from '@/hooks/useBookmarks';
import HeroSection from '@/components/features/feed/HeroSection';
import FilterDrawer from '@/components/features/feed/FilterDrawer';
import ReportCard from '@/components/features/feed/ReportCard';

type Report = {
  id: number;
  imagePath: string;
  description: string;
  breed: string;
  age: string;
  status: string;
  createdAt: Date;
  locationLat: number | null;
  locationLng: number | null;
  animalType?: string;
};

export default function Home({ reports }: { reports: Report[] }) {
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'all' | 'saved'>('all');
  const [filters, setFilters] = useState<{
    species: string | null;
    status: string | null;
    distance: number | null;
  }>({ species: null, status: null, distance: null });

  const { location: userLocation } = useGeolocation();
  const { bookmarks } = useBookmarks();

  // Optimized filtering
  const filteredReports = useMemo(() => {
    let result = reports;

    // View Filter (Saved)
    if (view === 'saved') {
      result = result.filter(r => bookmarks.includes(r.id));
    }

    // Search
    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(r =>
        r.breed?.toLowerCase().includes(lowerSearch) ||
        r.description?.toLowerCase().includes(lowerSearch)
      );
    }

    // Filters
    if (filters.species) {
      if (filters.species === 'Other') {
        result = result.filter(r =>
          !r.breed?.toLowerCase().includes('dog') &&
          !r.description?.toLowerCase().includes('dog') &&
          !r.breed?.toLowerCase().includes('cat') &&
          !r.description?.toLowerCase().includes('cat')
        );
      } else {
        const type = filters.species.toLowerCase();
        result = result.filter(r =>
          r.animalType?.toLowerCase() === type ||
          r.breed?.toLowerCase().includes(type) ||
          r.description?.toLowerCase().includes(type)
        );
      }
    }

    if (filters.status) {
      result = result.filter(r => r.status === filters.status);
    }

    if (filters.distance && userLocation) {
      result = result.filter(r => {
        if (!r.locationLat || !r.locationLng) return false;
        const d = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, r.locationLat, r.locationLng);
        return d <= filters.distance!;
      });
    }

    // Sort by distance if available
    if (userLocation) {
        result = [...result].sort((a, b) => {
            const distA = (a.locationLat && a.locationLng) ? getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, a.locationLat, a.locationLng) : Infinity;
            const distB = (b.locationLat && b.locationLng) ? getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, b.locationLat, b.locationLng) : Infinity;
            return distA - distB;
        });
    }

    return result;
  }, [search, filters, userLocation, reports, view, bookmarks]);

  return (
    <div className="pb-8">
      {view === 'all' && <HeroSection onSearchClick={() => document.getElementById('search-input')?.focus()} />}

      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur py-3 mb-6 border-b border-border/50 -mx-4 px-4 md:mx-0 md:px-0 space-y-3">
        {/* View Tabs */}
        <div className="flex gap-4 border-b border-border/50 pb-0">
            <button
                onClick={() => setView('all')}
                className={`pb-2 text-sm font-medium transition-colors ${view === 'all' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
            >
                All Reports
            </button>
            <button
                onClick={() => setView('saved')}
                className={`pb-2 text-sm font-medium transition-colors ${view === 'saved' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground'}`}
            >
                Saved ({bookmarks.length})
            </button>
        </div>

        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search-input"
              placeholder="Search by breed, color..."
              className="pl-9 h-10 bg-secondary/50 border-transparent focus:bg-background transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <FilterDrawer
            filters={filters}
            onApply={setFilters}
            onClear={() => setFilters({ species: null, status: null, distance: null })}
          />
        </div>
      </div>

      <div className="space-y-6">
        {filteredReports.length === 0 ? (
           <div className="text-center py-20 flex flex-col items-center">
             <div className="h-24 w-24 bg-muted rounded-full flex items-center justify-center mb-4">
               <Search className="h-10 w-10 text-muted-foreground/50" />
             </div>
             <h3 className="text-lg font-semibold">No reports found</h3>
             <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
           </div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredReports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
