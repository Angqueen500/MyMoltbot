'use client';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type Update = {
  id: number;
  type: string;
  text: string;
  createdAt: string;
};

export default function ReportTimeline({ updates }: { updates: Update[] }) {
  if (updates.length === 0) return null;

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Timeline</h3>
      <div className="relative border-l-2 border-muted ml-3 space-y-8 pb-4">
        {updates.map((update) => (
          <div key={update.id} className="relative pl-8">
            {/* Dot */}
            <div className={cn(
              "absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 border-background",
              update.type === 'OFFICIAL' ? "bg-blue-500" : "bg-muted-foreground"
            )} />

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {formatDistanceToNow(new Date(update.createdAt))} ago
                </span>
                {update.type === 'OFFICIAL' && (
                  <Badge variant="default" className="text-[10px] h-5 px-1.5">Official Update</Badge>
                )}
              </div>
              <div className="bg-muted/30 p-3 rounded-lg text-sm">
                {update.text}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
