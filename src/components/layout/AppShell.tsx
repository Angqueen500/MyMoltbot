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
      <div className="min-h-screen flex flex-col bg-background text-foreground antialiased font-sans selection:bg-primary/20 selection:text-primary">
        {/* Top Bar */}
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6">
            <Link href="/" className="flex items-center gap-2.5 font-bold text-xl text-foreground hover:opacity-80 transition-opacity">
              <div className="bg-primary p-1.5 rounded-lg text-primary-foreground">
                <PawPrint className="h-5 w-5" />
              </div>
              <span className="tracking-tight">{getTitle()}</span>
            </Link>
            <button
              className="rounded-full h-9 w-9 flex items-center justify-center bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-all focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-none"
              aria-label="Profile"
            >
              <User className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 container max-w-md md:max-w-2xl lg:max-w-4xl mx-auto px-4 py-6 pb-32 sm:px-6">
          {children}
        </main>

        {/* Bottom Tabs */}
        {showNavbar && <Navbar />}
      </div>
    </ThemeProvider>
  );
}
