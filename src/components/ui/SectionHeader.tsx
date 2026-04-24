import { cn } from "@/lib/utils";

export const SectionHeader = ({ title, subtitle, className }: { title: string; subtitle?: string; className?: string }) => (
  <div className={cn("mb-12 text-center md:text-left", className)}>
    <h2 className="font-playfair text-3xl md:text-4xl font-bold text-stone-900 tracking-tight">{title}</h2>
    {subtitle && <p className="mt-3 text-[10px] font-black uppercase tracking-[0.2em] text-rose-400">{subtitle}</p>}
  </div>
);
