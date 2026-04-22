'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from '@/config/constants';
import { Home, Calendar, Compass } from 'lucide-react';

interface TabNavigationProps {
  isSecretMode: boolean;
}

const iconMap: Record<string, any> = {
  Home: Home,
  'Day 1': Calendar,
  'Day 2': Calendar,
  Tips: Compass,
};

export default function TabNavigation({ isSecretMode }: TabNavigationProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-6 left-1/2 z-50 w-[90%] max-w-md -translate-x-1/2">
      <div className="flex items-center justify-around rounded-[32px] border border-white/40 bg-white/70 px-4 py-3 shadow-2xl shadow-slate-900/10 backdrop-blur-2xl">
        {NAV_ITEMS.map((item) => {
          // Hide tips from navigation if secret mode is off
          if (item.href === '/tips' && !isSecretMode) {
            return null;
          }

          const isActive = pathname === item.href;
          const Icon = iconMap[item.label];

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'relative flex flex-1 flex-col items-center gap-1.5 transition-all active:scale-90',
                isActive ? 'text-orange-600' : 'text-slate-400 hover:text-slate-600'
              )}
            >
              <div className={cn(
                "flex h-10 w-10 items-center justify-center rounded-2xl transition-all",
                isActive ? "bg-orange-50" : "bg-transparent"
              )}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={cn(
                'text-[9px] font-bold tracking-tight',
                isActive ? 'opacity-100' : 'opacity-60'
              )}>
                {item.label}
              </span>
              
              {isActive && (
                <div className="absolute -bottom-1 h-1 w-4 rounded-full bg-orange-600 blur-[1px]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
