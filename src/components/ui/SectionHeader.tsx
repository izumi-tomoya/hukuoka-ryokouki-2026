import { cn } from "@/lib/utils";

export const SectionHeader = ({ title, subtitle, className }: { title: string; subtitle?: string; className?: string }) => (
  <div className={cn("mb-8 md:mb-12 text-center md:text-left min-w-0", className)}>
    <h2 className="break-words font-playfair text-3xl md:text-4xl font-bold text-stone-900 dark:text-zinc-100 tracking-tight transition-colors">{title}</h2>
    {subtitle && <p className="mt-3 break-words text-[10px] font-black uppercase tracking-[0.14em] sm:tracking-[0.2em] text-rose-400 dark:text-rose-500 leading-relaxed">{subtitle}</p>}
  </div>
);
