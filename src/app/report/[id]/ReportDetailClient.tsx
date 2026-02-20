'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Clock, Share2, MessageCircle, ArrowLeft, Send } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { Input } from '@/components/ui/input';
import StatusPill from '@/components/ui/status-pill';
import ActionButtons from '@/components/features/report/ActionButtons';
import SafetyDisclaimer from '@/components/features/report/SafetyDisclaimer';
import ReportTimeline from '@/components/features/report/ReportTimeline';
import Link from 'next/link';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

type Update = {
  id: number;
  type: string;
  text: string;
  createdAt: string;
};

type ReportDetail = {
  id: number;
  imagePath: string;
  description: string;
  breed: string;
  age: string;
  animalType: string;
  status: string;
  createdAt: string;
  locationLat: number | null;
  locationLng: number | null;
  privacy: boolean;
  tags: string;
  updates: Update[];
};

export default function ReportDetailClient({ report }: { report: ReportDetail }) {
  const { addToast } = useToast();
  const [updates, setUpdates] = useState<Update[]>(report.updates);
  const [newUpdate, setNewUpdate] = useState('');
  const tags = JSON.parse(report.tags || '[]');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast({ type: 'success', title: 'Link Copied', message: 'Share it to help find a home!' });
  };

  const handlePostUpdate = async () => {
    if (!newUpdate.trim()) return;
    try {
      const res = await fetch(`/api/reports/${report.id}/updates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newUpdate, type: 'SIGHTING' }), // Default to sighting for community
      });
      if (!res.ok) throw new Error('Failed');
      const update = await res.json();
      setUpdates([update, ...updates]);
      setNewUpdate('');
      addToast({ type: 'success', title: 'Update Posted' });
    } catch {
      addToast({ type: 'error', title: 'Error', message: 'Could not post update.' });
    }
  };

  return (
    <div className="pb-32 space-y-6">
      {/* Nav Back */}
      <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-2">
        <ArrowLeft className="mr-1 h-4 w-4" /> Back to Feed
      </Link>

      {/* Hero Image */}
      <div className="relative h-80 w-full -mx-4 md:mx-0 md:rounded-2xl overflow-hidden bg-muted shadow-sm">
        <Image
          src={report.imagePath}
          alt={report.breed || 'Stray'}
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute top-4 right-4">
           <StatusPill status={report.status} className="text-sm px-3 py-1" />
        </div>
      </div>

      <div className="space-y-6 px-1 md:px-0">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{report.breed || 'Unknown Breed'}</h1>
            <p className="text-muted-foreground text-lg flex items-center gap-2 mt-1">
              {report.animalType}
              <span className="w-1 h-1 rounded-full bg-muted-foreground/50" />
              {report.age}
            </p>
          </div>
          <Button variant="secondary" size="icon" className="rounded-full" onClick={handleCopyLink}>
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag: string) => (
            <Badge key={tag} variant="secondary" className="px-3 py-1 text-sm bg-secondary/50">{tag}</Badge>
          ))}
        </div>

        {/* Actions */}
        <ActionButtons reportId={report.id} />

        {/* Description */}
        <div className="space-y-2">
            <h3 className="font-semibold text-lg">About</h3>
            <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {report.description || "No additional details provided."}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{new Date(report.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                <span>{formatDistanceToNow(new Date(report.createdAt))} ago</span>
              </div>
            </div>
        </div>

        {/* Location */}
        <div className="space-y-3">
             <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Location</h3>
                {report.privacy && <Badge variant="outline" className="text-xs">Approximate Area</Badge>}
             </div>

             <div className="h-64 w-full rounded-xl overflow-hidden relative z-0 border border-border bg-muted">
               {report.locationLat && report.locationLng ? (
                 <Map
                   center={[report.locationLat, report.locationLng]}
                   zoom={report.privacy ? 13 : 15}
                   markers={[{ lat: report.locationLat, lng: report.locationLng, title: report.privacy ? 'Approximate Area' : 'Report Location' }]}
                 />
               ) : (
                 <div className="h-full flex items-center justify-center text-muted-foreground">
                   No location provided
                 </div>
               )}
             </div>
             <div className="flex items-center gap-2 text-sm text-muted-foreground">
               <MapPin className="h-4 w-4 shrink-0" />
               <span>
                 {report.locationLat
                    ? (report.privacy ? 'Location hidden for safety' : `${report.locationLat.toFixed(4)}, ${report.locationLng?.toFixed(4)}`)
                    : 'Location unknown'}
               </span>
             </div>
        </div>

        <SafetyDisclaimer />

        {/* Timeline & Updates */}
        <div className="pt-6 border-t border-border">
          <div className="flex flex-col gap-6">
             <div className="bg-secondary/20 p-4 rounded-xl space-y-3">
                <h4 className="font-medium text-sm">Have you seen this animal?</h4>
                <div className="flex gap-2">
                    <Input
                        placeholder="Add a sighting or update..."
                        value={newUpdate}
                        onChange={(e) => setNewUpdate(e.target.value)}
                        className="bg-background"
                        onKeyDown={(e) => e.key === 'Enter' && handlePostUpdate()}
                    />
                    <Button size="icon" onClick={handlePostUpdate} disabled={!newUpdate.trim()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
             </div>

             <ReportTimeline updates={updates} />
          </div>
        </div>
      </div>
    </div>
  );
}
