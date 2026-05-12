"use client";

import { Menu, User, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getTripBySlug } from "@/features/trip/api/tripActions";
import { cn } from "@/lib/utils";
import { getNavItems, type TripNavData } from "../constants/navigationConfig";

export default function Header() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [tripData, setTripData] = useState<TripNavData | null>(null);
  const pathname = usePathname();
  const pathParts = pathname.split("/");
  const slug = pathParts[2] && pathParts[1] === "trip" ? pathParts[2] : null;

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
    return () => {
      active = false;
    };
  }, [slug]);

  const navItems = getNavItems(tripData, !!session?.user?.isAdmin);

  return (
    <header className="dark:bg-background dark:border-border sticky top-0 z-50 border-b border-zinc-100 bg-white transition-colors">
      <div className="flex items-center justify-between px-6 py-4">
        <Link href="/" className="font-playfair dark:text-foreground text-xl font-bold tracking-tight text-zinc-900">
          Memoir
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-bold transition-colors",
                  isActive
                    ? "bg-primary text-white"
                    : "dark:text-muted-foreground dark:hover:text-foreground dark:hover:bg-card text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900",
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {session ? (
            <Link href="/user">
              <div className="bg-muted/50 dark:bg-card dark:border-border/60 hover:ring-primary/20 relative flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-zinc-200 transition-all hover:ring-2">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? "User"}
                    fill
                    sizes="32px"
                    className="object-cover"
                  />
                ) : (
                  <User size={16} className="text-zinc-400" />
                )}
              </div>
            </Link>
          ) : (
            <Link href="/auth/signin" className="dark:text-muted-foreground p-2 text-zinc-400">
              <User size={20} />
            </Link>
          )}

          <button className="dark:text-muted-foreground p-2 text-zinc-600 md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <nav className="dark:border-border dark:bg-background animate-in fade-in slide-in-from-top-4 flex flex-col gap-3 border-t border-zinc-100 bg-white px-4 py-6 shadow-xl duration-300 sm:px-6 md:hidden">
          {session?.user && (
            <Link
              href="/user"
              onClick={() => setIsOpen(false)}
              className="bg-secondary/30 dark:bg-card dark:border-border/60 mb-2 flex items-center gap-3 rounded-2xl border border-zinc-100 px-5 py-4"
            >
              <div className="bg-muted/50 dark:bg-card dark:border-border/60 relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-zinc-200">
                {session.user?.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? "User"}
                    fill
                    sizes="40px"
                    className="object-cover"
                  />
                ) : (
                  <User size={20} className="text-zinc-400" />
                )}
              </div>
              <div>
                <div className="dark:text-foreground text-sm font-bold text-zinc-900">
                  {session.user.name || "ユーザー"}
                </div>
                <div className="dark:text-muted-foreground text-[10px] text-zinc-500">
                  {session.user.isAdmin ? "管理者" : "一般ユーザー"}
                </div>
              </div>
            </Link>
          )}
          {!!session?.user?.isAdmin && (
            <div className="mb-1 px-4 py-1 text-[9px] font-black tracking-[0.3em] text-rose-500 uppercase">
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
                  "rounded-2xl border px-5 py-4 text-sm font-bold transition-all",
                  isActive
                    ? "border-rose-100 bg-rose-50 text-rose-600 shadow-sm"
                    : "bg-secondary/15 border-zinc-50 text-zinc-600",
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
