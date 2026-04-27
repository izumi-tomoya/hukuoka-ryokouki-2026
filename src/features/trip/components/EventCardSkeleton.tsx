import { Skeleton } from "@/components/ui/Skeleton";
import { MagazineCard } from "@/components/ui/MagazineCard";

export default function EventCardSkeleton() {
  return (
    <MagazineCard className="h-full border-rose-100/50">
      <div className="flex justify-between items-start mb-6">
        {/* TagBadge の場所 */}
        <Skeleton className="h-6 w-24 rounded-full" />
        {/* ConfirmCheckbox の場所 */}
        <Skeleton className="h-5 w-5 rounded" />
      </div>

      {/* タイトル */}
      <Skeleton className="h-8 w-3/4 mb-3" />
      <Skeleton className="h-8 w-1/2 mb-3" />

      {/* 説明 */}
      <div className="space-y-2 mb-6">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>

      {/* Google Map リンクの場所 */}
      <Skeleton className="h-4 w-24" />

      {/* AccessRow の場所 */}
      <div className="mt-6 border-t border-stone-100 pt-6 flex gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
    </MagazineCard>
  );
}
