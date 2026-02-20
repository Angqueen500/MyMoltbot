'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Camera, Stethoscope, BookOpen } from 'lucide-react';
import clsx from 'clsx';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/report', label: 'Report', icon: Camera },
    { href: '/vets', label: 'Vets', icon: Stethoscope },
    { href: '/education', label: 'Safety', icon: BookOpen },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border shadow-lg z-50 h-16 safe-area-bottom">
      <div className="flex justify-around items-center h-full max-w-md md:max-w-2xl lg:max-w-4xl mx-auto">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex flex-col items-center justify-center w-full h-full text-[10px] font-medium transition-colors relative",
              pathname === href ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <div className={clsx("p-1.5 rounded-xl transition-all", pathname === href ? "bg-primary/10" : "bg-transparent")}>
                <Icon className={clsx("w-6 h-6", pathname === href ? "stroke-[2.5]" : "stroke-2")} />
            </div>
            <span className="mt-0.5">{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
