'use client';
import { Card, CardContent } from '@/components/ui/card';
import StatusPill from '@/components/ui/status-pill';
import { MapPin, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import useGeolocation from '@/hooks/useGeolocation';
import useBookmarks from '@/hooks/useBookmarks';
import { getDistanceFromLatLonInKm } from '@/lib/distance';

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

export default function ReportCard({ report }: { report: Report }) {
  const { location: userLocation } = useGeolocation();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const distance = userLocation && report.locationLat && report.locationLng
    ? getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, report.locationLat, report.locationLng).toFixed(1)
    : null;

  const bookmarked = isBookmarked(report.id);

  return (
    <div className="relative group h-full">
        <Link href={`/report/${report.id}`} className="block h-full focus:outline-none focus:ring-2 focus:ring-primary rounded-xl">
        <Card className="overflow-hidden h-full flex flex-col border border-border bg-card shadow-sm hover:shadow-md transition-all duration-300">
            <div className="relative h-48 w-full bg-muted">
            <Image
                src={report.imagePath}
                alt={report.breed || 'Stray animal'}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                unoptimized
            />
            <div className="absolute top-2 right-2">
                <StatusPill status={report.status} />
            </div>
            {distance && (
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2 py-0.5 rounded-full text-[10px] font-medium flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {distance}km away
                </div>
            )}
            </div>
            <CardContent className="p-4 flex-1 space-y-2">
            <div className="flex items-start justify-between gap-2">
                <div>
                <h3 className="font-semibold text-lg leading-tight text-foreground group-hover:text-primary transition-colors">
                    {report.breed || "Unknown Breed"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">{formatDistanceToNow(new Date(report.createdAt))} ago</p>
                </div>
                {report.age && <Badge variant="outline" className="shrink-0 text-[10px] font-normal">{report.age}</Badge>}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                {report.description}
            </p>
            </CardContent>
        </Card>
        </Link>
        <Button
            size="icon"
            variant="ghost"
            className={cn("absolute top-2 left-2 z-10 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-muted-foreground", bookmarked && "text-red-500 hover:text-red-600")}
            onClick={(e) => {
                e.preventDefault();
                toggleBookmark(report.id);
            }}
        >
            <Heart className={cn("h-4 w-4", bookmarked && "fill-current")} />
        </Button>
    </div>
  );
}
