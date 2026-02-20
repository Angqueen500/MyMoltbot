'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Clock, Share2, MessageCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { Input } from '@/components/ui/input';
import StatusPill from '@/components/ui/status-pill';
import ActionButtons from '@/components/features/report/ActionButtons';
import SafetyDisclaimer from '@/components/features/report/SafetyDisclaimer';
import Link from 'next/link';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

// Types... (can be imported from prisma types if generated, but kept here for now)
type Comment = {
  id: number;
  text: string;
  createdAt: string; // serialized date
};

type ReportDetail = {
  id: number;
  imagePath: string;
  description: string;
  breed: string;
  age: string;
  animalType: string;
  status: string;
  createdAt: string; // serialized date
  locationLat: number | null;
  locationLng: number | null;
  tags: string;
  comments: Comment[];
};

export default function ReportDetailClient({ report }: { report: ReportDetail }) {
  const { addToast } = useToast();
  const [comments, setComments] = useState<Comment[]>(report.comments);
  const [newComment, setNewComment] = useState('');
  const tags = JSON.parse(report.tags || '[]');

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    addToast({ type: 'success', title: 'Link Copied', message: 'Share it to help find a home!' });
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    try {
      const res = await fetch(`/api/reports/${report.id}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newComment }),
      });
      if (!res.ok) throw new Error('Failed');
      const comment = await res.json();
      setComments([comment, ...comments]);
      setNewComment('');
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
             <h3 className="font-semibold text-lg">Location</h3>
             <div className="h-64 w-full rounded-xl overflow-hidden relative z-0 border border-border bg-muted">
               {report.locationLat && report.locationLng ? (
                 <Map
                   center={[report.locationLat, report.locationLng]}
                   zoom={15}
                   markers={[{ lat: report.locationLat, lng: report.locationLng, title: 'Report Location' }]}
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
                 {report.locationLat ? `${report.locationLat.toFixed(4)}, ${report.locationLng?.toFixed(4)}` : 'Location unknown'}
               </span>
             </div>
        </div>

        <SafetyDisclaimer />

        {/* Comments Section */}
        <div className="space-y-4 pt-6 border-t border-border">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Community Updates
          </h3>

          <div className="flex gap-2">
            <Input
              placeholder="Add an update or comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="bg-secondary/30"
              onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
            />
            <Button onClick={handlePostComment} disabled={!newComment.trim()}>Post</Button>
          </div>

          <div className="space-y-4 mt-4">
            {comments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8 text-sm italic">No updates yet. Be the first to help!</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                   <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs shrink-0">
                     U
                   </div>
                   <div className="space-y-1">
                      <div className="bg-secondary/30 p-3 rounded-lg rounded-tl-none text-sm">
                        <p>{comment.text}</p>
                      </div>
                      <p className="text-xs text-muted-foreground pl-1">
                        {formatDistanceToNow(new Date(comment.createdAt))} ago
                      </p>
                   </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
