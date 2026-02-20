'use client';
import { ThemeProvider } from "@/contexts/theme-provider";
import Navbar from "@/components/layout/Navbar";
import { usePathname } from "next/navigation";
import { User, PawPrint } from "lucide-react";
import Link from 'next/link';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNavbar = ['/', '/report', '/vets', '/education'].includes(pathname);

  const getTitle = () => {
    switch(pathname) {
      case '/': return 'PawConnect';
      case '/report': return 'Report Stray';
      case '/vets': return 'Nearby Vets';
      case '/education': return 'Pet Safety';
      default: return 'PawConnect';
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen flex flex-col bg-background text-foreground antialiased font-sans">
        {/* Top Bar */}
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
          <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary hover:opacity-80 transition-opacity">
              <PawPrint className="h-6 w-6" />
              <span>{getTitle()}</span>
            </Link>
            <button
              className="rounded-full p-2 bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
              aria-label="Profile"
            >
              <User className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 container max-w-md md:max-w-2xl lg:max-w-4xl mx-auto px-4 py-6 pb-24">
          {children}
        </main>

        {/* Bottom Tabs */}
        {showNavbar && <Navbar />}
      </div>
    </ThemeProvider>
  );
}
