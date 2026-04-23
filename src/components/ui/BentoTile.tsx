import { cn } from "@/lib/utils";

interface BentoTileProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function BentoTile({ children, className, title }: BentoTileProps) {
  return (
    <div className={cn("rounded-[2.5rem] bg-white border border-zinc-100 p-8", className)}>
      {title && <h3 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-6">{title}</h3>}
      {children}
    </div>
  );
}
