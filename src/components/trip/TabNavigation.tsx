'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/config/constants';
import { Home, Calendar, Compass, type LucideIcon } from 'lucide-react';

interface TabNavigationProps {
  isSecretMode: boolean;
}

const iconMap: Record<string, LucideIcon> = {
  Home,
  'Day 1': Calendar,
  'Day 2': Calendar,
  Tips: Compass,
};

export default function TabNavigation({ isSecretMode }: TabNavigationProps) {
  const pathname = usePathname();

  const visibleItems = NAV_ITEMS.filter(
    (item) => !(item.href === '/tips' && !isSecretMode)
  );

  return (
    <>
      {/* ── Mobile bottom pill (< md) ── */}
      <nav className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 md:hidden">
        <div className="flex items-center gap-1 rounded-[28px] border border-white/50 bg-white/85 px-3 py-2.5 shadow-2xl shadow-stone-900/10 backdrop-blur-2xl">
          {visibleItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = iconMap[item.label];
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex flex-col items-center gap-1 px-4 transition-all active:scale-90',
                  isActive ? 'text-orange-600' : 'text-stone-400 hover:text-stone-600'
                )}
              >
                <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl transition-all', isActive ? 'bg-orange-50' : '')}>
                  <Icon size={19} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={cn('text-[8px] font-bold tracking-tight', isActive ? 'opacity-100' : 'opacity-50')}>
                  {item.label}
                </span>
                {isActive && <div className="absolute -bottom-0.5 h-0.5 w-4 rounded-full bg-orange-500 blur-[1px]" />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── Desktop top bar (≥ md) ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 hidden md:block">
        <div className="border-b border-stone-100 bg-white/92 backdrop-blur-2xl shadow-sm">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-8 h-14">
            <div className="flex items-center gap-3">
              <span className="text-lg leading-none">✈️</span>
              <span className="font-playfair text-[15px] font-bold text-stone-800 tracking-tight">
                ふたりの<span className="italic text-orange-500">福岡</span>
              </span>
              <span className="rounded-full bg-stone-100 px-2 py-0.5 text-[9px] font-bold text-stone-400 uppercase tracking-wider">
                2026
              </span>
            </div>

            <div className="flex items-center gap-1">
              {visibleItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = iconMap[item.label];
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'relative flex items-center gap-2 rounded-xl px-4 py-2 text-[12px] font-bold tracking-tight transition-all',
                      isActive
                        ? 'bg-orange-50 text-orange-600'
                        : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
                    )}
                  >
                    <Icon size={14} strokeWidth={isActive ? 2.5 : 2} />
                    {item.label}
                    {isActive && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-4 rounded-full bg-orange-500" />}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
