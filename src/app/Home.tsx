'use client';
import { useState, useMemo } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, MapPin, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { getDistanceFromLatLonInKm } from '@/lib/distance';
import useGeolocation from '@/hooks/useGeolocation';

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
};

export default function Home({ reports }: { reports: Report[] }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [distanceFilter, setDistanceFilter] = useState<number | null>(null);
  const { location: userLocation } = useGeolocation();

  // Use useMemo for derivation
  const filteredReports = useMemo(() => {
    let result = reports;

    // Type Filter
    if (filter !== 'All') {
      if (filter === 'Dogs') result = result.filter(r => r.breed?.toLowerCase().includes('dog') || r.description?.toLowerCase().includes('dog'));
      else if (filter === 'Cats') result = result.filter(r => r.breed?.toLowerCase().includes('cat') || r.description?.toLowerCase().includes('cat'));
      else if (filter === 'Other') result = result.filter(r => !r.breed?.toLowerCase().includes('dog') && !r.breed?.toLowerCase().includes('cat'));
    }

    // Search Filter
    if (search) {
      result = result.filter(r =>
        r.breed?.toLowerCase().includes(search.toLowerCase()) ||
        (r.description && r.description.toLowerCase().includes(search.toLowerCase()))
      );
    }

    // Distance Filter
    if (distanceFilter && userLocation) {
        result = result.filter(r => {
            if (!r.locationLat || !r.locationLng) return false;
            const d = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, r.locationLat, r.locationLng);
            return d <= distanceFilter;
        });
    }

    // Sort by distance if location available
    if (userLocation) {
        result = [...result].sort((a, b) => {
            const distA = (a.locationLat && a.locationLng) ? getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, a.locationLat, a.locationLng) : Infinity;
            const distB = (b.locationLat && b.locationLng) ? getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, b.locationLat, b.locationLng) : Infinity;
            return distA - distB;
        });
    }

    return result;
  }, [filter, search, distanceFilter, userLocation, reports]);

  return (
    <>
      <div className="sticky top-14 z-40 bg-background/95 backdrop-blur py-2 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search breed, description..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Type Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {['All', 'Dogs', 'Cats', 'Other'].map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
              className="rounded-full whitespace-nowrap"
            >
              {f}
            </Button>
          ))}
        </div>

        {/* Distance Filters */}
        {userLocation && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide items-center">
             <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">Within:</span>
             {[2, 5, 10, 50].map((km) => (
                <Button
                  key={km}
                  variant={distanceFilter === km ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setDistanceFilter(distanceFilter === km ? null : km)}
                  className="rounded-full h-7 px-3 text-xs"
                >
                  {km}km
                </Button>
             ))}
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filteredReports.length === 0 ? (
           <div className="col-span-full text-center py-20 flex flex-col items-center">
             <div className="h-24 w-24 bg-muted rounded-full flex items-center justify-center mb-4">
               <Search className="h-10 w-10 text-muted-foreground" />
             </div>
             <h3 className="text-lg font-semibold">No reports found</h3>
             <p className="text-muted-foreground">Try adjusting your filters.</p>
           </div>
        ) : (
          filteredReports.map((report) => (
            <Link href={`/report/${report.id}`} key={report.id} className="block group h-full">
              <Card className="overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col border-border/50">
                <div className="relative h-48 w-full bg-muted">
                  <Image
                    src={report.imagePath}
                    alt={report.breed || 'Stray'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                  <div className="absolute top-2 right-2">
                    <Badge
                      variant="secondary"
                      className={
                        report.status === 'RESCUED' ? 'bg-green-500 text-white' :
                        report.status === 'IN_REVIEW' ? 'bg-amber-500 text-white' : ''
                      }
                    >
                      {report.status}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-4 flex-1">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-lg leading-tight">
                      {report.breed || "Unknown Breed"}
                    </h3>
                    {report.age && <Badge variant="outline" className="shrink-0">{report.age}</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {report.description}
                  </p>
                </CardContent>
                <CardFooter className="p-4 pt-0 text-xs text-muted-foreground flex justify-between items-center border-t border-border/50 mt-auto pt-3">
                   <div className="flex items-center gap-1">
                     <MapPin className="h-3 w-3" />
                     <span>
                       {userLocation && report.locationLat && report.locationLng
                         ? `${getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, report.locationLat, report.locationLng).toFixed(1)}km away`
                         : (report.locationLat ? 'Location pinned' : 'No location')}
                     </span>
                   </div>
                   <span>{formatDistanceToNow(new Date(report.createdAt))} ago</span>
                </CardFooter>
              </Card>
            </Link>
          ))
        )}
      </div>

      {/* Mobile FAB */}
      <Link href="/report" className="fixed bottom-20 right-4 md:hidden z-50">
        <Button size="icon" className="h-14 w-14 rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-6 w-6" />
        </Button>
      </Link>
    </>
  );
}
