'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Calendar, Compass, Info as InfoIcon, Camera } from 'lucide-react';

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
    { href: `/trip/${slug}/memories`, label: 'Memories', icon: Camera },
    { href: `/trip/${slug}/info`, label: 'Essentials', icon: InfoIcon },
    ...(isSecretMode ? [{ href: `/trip/${slug}/tips`, label: 'Secret Tips', icon: Compass }] : []),
  ];

  return (
    <nav className="fixed bottom-6 left-4 right-4 z-50 md:hidden">
      <div className="flex items-center justify-between gap-1 rounded-full bg-card/70 px-4 py-2.5 shadow-2xl ring-1 ring-border/50 backdrop-blur-2xl">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 rounded-full px-4 py-2.5 transition-all',
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-110' 
                  : 'text-muted-foreground hover:text-foreground active:scale-95'
              )}
            >
              <Icon size={18} strokeWidth={isActive ? 3 : 2} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
