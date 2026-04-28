import { Skeleton } from "@/components/ui/Skeleton";
import { MagazineCard } from "@/components/ui/MagazineCard";

export default function BudgetSummarySkeleton() {
  return (
    <MagazineCard padding="sm" className="flex items-center gap-4 bg-secondary/50 opacity-50">
      <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-20" />
        <div className="flex items-baseline gap-2">
          <Skeleton className="h-6 w-28" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </MagazineCard>
  );
}
