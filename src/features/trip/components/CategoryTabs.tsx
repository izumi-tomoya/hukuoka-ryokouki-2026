"use client";

import { Calendar, Camera, Compass, Home, Info as InfoIcon, LifeBuoy, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

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

  const activeTabCallback = useCallback((node: HTMLAnchorElement | null) => {
    if (node && containerRef.current) {
      const container = containerRef.current;
      const scrollLeft = node.offsetLeft - container.offsetWidth / 2 + node.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: "smooth" });
    }
  }, []);

  const dayNumbers = days ? days.map((d) => d.dayNumber) : [1, 2];

  const navItems: NavItem[] = [
    { href: `/trip/${slug}`, label: "Plan", icon: Home },
    ...dayNumbers.map((num) => ({
      href: `/trip/${slug}/day/${num}`,
      label: `Day ${num}`,
      icon: Calendar,
    })),
    { href: `/trip/${slug}/assist`, label: "Assist", icon: LifeBuoy },
    { href: `/trip/${slug}/memories`, label: "Memories", icon: Camera },
    { href: `/trip/${slug}/info`, label: "Info", icon: InfoIcon },
    ...(isSecretMode ? [{ href: `/trip/${slug}/tips`, label: "Tips", icon: Compass }] : []),
  ];

  return (
    <div
      ref={containerRef}
      className="no-scrollbar relative -mx-4 mb-8 flex items-center justify-start gap-2 overflow-x-auto scroll-smooth px-6 md:mx-0 md:mb-16 md:gap-3 md:px-0 lg:justify-center"
    >
      {navItems.map((item) => {
        const isBase = item.href === `/trip/${slug}`;
        const isActive = isBase ? activePath === item.href : activePath.startsWith(item.href);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            ref={isActive ? activeTabCallback : undefined}
            className={cn(
              "flex min-h-11 shrink-0 items-center gap-2 rounded-full border px-5 py-3 text-[10px] font-black tracking-[0.14em] uppercase transition-all sm:px-6 md:px-8 md:py-4 md:text-xs md:tracking-[0.2em]",
              isActive
                ? "bg-primary border-primary text-primary-foreground shadow-primary/20 shadow-lg"
                : "bg-card border-border text-muted-foreground hover:border-primary/50 hover:text-primary",
            )}
          >
            <Icon size={12} className="md:h-3.5 md:w-3.5" strokeWidth={isActive ? 3 : 2} />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
