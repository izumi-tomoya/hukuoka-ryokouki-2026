'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { User, Menu, X } from 'lucide-react';
import { Session } from 'next-auth';
import { getNavItems, TripNavData } from '../constants/navigationConfig';
import { getTripBySlug } from '@/features/trip/api/tripActions';

interface HeaderProps {
  session: Session | null;
}

export default function Header({ session }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tripData, setTripData] = useState<TripNavData | null>(null);
  const pathname = usePathname();
  const pathParts = pathname.split('/');
  const slug = pathParts[2] && pathParts[1] === 'trip' ? pathParts[2] : null;

  useEffect(() => {
    let active = true;
    if (slug) {
      getTripBySlug(slug).then((data) => {
        if (active) setTripData(data as unknown as TripNavData); // Cast for Prisma to interface mapping
      });
    } else {
      // Async reset to avoid cascading renders warning
      Promise.resolve().then(() => {
        if (active) setTripData(null);
      });
    }
    return () => { active = false; };
  }, [slug]);

  const navItems = getNavItems(tripData, !!session?.user?.isAdmin);

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 transition-colors">
      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="font-playfair text-xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">Memoir</Link>
        
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn("px-4 py-2 text-sm font-bold transition-colors rounded-full", isActive ? "bg-primary text-white" : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {session ? (
            <Link href="/user">
              <div className="h-8 w-8 rounded-full bg-stone-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 overflow-hidden flex items-center justify-center relative hover:ring-2 hover:ring-primary/20 transition-all">
                {session.user?.image ? (
                  <Image src={session.user.image} alt={session.user.name ?? "User"} fill sizes="32px" className="object-cover" />
                ) : <User size={16} className="text-zinc-400" />}
              </div>
            </Link>
          ) : (
            <Link href="/auth/signin" className="p-2 text-zinc-400 dark:text-zinc-500"><User size={20} /></Link>
          )}

          <button className="lg:hidden p-2 text-zinc-600 dark:text-zinc-400" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <nav className="lg:hidden px-4 sm:px-6 py-6 border-t border-zinc-100 dark:border-zinc-800 flex flex-col gap-3 bg-white dark:bg-zinc-900 shadow-xl animate-in fade-in slide-in-from-top-4 duration-300">
          {session?.user && (
            <Link 
              href="/user" 
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-5 py-4 bg-stone-50 dark:bg-zinc-800 border border-zinc-100 dark:border-zinc-700 rounded-2xl mb-2"
            >
              <div className="h-10 w-10 rounded-full bg-stone-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 overflow-hidden flex items-center justify-center relative">
                {session.user?.image ? (
                  <Image src={session.user.image} alt={session.user.name ?? "User"} fill sizes="40px" className="object-cover" />
                ) : <User size={20} className="text-zinc-400" />}
              </div>
              <div>
                <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{session.user.name || "ユーザー"}</div>
                <div className="text-[10px] text-zinc-500 dark:text-zinc-400">{session.user.isAdmin ? "管理者" : "一般ユーザー"}</div>
              </div>
            </Link>
          )}
          {!!session?.user?.isAdmin && (
            <div className="px-4 py-1 text-[9px] font-black text-rose-500 uppercase tracking-[0.3em] mb-1">
              Admin Mode Active
            </div>
          )}
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                onClick={() => setIsOpen(false)} 
                className={cn(
                  "px-5 py-4 text-sm font-bold border rounded-2xl transition-all",
                  isActive 
                    ? "bg-rose-50 border-rose-100 text-rose-600 shadow-sm" 
                    : "text-zinc-600 border-zinc-50 bg-stone-50/50"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
