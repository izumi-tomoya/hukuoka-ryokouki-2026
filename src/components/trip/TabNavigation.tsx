'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Calendar, Compass, Info as InfoIcon } from 'lucide-react';

interface TabNavigationProps {
  isSecretMode: boolean;
}

export default function TabNavigation({ isSecretMode }: TabNavigationProps) {
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
    <nav className="fixed bottom-6 left-6 right-6 z-50 md:top-24 md:left-auto md:right-8 md:w-56">
      <div className="flex items-center justify-between md:flex-col md:items-stretch gap-1 rounded-[2rem] bg-white/80 p-2 shadow-lg ring-1 ring-rose-100 backdrop-blur-xl">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col md:flex-row items-center gap-2 rounded-2xl px-4 py-3 text-xs font-bold transition-all',
                isActive 
                  ? 'bg-rose-50 text-rose-600' 
                  : 'text-stone-400 hover:text-rose-400'
              )}
            >
              <Icon size={18} />
              <span className="tracking-widest uppercase">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
