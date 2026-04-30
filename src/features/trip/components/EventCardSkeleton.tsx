import { Skeleton } from "@/components/ui/Skeleton";
import { MagazineCard } from "@/components/ui/MagazineCard";

export default function EventCardSkeleton() {
  return (
    <MagazineCard className="h-full relative overflow-hidden opacity-60">
      <div className="flex justify-between items-start mb-4 md:mb-6">
        <Skeleton className="h-7 w-24 rounded-full" />
        <Skeleton className="h-7 w-12 rounded-full" />
      </div>

      <div className="space-y-3">
        <Skeleton className="h-7 md:h-8 w-3/4" />
        <div className="space-y-2 mb-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Photo Gallery Placeholder */}
        <div className="grid grid-cols-2 gap-2 mt-6">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <Skeleton className="aspect-square w-full rounded-2xl" />
        </div>

        <div className="mt-8 pt-6 border-t border-border flex justify-between items-center">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-32 rounded-full" />
        </div>
      </div>
    </MagazineCard>
  );
}
