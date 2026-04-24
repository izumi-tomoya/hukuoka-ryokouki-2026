import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Home, Calendar, Compass, Info as InfoIcon } from 'lucide-react';

interface NavItem {
  href: string;
  label: string;
  icon: any;
}

interface CategoryTabsProps {
  slug: string;
  activePath: string;
  isSecretMode: boolean;
}

export default function CategoryTabs({ slug, activePath, isSecretMode }: CategoryTabsProps) {
  const navItems: NavItem[] = [
    { href: `/trip/${slug}`, label: 'Plan', icon: Home },
    { href: `/trip/${slug}/day/1`, label: 'Day 1', icon: Calendar },
    { href: `/trip/${slug}/day/2`, label: 'Day 2', icon: Calendar },
    { href: `/trip/${slug}/info`, label: 'Info', icon: InfoIcon },
    ...(isSecretMode ? [{ href: `/trip/${slug}/tips`, label: 'Tips', icon: Compass }] : []),
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
      {navItems.map((item) => {
        const isActive = activePath === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 px-8 py-3.5 rounded-full border transition-all text-xs font-bold tracking-[0.15em] uppercase",
              isActive
                ? "bg-rose-50 border-rose-200 text-rose-600 shadow-sm"
                : "bg-white border-stone-100 text-stone-400 hover:border-rose-100 hover:text-rose-400"
            )}
          >
            <Icon size={14} strokeWidth={isActive ? 3 : 2} />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
