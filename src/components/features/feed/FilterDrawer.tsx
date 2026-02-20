'use client';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetTrigger } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { SlidersHorizontal } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

interface FilterState {
  species: string | null;
  status: string | null;
  distance: number | null;
}

interface FilterDrawerProps {
  filters: FilterState;
  onApply: (filters: FilterState) => void;
  onClear: () => void;
}

export default function FilterDrawer({ filters, onApply, onClear }: FilterDrawerProps) {
  const [localFilters, setLocalFilters] = useState<FilterState>(filters);
  const [open, setOpen] = useState(false);

  const handleApply = () => {
    onApply(localFilters);
    setOpen(false);
  };

  const handleClear = () => {
    const cleared = { species: null, status: null, distance: null };
    setLocalFilters(cleared);
    onApply(cleared); // Apply immediately on clear? or wait for save? let's apply immediately for clear
    setOpen(false);
  };

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 rounded-full gap-2 border-dashed">
          <SlidersHorizontal className="h-3.5 w-3.5" />
          Filters
          {activeCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
              {activeCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-[20px] max-h-[85vh] overflow-y-auto">
        <SheetHeader className="mb-6">
          <SheetTitle>Filter Reports</SheetTitle>
        </SheetHeader>

        <div className="space-y-6 pb-6">
          {/* Species */}
          <div className="space-y-3">
            <Label>Species</Label>
            <div className="flex flex-wrap gap-2">
              {['Dog', 'Cat', 'Bird', 'Other'].map(type => (
                <Badge
                  key={type}
                  variant={localFilters.species === type ? 'default' : 'outline'}
                  className="px-4 py-2 cursor-pointer text-sm font-medium transition-all"
                  onClick={() => setLocalFilters(prev => ({ ...prev, species: prev.species === type ? null : type }))}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="space-y-3">
            <Label>Status</Label>
            <div className="flex flex-wrap gap-2">
              {['REPORTED', 'IN_REVIEW', 'RESCUED', 'REUNITED'].map(status => (
                <Badge
                  key={status}
                  variant={localFilters.status === status ? 'default' : 'outline'}
                  className="px-4 py-2 cursor-pointer text-sm font-medium transition-all lowercase capitalize"
                  onClick={() => setLocalFilters(prev => ({ ...prev, status: prev.status === status ? null : status }))}
                >
                  {status.replace('_', ' ').toLowerCase()}
                </Badge>
              ))}
            </div>
          </div>

          {/* Distance */}
          <div className="space-y-3">
            <Label>Distance (km)</Label>
            <div className="flex flex-wrap gap-2">
              {[2, 5, 10, 25, 50].map(km => (
                <Badge
                  key={km}
                  variant={localFilters.distance === km ? 'default' : 'outline'}
                  className="px-4 py-2 cursor-pointer text-sm font-medium transition-all"
                  onClick={() => setLocalFilters(prev => ({ ...prev, distance: prev.distance === km ? null : km }))}
                >
                  {km}km
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <SheetFooter className="flex-row gap-3 pt-2 border-t mt-auto">
          <Button variant="outline" className="flex-1" onClick={handleClear}>Clear All</Button>
          <Button className="flex-1" onClick={handleApply}>Show Results</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
