'use client';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, XCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
      <div className="bg-destructive/10 p-4 rounded-full">
        <XCircle className="h-10 w-10 text-destructive" />
      </div>
      <h2 className="text-xl font-semibold">Something went wrong!</h2>
      <p className="text-muted-foreground text-sm max-w-xs">{error.message || "An unexpected error occurred."}</p>
      <Button
        onClick={() => reset()}
        variant="outline"
        className="mt-4"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Try again
      </Button>
    </div>
  );
}
