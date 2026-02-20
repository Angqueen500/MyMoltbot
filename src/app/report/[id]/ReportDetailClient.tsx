'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Clock, Share2, MessageCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/toast';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

type Comment = {
  id: number;
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
  tags: string;
  comments: Comment[];
};

export default function ReportDetailClient({ report }: { report: ReportDetail }) {
  const { addToast } = useToast();
  const [comments, setComments] = useState<Comment[]>(report.comments);
  const [newComment, setNewComment] = useState('');
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [helpForm, setHelpForm] = useState({ name: '', contact: '', message: '' });
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
      if (!res.ok) throw new Error('Failed to post comment');
      const comment = await res.json();
      setComments([comment, ...comments]);
      setNewComment('');
      addToast({ type: 'success', title: 'Comment Posted' });
    } catch (e) {
      addToast({ type: 'error', title: 'Error', message: 'Could not post comment.' });
    }
  };

  const handleSubmitHelp = async () => {
    try {
      const res = await fetch(`/api/reports/${report.id}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(helpForm),
      });
      if (!res.ok) throw new Error('Failed to send request');
      setIsHelpModalOpen(false);
      addToast({ type: 'success', title: 'Request Sent', message: 'The reporter will be notified.' });
    } catch (e) {
      addToast({ type: 'error', title: 'Error', message: 'Could not send request.' });
    }
  };

  return (
    <div className="pb-32 space-y-6">
      {/* Hero Image */}
      <div className="relative h-64 md:h-96 w-full -mx-4 md:mx-0 md:rounded-xl overflow-hidden bg-muted">
        <Image
          src={report.imagePath}
          alt={report.breed || 'Stray'}
          fill
          className="object-cover"
          unoptimized
        />
        <div className="absolute top-4 right-4">
           <Badge className={
             report.status === 'RESCUED' ? 'bg-green-500 hover:bg-green-600' :
             report.status === 'IN_REVIEW' ? 'bg-amber-500 hover:bg-amber-600' : 'bg-blue-500 hover:bg-blue-600'
           }>
             {report.status}
           </Badge>
        </div>
      </div>

      <div className="space-y-4 px-2 md:px-0">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{report.breed || 'Unknown Breed'}</h1>
            <p className="text-muted-foreground text-lg">{report.animalType} • {report.age}</p>
          </div>
          <Button variant="outline" size="icon" onClick={handleCopyLink}>
            <Share2 className="h-5 w-5" />
          </Button>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {tags.map((tag: string) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>

        {/* Description */}
        <Card>
          <CardContent className="p-4 space-y-2">
            <h3 className="font-semibold text-lg">Details</h3>
            <p className="text-muted-foreground whitespace-pre-wrap">{report.description}</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t mt-4">
              <Calendar className="h-4 w-4" />
              <span>Reported on {new Date(report.createdAt).toLocaleDateString()}</span>
              <Clock className="h-4 w-4 ml-2" />
              <span>{formatDistanceToNow(new Date(report.createdAt))} ago</span>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardContent className="p-0 overflow-hidden">
             <div className="h-64 w-full relative z-0">
               {report.locationLat && report.locationLng ? (
                 <Map
                   center={[report.locationLat, report.locationLng]}
                   zoom={15}
                   markers={[{ lat: report.locationLat, lng: report.locationLng, title: 'Report Location' }]}
                 />
               ) : (
                 <div className="h-full flex items-center justify-center bg-muted text-muted-foreground">
                   No location provided
                 </div>
               )}
             </div>
             <div className="p-4 bg-muted/30 flex items-center gap-2 text-sm font-medium">
               <MapPin className="h-4 w-4" />
               <span>
                 {report.locationLat ? `${report.locationLat.toFixed(4)}, ${report.locationLng?.toFixed(4)}` : 'Location unknown'}
               </span>
             </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Button className="w-full" size="lg" onClick={() => setIsHelpModalOpen(true)}>
            I Can Help
          </Button>
          <Button variant="outline" className="w-full" size="lg" asChild>
            <a href={`https://www.google.com/maps/search/?api=1&query=veterinarian&ll=${report.locationLat},${report.locationLng}`} target="_blank" rel="noreferrer">
              Find Nearby Vets
            </a>
          </Button>
        </div>

        {/* Comments Section */}
        <div className="space-y-4 pt-6 border-t">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Updates & Comments
          </h3>

          <div className="flex gap-2">
            <Input
              placeholder="Add an update..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handlePostComment()}
            />
            <Button onClick={handlePostComment} disabled={!newComment.trim()}>Post</Button>
          </div>

          <div className="space-y-3">
            {comments.length === 0 ? (
              <p className="text-muted-foreground text-center py-4 text-sm">No updates yet.</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="bg-muted/50 p-3 rounded-lg text-sm">
                  <p>{comment.text}</p>
                  <p className="text-xs text-muted-foreground mt-1 text-right">
                    {formatDistanceToNow(new Date(comment.createdAt))} ago
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Help Modal */}
      <Modal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} title="Offer Help">
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Leave your contact details so the reporter or a rescue organization can reach you.
          </p>
          <Input
            placeholder="Your Name"
            value={helpForm.name}
            onChange={(e) => setHelpForm({...helpForm, name: e.target.value})}
          />
          <Input
            placeholder="Phone or Email"
            value={helpForm.contact}
            onChange={(e) => setHelpForm({...helpForm, contact: e.target.value})}
          />
          <Textarea
            placeholder="How can you help? (e.g., I can transport, foster, etc.)"
            value={helpForm.message}
            onChange={(e) => setHelpForm({...helpForm, message: e.target.value})}
          />
          <Button className="w-full" onClick={handleSubmitHelp} disabled={!helpForm.name || !helpForm.contact}>
            Send Offer
          </Button>
        </div>
      </Modal>
    </div>
  );
}
