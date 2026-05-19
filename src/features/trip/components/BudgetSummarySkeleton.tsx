import { MagazineCard } from "@/components/ui/MagazineCard";
import { Skeleton } from "@/components/ui/Skeleton";

export default function BudgetSummarySkeleton() {
  return (
    <MagazineCard
      padding="sm"
      className="dark:bg-background dark:border-border flex items-center gap-3 border-rose-100 bg-rose-50/50 md:gap-4"
    >
      <Skeleton className="h-10 w-10 shrink-0 rounded-xl md:h-12 md:w-12 md:rounded-2xl" />
      <div className="min-w-0 flex-1">
        <Skeleton className="mb-1.5 h-3 w-20" />
        <div className="flex items-baseline gap-2">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </MagazineCard>
  );
}
