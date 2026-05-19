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
}

const colorStyles = {
  rose: "bg-rose-50 text-rose-500 border-rose-100 group-hover:bg-rose-500 group-hover:text-white",
  sky: "bg-sky-50 text-sky-500 border-sky-100 group-hover:bg-sky-500 group-hover:text-white",
  zinc: "bg-zinc-50 text-zinc-500 border-zinc-100 group-hover:bg-zinc-900 group-hover:text-white",
  emerald: "bg-emerald-50 text-emerald-500 border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white",
  amber: "bg-amber-50 text-amber-500 border-amber-100 group-hover:bg-amber-500 group-hover:text-white",
  indigo: "bg-indigo-50 text-indigo-500 border-indigo-100 group-hover:bg-indigo-500 group-hover:text-white",
};

export function BentoTile({ children, className, title, subtitle, href, icon: Icon, color = "zinc" }: BentoTileProps) {
  const content = (
    <div
      className={cn(
        "group h-full relative rounded-[2.5rem] border border-zinc-100 bg-white p-6 md:p-8 transition-all duration-500 hover:shadow-2xl hover:shadow-zinc-200/50 hover:-translate-y-1",
        className,
      )}
    >
      <div className="flex flex-col h-full justify-between gap-6">
        <div>
          {Icon && (
            <div
              className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 mb-6",
                colorStyles[color],
              )}
            >
              <Icon size={24} />
            </div>
          )}

          {title && <h3 className="text-lg font-black tracking-tight text-zinc-900 mb-1">{title}</h3>}

          {subtitle && <p className="text-[11px] font-bold tracking-widest text-zinc-400 uppercase">{subtitle}</p>}
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
