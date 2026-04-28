'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Home, Calendar, Compass, Info as InfoIcon, LucideIcon } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

interface CategoryTabsProps {
  slug: string;
  activePath: string;
  isSecretMode: boolean;
  days?: { dayNumber: number }[];
}

export default function CategoryTabs({ slug, activePath, isSecretMode, days }: CategoryTabsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLAnchorElement>(null);

  const dayNumbers = days ? days.map(d => d.dayNumber) : [1, 2];

  const navItems: NavItem[] = [
    { href: `/trip/${slug}`, label: 'Plan', icon: Home },
    ...dayNumbers.map(num => ({
      href: `/trip/${slug}/day/${num}`,
      label: `Day ${num}`,
      icon: Calendar
    })),
    { href: `/trip/${slug}/info`, label: 'Info', icon: InfoIcon },
    ...(isSecretMode ? [{ href: `/trip/${slug}/tips`, label: 'Tips', icon: Compass }] : []),
  ];

  useEffect(() => {
    if (activeTabRef.current && containerRef.current) {
      const container = containerRef.current;
      const tab = activeTabRef.current;
      const scrollLeft = tab.offsetLeft - (container.offsetWidth / 2) + (tab.offsetWidth / 2);
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [activePath]);

  return (
    <div 
      ref={containerRef}
      className="flex items-center justify-start md:justify-center gap-2 md:gap-3 mb-12 md:mb-16 overflow-x-auto pb-4 -mx-6 px-6 md:mx-0 md:px-0 scrollbar-hide no-scrollbar"
    >
      {navItems.map((item) => {
        const isBase = item.href === `/trip/${slug}`;
        const isActive = isBase ? activePath === item.href : activePath.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            ref={isActive ? activeTabRef : null}
            className={cn(
              "flex shrink-0 items-center gap-2 px-6 md:px-8 py-3.5 md:py-4 rounded-full border transition-all text-[10px] md:text-xs font-black tracking-[0.2em] uppercase",
              isActive
                ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20"
                : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-primary"
            )}
          >
            <Icon size={12} className="md:w-3.5 md:h-3.5" strokeWidth={isActive ? 3 : 2} />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
