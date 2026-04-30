import { Skeleton } from "@/components/ui/Skeleton";
import { MagazineCard } from "@/components/ui/MagazineCard";

export default function BudgetSummarySkeleton() {
  return (
    <MagazineCard 
      padding="sm" 
      className="flex items-center gap-3 md:gap-4 bg-rose-50/50 dark:bg-zinc-900 border-rose-100 dark:border-zinc-800 opacity-60"
    >
      <Skeleton className="h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl shrink-0" />
      <div className="flex-1 min-w-0">
        <Skeleton className="h-3 w-20 mb-1.5" />
        <div className="flex items-baseline gap-2">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </MagazineCard>
  );
}
