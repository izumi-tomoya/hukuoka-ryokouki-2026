import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface BentoTileProps {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  href?: string;
  icon?: LucideIcon;
  color?: "rose" | "sky" | "zinc" | "emerald" | "amber" | "indigo";
  variant?: "featured" | "card";
}

const accentColor = {
  rose: { icon: "bg-rose-50 text-rose-500", num: "text-rose-500", border: "border-rose-100", glow: "bg-rose-400" },
  sky: { icon: "bg-sky-50 text-sky-500", num: "text-sky-500", border: "border-sky-100", glow: "bg-sky-400" },
  zinc: { icon: "bg-zinc-100 text-zinc-500", num: "text-zinc-700", border: "border-zinc-100", glow: "bg-zinc-400" },
  emerald: {
    icon: "bg-emerald-50 text-emerald-500",
    num: "text-emerald-600",
    border: "border-emerald-100",
    glow: "bg-emerald-400",
  },
  amber: {
    icon: "bg-amber-50 text-amber-500",
    num: "text-amber-500",
    border: "border-amber-100",
    glow: "bg-amber-400",
  },
  indigo: {
    icon: "bg-indigo-50 text-indigo-500",
    num: "text-indigo-500",
    border: "border-indigo-100",
    glow: "bg-indigo-400",
  },
};

export function BentoTile({
  children,
  className,
  title,
  subtitle,
  href,
  icon: Icon,
  color = "zinc",
  variant = "card",
}: BentoTileProps) {
  const c = accentColor[color];

  const content =
    variant === "featured" ? (
      <div
        className={cn(
          "group relative h-full overflow-hidden rounded-3xl border bg-white/80 p-5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-200/60 md:p-6",
          c.border,
          className,
        )}
      >
        {/* Subtle color wash */}
        <div
          className={cn(
            "absolute inset-0 opacity-[0.03] transition-opacity duration-500 group-hover:opacity-[0.06]",
            c.glow,
          )}
        />

        <div className="relative z-10 flex h-full flex-col justify-between gap-5">
          <div className="flex items-start justify-between">
            {Icon && (
              <div className={cn("flex h-11 w-11 items-center justify-center rounded-2xl", c.icon)}>
                <Icon size={22} />
              </div>
            )}
          </div>

          <div>
            {title && <h3 className="mb-0.5 text-base font-black tracking-tight text-zinc-900">{title}</h3>}
            {subtitle && <p className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">{subtitle}</p>}
          </div>

          {children}
        </div>
      </div>
    ) : (
      <div
        className={cn(
          "group relative h-full overflow-hidden rounded-2xl border border-zinc-100 bg-white/70 p-4 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-zinc-100/80 md:p-5",
          className,
        )}
      >
        <div className="relative z-10 flex h-full flex-col justify-between gap-3">
          {Icon && (
            <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl transition-colors", c.icon)}>
              <Icon size={17} />
            </div>
          )}

          <div>
            {title && <h3 className="mb-0.5 text-sm font-black tracking-tight text-zinc-900">{title}</h3>}
            {subtitle && <p className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase">{subtitle}</p>}
          </div>

          {children}
        </div>
      </div>
    );

  if (href) {
    return (
      <Link href={href} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}
