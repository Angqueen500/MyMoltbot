'use client';
import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, MapPin, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

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
  const [filteredReports, setFilteredReports] = useState<Report[]>(reports);

  const handleFilter = (f: string) => {
    setFilter(f);
    applyFilters(f, search);
  };

  const handleSearch = (s: string) => {
    setSearch(s);
    applyFilters(filter, s);
  };

  const applyFilters = (f: string, s: string) => {
    let result = reports;

    if (f !== 'All') {
      if (f === 'Dogs') result = result.filter(r => r.breed?.toLowerCase().includes('dog') || r.description?.toLowerCase().includes('dog'));
      if (f === 'Cats') result = result.filter(r => r.breed?.toLowerCase().includes('cat') || r.description?.toLowerCase().includes('cat'));
      if (f === 'Other') result = result.filter(r => !r.breed?.toLowerCase().includes('dog') && !r.breed?.toLowerCase().includes('cat'));
    }

    if (s) {
      result = result.filter(r =>
        r.breed?.toLowerCase().includes(s.toLowerCase()) ||
        (r.description && r.description.toLowerCase().includes(s.toLowerCase()))
      );
    }

    setFilteredReports(result);
  };

  return (
    <>
      <div className="sticky top-14 z-40 bg-background/95 backdrop-blur py-2 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search breed, description..."
            className="pl-9"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {['All', 'Dogs', 'Cats', 'Other'].map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFilter(f)}
              className="rounded-full"
            >
              {f}
            </Button>
          ))}
        </div>
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
                    <Badge variant={report.status === 'open' ? 'default' : 'secondary'} className="shadow-sm">
                      {report.status.toUpperCase()}
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
                       {report.locationLat ? 'Location pinned' : 'No location'}
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
