import { useState, useEffect } from 'react';

export default function useGeolocation() {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      // Defer state update to avoid synchronous effect error in some strict setups
      const t = setTimeout(() => setError('Geolocation is not supported by your browser'), 0);
      return () => clearTimeout(t);
    }

    const watcher = navigator.geolocation.watchPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setError(null);
      },
      (err) => {
        setError(err.message);
      }
    );

    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

  return { location, error };
}
