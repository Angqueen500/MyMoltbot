'use client';
import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Phone, Clock, MapPin, Navigation, Search, List, Map as MapIcon, Copy, ShieldCheck, AlertTriangle, Stethoscope, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/components/ui/toast';
import useGeolocation from '@/hooks/useGeolocation';
import { getDistanceFromLatLonInKm } from '@/lib/distance';
import InjuredGuideModal from '@/components/features/vets/InjuredGuideModal';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

type Vet = {
  id: number;
  name: string;
  address: string;
  phone: string;
  hours: string | null;
  locationLat: number | null;
  locationLng: number | null;
  specialties: string | null;
  emergency: boolean;
  verified: boolean;
};

export default function VetsClient({ vets }: { vets: Vet[] }) {
  const [search, setSearch] = useState('');
  const [showMap, setShowMap] = useState(false);
  const [filterEmergency, setFilterEmergency] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const { addToast } = useToast();
  const { location: userLocation } = useGeolocation();

  const sortedVets = useMemo(() => {
    let result = vets.filter(vet =>
      vet.name.toLowerCase().includes(search.toLowerCase()) ||
      vet.address.toLowerCase().includes(search.toLowerCase())
    );

    if (filterEmergency) {
        result = result.filter(vet => vet.emergency);
    }

    if (userLocation) {
      result = [...result].sort((a, b) => {
        const distA = (a.locationLat && a.locationLng) ? getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, a.locationLat, a.locationLng) : Infinity;
        const distB = (b.locationLat && b.locationLng) ? getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, b.locationLat, b.locationLng) : Infinity;
        return distA - distB;
      });
    }
    return result;
  }, [search, userLocation, vets, filterEmergency]);

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    addToast({ type: 'success', title: 'Address Copied' });
  };

  const markers = sortedVets
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
      {/* Header Actions */}
      <div className="flex justify-between items-center px-1">
         <h1 className="text-2xl font-bold tracking-tight">Nearby Vets</h1>
         <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => setShowGuide(true)}>
            <AlertTriangle className="mr-1 h-4 w-4" />
            Injured Animal?
         </Button>
      </div>

      {/* Search & Controls */}
      <div className="flex gap-2 sticky top-0 bg-background z-10 py-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clinics..."
            className="pl-9 h-10 bg-secondary/50 border-transparent focus:bg-background transition-colors"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button
            variant={filterEmergency ? "destructive" : "outline"}
            size="icon"
            onClick={() => setFilterEmergency(!filterEmergency)}
            className="shrink-0"
            aria-label="Filter Emergency"
        >
            <Stethoscope className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setShowMap(!showMap)}
          className="shrink-0 md:hidden"
        >
          {showMap ? <List className="h-4 w-4" /> : <MapIcon className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 h-full overflow-hidden relative">
        {/* Map View - Collapsible on Mobile */}
        <div className={cn(
          "h-full w-full absolute inset-0 md:relative md:flex-1 rounded-xl overflow-hidden border border-border z-0 shadow-sm transition-all duration-300 bg-background",
          showMap ? "z-20 block" : "hidden md:block"
        )}>
          {markers.length > 0 ? (
            <Map markers={markers} zoom={13} center={initialCenter} />
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground">
              No locations found
            </div>
          )}
          {/* Map Close Button (Mobile Only) */}
          <Button
            className="absolute top-4 right-4 md:hidden shadow-lg z-[400]"
            size="sm"
            onClick={() => setShowMap(false)}
          >
            Show List
          </Button>
        </div>

        {/* List View */}
        <div className={cn(
          "flex-1 overflow-y-auto pr-1 space-y-3 scrollbar-hide pb-20",
          showMap ? "hidden md:block" : "block"
        )}>
          {sortedVets.length === 0 ? (
             <div className="text-center py-10 text-muted-foreground flex flex-col items-center">
               <Stethoscope className="h-10 w-10 mb-2 opacity-20" />
               <p>No veterinarians found.</p>
             </div>
          ) : (
            sortedVets.map((vet) => (
              <Card key={vet.id} className="hover:shadow-md transition-all border-border/50">
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-bold text-lg leading-tight">{vet.name}</h3>
                        {vet.verified && <ShieldCheck className="w-4 h-4 text-blue-500 shrink-0" aria-label="Verified" />}
                        {vet.emergency && (
                            <Badge variant="destructive" className="text-[10px] h-5 px-1.5 flex items-center gap-1">
                                24/7
                            </Badge>
                        )}
                      </div>
                      <div className="flex items-start gap-2 text-sm text-muted-foreground mt-1.5 group cursor-pointer" onClick={() => copyAddress(vet.address)}>
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0 group-hover:text-primary transition-colors" />
                        <span className="group-hover:text-foreground transition-colors">{vet.address}</span>
                      </div>
                      {userLocation && vet.locationLat && vet.locationLng && (
                         <p className="text-xs text-muted-foreground mt-1 font-medium pl-6">
                           {getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, vet.locationLat, vet.locationLng).toFixed(1)}km away
                         </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/30 p-2 rounded-lg">
                    <Clock className="w-4 h-4 shrink-0" />
                    <span>{vet.hours || 'Call for hours'}</span>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {vet.specialties && JSON.parse(vet.specialties).map((spec: string) => (
                        <Badge key={spec} variant="outline" className="text-[10px] font-normal text-muted-foreground bg-background">{spec}</Badge>
                    ))}
                  </div>

                  <div className="flex gap-3 pt-1">
                    <Button asChild variant="default" className="flex-1 shadow-sm">
                      <a href={`tel:${vet.phone}`}>
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </a>
                    </Button>
                    <Button asChild variant="secondary" className="flex-1">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(vet.name + ' ' + vet.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Navigation className="w-4 h-4 mr-2" />
                        Map
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <InjuredGuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />
    </div>
  );
}
