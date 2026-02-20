'use client';
import { ThemeProvider } from "@/contexts/theme-provider";
import Navbar from "@/components/Navbar";
import { usePathname } from "next/navigation";
import { User } from "lucide-react";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const showNavbar = ['/', '/report', '/vets'].includes(pathname);

  const getTitle = () => {
    switch(pathname) {
      case '/': return 'PawConnect';
      case '/report': return 'Report Stray';
      case '/vets': return 'Nearby Vets';
      default: return 'PawConnect';
    }
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        {/* Top Bar */}
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4">
            <div className="font-bold text-lg">{getTitle()}</div>
            <button className="rounded-full p-2 hover:bg-accent hover:text-accent-foreground transition-colors">
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
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
