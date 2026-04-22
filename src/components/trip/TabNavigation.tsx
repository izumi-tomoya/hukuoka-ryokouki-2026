'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Calendar, Compass, type LucideIcon } from 'lucide-react';

interface TabNavigationProps {
  isSecretMode: boolean;
}

const iconMap: Record<string, LucideIcon> = {
  'Itinerary': Home,
  'Day 1': Calendar,
  'Day 2': Calendar,
  'Secret Tips': Compass,
};

export default function TabNavigation({ isSecretMode }: TabNavigationProps) {
  const pathname = usePathname();
  
  // Extract slug from path: /trip/[slug]/...
  const pathParts = pathname.split('/');
  const isTripPage = pathParts[1] === 'trip';
  const slug = isTripPage ? pathParts[2] : null;

  // Define navigation items based on current context
  const navItems = slug ? [
    { href: `/trip/${slug}`, label: 'Itinerary', icon: 'Itinerary' },
    { href: `/trip/${slug}/day/1`, label: 'Day 1', icon: 'Day 1' },
    { href: `/trip/${slug}/day/2`, label: 'Day 2', icon: 'Day 2' },
    ...(isSecretMode ? [{ href: `/trip/${slug}/tips`, label: 'Secret Tips', icon: 'Secret Tips' }] : []),
  ] : [
    { href: '/', label: 'Home', icon: 'Itinerary' },
  ];

  // If we're on the portal page and not a trip page, the nav is very simple
  if (!isTripPage && pathname === '/') {
    return null; // Or show a simplified version
  }

  return (
    <>
      {/* ── Mobile bottom pill (< md) ── */}
      <nav className="fixed bottom-8 left-1/2 z-50 -translate-x-1/2 md:hidden">
        <div className="flex items-center gap-1.5 rounded-full border border-stone-200/50 bg-white/90 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.15)] backdrop-blur-2xl ring-1 ring-black/5">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = iconMap[item.icon];
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'relative flex h-11 items-center justify-center gap-2 rounded-full transition-all duration-500 active:scale-90',
                  isActive ? 'px-5 text-stone-900' : 'w-11 text-stone-400 hover:text-stone-600'
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 z-0 rounded-full bg-stone-100 shadow-inner animate-in fade-in zoom-in-95 duration-500" />
                )}
                <div className="relative z-10">
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                {isActive && (
                  <span className="relative z-10 text-[11px] font-black tracking-wider uppercase whitespace-nowrap animate-in slide-in-from-left-2 duration-500">
                    {item.label}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── Desktop top bar (≥ md) ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 hidden md:block">
        <div className="border-b border-stone-100/60 bg-white/80 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-10 h-16">
            <div className="flex items-center gap-6">
              <Link href="/" className="group flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 shadow-lg shadow-stone-900/10 transition-transform group-hover:scale-105 group-active:scale-95">
                  <span className="text-sm">✈️</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-playfair text-[15px] font-black text-stone-900 tracking-tight leading-none">
                    Memoir <span className="italic font-bold text-amber-600/90">Portal</span>
                  </span>
                  {slug && (
                    <span className="text-[9px] font-black text-stone-300 uppercase tracking-[3.5px] mt-1.5">
                      Current Journey
                    </span>
                  )}
                </div>
              </Link>

              {slug && (
                <>
                  <div className="h-6 w-px bg-stone-100 mx-2" />
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-50 border border-stone-100">
                    <span className="text-[10px] font-black tracking-[2px] text-stone-400 uppercase">Trip Menu:</span>
                    <span className="text-[11px] font-bold text-stone-600">福岡旅行記 2026</span>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = iconMap[item.icon];
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'group relative flex items-center gap-2.5 rounded-full px-5 py-2 text-[12px] font-bold tracking-tight transition-all duration-300',
                      isActive
                        ? 'text-stone-900 bg-stone-50/50'
                        : 'text-stone-400 hover:text-stone-900 hover:bg-stone-50'
                    )}
                  >
                    <Icon 
                      size={14} 
                      strokeWidth={isActive ? 2.5 : 2} 
                      className={cn("transition-colors", isActive ? "text-amber-600" : "text-stone-300 group-hover:text-stone-400")} 
                    />
                    <span>{item.label}</span>
                    
                    {isActive && (
                      <div className="absolute -bottom-5.25 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(217,119,6,0.4)] animate-in slide-in-from-bottom-1 duration-500" />
                    )}
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

