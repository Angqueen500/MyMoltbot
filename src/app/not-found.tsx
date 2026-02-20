'use client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Home, AlertCircle } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-4">
      <div className="bg-destructive/10 p-4 rounded-full">
        <AlertCircle className="h-10 w-10 text-destructive" />
      </div>
      <h1 className="text-4xl font-bold tracking-tight">404</h1>
      <p className="text-lg text-muted-foreground">Oops! Page not found.</p>
      <Button onClick={() => router.push('/')} variant="default" className="mt-4">
        <Home className="mr-2 h-4 w-4" />
        Go Home
      </Button>
    </div>
  );
}
