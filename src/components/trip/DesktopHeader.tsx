'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Calendar, Compass, Info as InfoIcon } from 'lucide-react';

export default function DesktopHeader({ isSecretMode }: { isSecretMode: boolean }) {
  const pathname = usePathname();
  const pathParts = pathname.split('/');
  const isTripPage = pathParts[1] === 'trip';
  const slug = isTripPage ? pathParts[2] : null;

  if (!slug) return null;

  const navItems = [
    { href: `/trip/${slug}`, label: 'Itinerary', icon: Home },
    { href: `/trip/${slug}/day/1`, label: 'Day 1', icon: Calendar },
    { href: `/trip/${slug}/day/2`, label: 'Day 2', icon: Calendar },
    { href: `/trip/${slug}/info`, label: 'Essentials', icon: InfoIcon },
    ...(isSecretMode ? [{ href: `/trip/${slug}/tips`, label: 'Secret Tips', icon: Compass }] : []),
  ];

  return (
    <header className="hidden md:flex items-center justify-between px-12 py-6 bg-white border-b border-zinc-100 sticky top-0 z-50">
      <Link href="/" className="font-playfair text-2xl font-bold text-zinc-900">Memoir</Link>
      <nav className="flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "px-4 py-2 text-sm font-bold transition-colors rounded-full",
                isActive 
                  ? "bg-zinc-900 text-white" 
                  : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
