'use client';
import dynamic from 'next/dynamic';
import { ComponentProps } from 'react';
import type MapInternal from './MapInternal';

const MapInternalComponent = dynamic(() => import('./MapInternal'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-200 animate-pulse flex items-center justify-center">Loading Map...</div>
});

export default function Map(props: ComponentProps<typeof MapInternal>) {
  return <MapInternalComponent {...props} />;
}
