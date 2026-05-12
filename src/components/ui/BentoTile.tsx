import { cn } from "@/lib/utils";

interface BentoTileProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
}

export function BentoTile({ children, className, title }: BentoTileProps) {
  return (
    <div className={cn("rounded-[2.5rem] border border-zinc-100 bg-white p-8", className)}>
      {title && <h3 className="mb-6 text-[10px] font-bold tracking-[0.2em] text-zinc-400 uppercase">{title}</h3>}
      {children}
    </div>
  );
}
