'use client';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useState } from 'react';

// Fix Leaflet icon issue
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function LocationMarker({ onSelect }: { onSelect: (lat: number, lng: number) => void }) {
  const map = useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });
  return null;
}

interface MapProps {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{ lat: number; lng: number; title?: string; description?: string }>;
  onLocationSelect?: (lat: number, lng: number) => void;
  selectedLocation?: { lat: number; lng: number } | null;
}

export default function MapInternal({
  center = [40.7128, -74.0060],
  zoom = 13,
  markers = [],
  onLocationSelect,
  selectedLocation
}: MapProps) {
  // Use local state only for optimistic updates if needed,
  // but better to rely on the prop if it's controlled.
  // Or if we need an initial state:
  const [localPos, setLocalPos] = useState<L.LatLng | null>(
    selectedLocation ? L.latLng(selectedLocation.lat, selectedLocation.lng) : null
  );

  // We are removing the useEffect to avoid the lint error.
  // Instead, we derive the position from props during render if available,
  // or fall back to local state if the parent hasn't updated yet (optimistic).
  // However, since we want to support controlled component behavior:

  const displayPosition = selectedLocation
    ? L.latLng(selectedLocation.lat, selectedLocation.lng)
    : localPos;

  const handleSelect = (lat: number, lng: number) => {
    setLocalPos(L.latLng(lat, lng));
    if (onLocationSelect) onLocationSelect(lat, lng);
  };

  return (
    <MapContainer
      center={center as L.LatLngExpression}
      zoom={zoom}
      style={{ height: '100%', width: '100%' }}
      scrollWheelZoom={true}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {markers.map((m, i) => (
        <Marker key={i} position={[m.lat, m.lng]} icon={icon}>
           {m.title && <Popup>
             <strong>{m.title}</strong>
             {m.description && <p>{m.description}</p>}
           </Popup>}
        </Marker>
      ))}
      {displayPosition && (
        <Marker position={displayPosition} icon={icon}>
          <Popup>Selected Location</Popup>
        </Marker>
      )}
      {onLocationSelect && <LocationMarker onSelect={handleSelect} />}
    </MapContainer>
  );
}
