'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Camera, Stethoscope } from 'lucide-react';
import clsx from 'clsx';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/report', label: 'Report', icon: Camera },
    { href: '/vets', label: 'Vets', icon: Stethoscope },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center h-16">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex flex-col items-center justify-center w-full h-full text-xs font-medium transition-colors",
              pathname === href ? "text-blue-600" : "text-gray-500 hover:text-gray-900"
            )}
          >
            <Icon className="w-6 h-6 mb-1" />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
