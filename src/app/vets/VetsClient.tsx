'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Clock, MapPin, Navigation, Search, List, Map as MapIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

type Vet = {
  id: number;
  name: string;
  address: string;
  phone: string;
  hours: string | null;
  locationLat: number | null;
  locationLng: number | null;
};

export default function VetsClient({ vets }: { vets: Vet[] }) {
  const [search, setSearch] = useState('');
  const [showMap, setShowMap] = useState(true);

  const filteredVets = vets.filter(vet =>
    vet.name.toLowerCase().includes(search.toLowerCase()) ||
    vet.address.toLowerCase().includes(search.toLowerCase())
  );

  const markers = filteredVets
    .filter(v => v.locationLat != null && v.locationLng != null)
    .map(v => ({
      lat: v.locationLat!,
      lng: v.locationLng!,
      title: v.name,
      description: v.address
    }));

  const initialCenter = markers.length > 0 ? [markers[0].lat, markers[0].lng] : undefined;

  return (
    <div className="space-y-4 pb-32 h-[calc(100vh-8rem)] flex flex-col">
      {/* Search & Toggle */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clinics..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowMap(!showMap)}
          className="shrink-0 md:hidden"
        >
          {showMap ? <List className="h-4 w-4" /> : <MapIcon className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 h-full overflow-hidden">
        {/* Map View - Collapsible on Mobile */}
        <div className={cn(
          "h-64 md:h-full md:flex-1 rounded-xl overflow-hidden border border-border relative z-0 shadow-sm transition-all duration-300",
          showMap ? "block" : "hidden md:block"
        )}>
          {markers.length > 0 ? (
            <Map markers={markers} zoom={13} center={initialCenter} />
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground">
              No locations found
            </div>
          )}
        </div>

        {/* List View */}
        <div className={cn(
          "flex-1 overflow-y-auto pr-1 space-y-3 scrollbar-hide",
          !showMap ? "block" : "hidden md:block"
        )}>
          {filteredVets.length === 0 ? (
             <div className="text-center py-10 text-muted-foreground">
               No veterinarians found.
             </div>
          ) : (
            filteredVets.map((vet) => (
              <Card key={vet.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg leading-tight">{vet.name}</h3>
                      <div className="flex items-start gap-2 text-sm text-muted-foreground mt-1">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                        <span>{vet.address}</span>
                      </div>
                    </div>
                    {vet.hours?.includes('24/7') && (
                      <Badge variant="destructive" className="shrink-0 text-[10px]">Emergency</Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>{vet.hours || 'Call for hours'}</span>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button asChild variant="default" size="sm" className="flex-1">
                      <a href={`tel:${vet.phone}`}>
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(vet.name + ' ' + vet.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Directions
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
