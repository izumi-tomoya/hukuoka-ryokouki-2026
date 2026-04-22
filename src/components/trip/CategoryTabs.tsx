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
    { href: `/trip/${slug}`, label: 'Itinerary', icon: Home },
    { href: `/trip/${slug}/day/1`, label: 'Day 1', icon: Calendar },
    { href: `/trip/${slug}/day/2`, label: 'Day 2', icon: Calendar },
    { href: `/trip/${slug}/info`, label: 'Essentials', icon: InfoIcon },
    ...(isSecretMode ? [{ href: `/trip/${slug}/tips`, label: 'Secret Tips', icon: Compass }] : []),
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
      {navItems.map((item) => {
        const isActive = activePath === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-2 py-4 rounded-[2rem] border transition-all text-xs font-black uppercase tracking-widest",
              isActive
                ? "bg-rose-50 border-rose-200 text-rose-700 shadow-sm"
                : "bg-white border-stone-100 text-stone-400 hover:border-rose-100 hover:text-rose-400"
            )}
          >
            <Icon size={18} />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
