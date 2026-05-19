import { MagazineCard } from "@/components/ui/MagazineCard";
import { Skeleton } from "@/components/ui/Skeleton";

export default function TripWeatherSummarySkeleton() {
  return (
    <div className="relative mt-8">
      <div className="no-scrollbar flex gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
          <MagazineCard
            key={i}
            padding="sm"
            className="border-border/50 bg-secondary/15 dark:border-border dark:bg-background flex min-w-37.5 flex-col items-center sm:min-w-0"
          >
            <Skeleton className="mb-4 h-3 w-16 rounded-full" />
            <Skeleton className="mb-4 h-8 w-8 rounded-xl" />
            <div className="mb-1 flex items-baseline gap-1">
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-4 w-6" />
            </div>
            <Skeleton className="mb-4 h-3 w-12" />
            <div className="border-border/50 dark:border-border w-full space-y-2 border-t pt-4">
              <div className="flex justify-between">
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-3 w-8" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-3 w-12" />
                <Skeleton className="h-3 w-8" />
              </div>
            </div>
          </MagazineCard>
        ))}
      </div>
    </div>
  );
}
