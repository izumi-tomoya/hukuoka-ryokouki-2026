import { MagazineCard } from "@/components/ui/MagazineCard";
import { Skeleton } from "@/components/ui/Skeleton";

export default function EventCardSkeleton() {
  return (
    <MagazineCard className="relative h-full overflow-hidden opacity-60">
      <div className="mb-4 flex items-start justify-between md:mb-6">
        <Skeleton className="h-7 w-24 rounded-full" />
        <Skeleton className="h-7 w-12 rounded-full" />
      </div>

      <div className="space-y-3">
        <Skeleton className="h-7 w-3/4 md:h-8" />
        <div className="mb-6 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        {/* Photo Gallery Placeholder */}
        <div className="mt-6 grid grid-cols-2 gap-2">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <Skeleton className="aspect-square w-full rounded-2xl" />
        </div>

        <div className="border-border mt-8 flex items-center justify-between border-t pt-6">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 w-32 rounded-full" />
        </div>
      </div>
    </MagazineCard>
  );
}
