'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { getNavItems } from '../constants/navigationConfig';

export function NavLinkProvider({ isSecretMode }: { isSecretMode: boolean }) {
  const pathname = usePathname();
  const pathParts = pathname.split('/');
  const slug = pathParts[2] && pathParts[1] === 'trip' ? pathParts[2] : null;

  const navItems = getNavItems(slug ? { slug, days: [] } : null, isSecretMode);

  return (
    <>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'px-4 py-2 text-sm font-bold transition-colors rounded-full',
              isActive
                ? 'bg-primary text-white'
                : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100'
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

