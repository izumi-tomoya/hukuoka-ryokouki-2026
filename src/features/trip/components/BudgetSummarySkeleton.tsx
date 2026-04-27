import { Skeleton } from "@/components/ui/Skeleton";
import { MagazineCard } from "@/components/ui/MagazineCard";

export default function BudgetSummarySkeleton() {
  return (
    <MagazineCard padding="sm" className="flex items-center gap-4 bg-rose-50/50 border-rose-100">
      <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />
      <div className="flex-1">
        <Skeleton className="h-3 w-24 mb-2" />
        <div className="flex items-baseline gap-2">
          <Skeleton className="h-6 w-32" />
        </div>
      </div>
    </MagazineCard>
  );
}
