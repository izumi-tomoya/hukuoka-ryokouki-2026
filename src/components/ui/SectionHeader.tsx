import { cn } from "@/lib/utils";

export const SectionHeader = ({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) => (
  <div className={cn("mb-8 min-w-0 text-center md:mb-12 md:text-left", className)}>
    <h2 className="font-playfair text-foreground text-3xl leading-tight font-extrabold tracking-tight break-words transition-colors sm:text-4xl md:text-5xl">
      {title}
    </h2>
    {subtitle && (
      <p className="text-muted-foreground mt-3 text-[10px] leading-relaxed font-bold tracking-[0.14em] break-words uppercase sm:tracking-[0.2em] md:text-xs">
        {subtitle}
      </p>
    )}
  </div>
);
