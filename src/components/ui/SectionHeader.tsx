import { cn } from "@/lib/utils";

export const SectionHeader = ({ title, subtitle, className }: { title: string; subtitle?: string; className?: string }) => (
  <div className={cn("mb-8 md:mb-12 text-center md:text-left min-w-0", className)}>
    <h2 className="break-words font-playfair text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight transition-colors">{title}</h2>
    {subtitle && (
      <p className="mt-3 break-words text-muted-foreground text-[10px] md:text-xs font-bold tracking-[0.14em] sm:tracking-[0.2em] uppercase leading-relaxed">
        {subtitle}
      </p>
    )}
  </div>
);
