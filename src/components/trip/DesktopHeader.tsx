'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Calendar, Compass, Info as InfoIcon, User, LogOut, Menu, X } from 'lucide-react';
import { Session } from 'next-auth';

interface HeaderProps {
  isSecretMode: boolean;
  session: Session | null;
}

export default function Header({ isSecretMode, session }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const pathParts = pathname.split('/');
  const slug = pathParts[2] && pathParts[1] === 'trip' ? pathParts[2] : null;

  const baseNav = [{ href: '/', label: 'Portal', icon: Home }];
  const tripNav = slug ? [
    { href: `/trip/${slug}`, label: 'Plan', icon: Home },
    { href: `/trip/${slug}/day/1`, label: 'Day 1', icon: Calendar },
    { href: `/trip/${slug}/day/2`, label: 'Day 2', icon: Calendar },
    { href: `/trip/${slug}/info`, label: 'Info', icon: InfoIcon },
    ...(isSecretMode ? [{ href: `/trip/${slug}/tips`, label: 'Tips', icon: Compass }] : []),
  ] : [];

  const navItems = [...baseNav, ...tripNav];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-zinc-100">
      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="font-playfair text-xl font-bold text-zinc-900 tracking-tight">Memoir</Link>
        
        <div className="flex items-center gap-4">
          {/* モバイルでも常時表示するユーザーアイコン */}
          {session ? (
            <div className="h-8 w-8 rounded-full bg-stone-100 border border-zinc-200 overflow-hidden flex items-center justify-center">
              {session.user?.image ? (
                <img src={session.user.image} alt={session.user.name ?? ""} className="h-full w-full object-cover" crossOrigin="anonymous" />
              ) : <User size={16} />}
            </div>
          ) : (
            <Link href="/auth/signin" className="p-2 text-zinc-400"><User size={20} /></Link>
          )}

          <button className="p-2" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* ... (Desktop nav hidden md:flex) ... */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn("px-4 py-2 text-sm font-bold transition-colors rounded-full", isActive ? "bg-primary text-white" : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop User Info */}
        <div className="hidden md:flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-4 pl-6 border-l border-zinc-100">
              <div className="flex flex-col items-end">
                {session.user?.isAdmin && <span className="text-[9px] font-black text-rose-500 uppercase tracking-[0.2em] mb-0.5 bg-rose-50 px-2 py-0.5 rounded-sm">Admin</span>}
                <span className="text-sm font-bold text-zinc-900">{session.user?.name}</span>
              </div>
              <div className="h-9 w-9 rounded-full bg-stone-100 border border-zinc-200 overflow-hidden flex items-center justify-center">
                {session.user?.image ? (
                  <img src={session.user.image} alt={session.user.name ?? ""} className="h-full w-full object-cover" crossOrigin="anonymous" />
                ) : <User size={18} />}
              </div>
            </div>
          ) : (
            <Link href="/auth/signin" className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-primary transition-colors border border-zinc-200 rounded-full">Login</Link>
          )}
        </div>
      </div>

      {isOpen && (
        <nav className="md:hidden px-6 py-4 border-t border-zinc-100 flex flex-col gap-2 bg-stone-50">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)} className="px-4 py-3 text-sm font-bold text-zinc-600 border border-zinc-100 rounded-2xl bg-white">
              {item.label}
            </Link>
          ))}
          {session && (
            <div className="px-4 py-3 mt-2 border border-zinc-100 rounded-2xl bg-white flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-zinc-900">{session.user?.name}</span>
                {session.user?.isAdmin && (
                  <span className="text-[9px] font-black text-rose-500 uppercase tracking-[0.2em] mt-1 bg-rose-50 px-2 py-0.5 rounded-sm w-fit">
                    Admin
                  </span>
                )}
              </div>
              <Link href="/api/auth/signout" className="text-rose-500 font-bold text-xs uppercase">Logout</Link>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
