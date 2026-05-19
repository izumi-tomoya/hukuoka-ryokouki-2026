import { MagazineCard } from "@/components/ui/MagazineCard";
import { Skeleton } from "@/components/ui/Skeleton";

export default function EventCardSkeleton() {
  return (
    <MagazineCard className="relative h-full overflow-hidden">
      <div className="relative z-10 mb-4 flex items-start justify-between md:mb-6">
        <Skeleton className="h-7 w-28 rounded-full" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
        </div>
      </div>

      <div className="relative z-10">
        <div className="items-start md:grid md:grid-cols-[1fr_auto] md:gap-8">
          <div className="min-w-0">
            <Skeleton className="mb-3 h-8 w-3/4 md:h-10" />
            <div className="mb-6 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
          <div className="hidden md:block">
            <Skeleton className="h-12 w-12 rounded-full" />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <div className="flex flex-col justify-center space-y-3 rounded-[2rem] border border-amber-100 bg-amber-50/50 p-4 md:p-6">
            <Skeleton className="h-2 w-16" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        <div className="border-border mt-8 flex flex-wrap items-center justify-between gap-4 border-t pt-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        </div>
      </div>
    </MagazineCard>
  );
}
