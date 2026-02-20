import { prisma } from '@/lib/prisma';
import Map from '@/components/Map';
import { Phone, Clock, MapPin } from 'lucide-react';

export const revalidate = 3600;

export default async function VetsPage() {
  const vets = await prisma.vet.findMany();

  const markers = vets
    .filter(v => v.locationLat != null && v.locationLng != null)
    .map(v => ({
      lat: v.locationLat!,
      lng: v.locationLng!,
      title: v.name,
      description: v.address
    }));

  const initialCenter = markers.length > 0 ? [markers[0].lat, markers[0].lng] : undefined;

  return (
    <div className="space-y-6 pb-32">
      <h1 className="text-2xl font-bold text-gray-900">Veterinarians Nearby</h1>

      {/* Map View */}
      {markers.length > 0 && (
        <div className="h-64 rounded-xl overflow-hidden shadow-sm border border-gray-200 relative z-0">
          <Map markers={markers} zoom={11} center={initialCenter} />
        </div>
      )}

      {/* List View */}
      <div className="grid gap-4 sm:grid-cols-2">
        {vets.map((vet) => (
          <div key={vet.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-3 hover:shadow-md transition-shadow">
            <h3 className="font-bold text-lg text-gray-900">{vet.name}</h3>

            <div className="flex items-start gap-3 text-sm text-gray-600">
              <MapPin className="w-5 h-5 mt-0.5 text-gray-400 shrink-0" />
              <span>{vet.address}</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-600">
              <Phone className="w-5 h-5 text-gray-400 shrink-0" />
              <a href={`tel:${vet.phone}`} className="text-blue-600 hover:underline font-medium">{vet.phone}</a>
            </div>

            {vet.hours && (
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Clock className="w-5 h-5 text-gray-400 shrink-0" />
                <span>{vet.hours}</span>
              </div>
            )}
          </div>
        ))}
        {vets.length === 0 && (
            <p className="text-gray-500 text-center py-10">No veterinarians found.</p>
        )}
      </div>
    </div>
  );
}
