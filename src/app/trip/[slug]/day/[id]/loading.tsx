import { Skeleton } from "@/components/ui/Skeleton";
import EventCardSkeleton from "@/features/trip/components/EventCardSkeleton";
import BudgetSummarySkeleton from "@/features/trip/components/BudgetSummarySkeleton";
import TripMapSkeleton from "@/features/trip/components/TripMapSkeleton";
import TipsSectionSkeleton from "@/features/trip/components/TipsSectionSkeleton";
import TripLayout from "@/features/trip/components/TripLayout";

export default function DayLoading() {
  return (
    <TripLayout isLoading={true}>
      <div className="space-y-12">
        {/* Map Skeleton */}
        <TripMapSkeleton />

        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
          <div className="grow max-w-sm">
            <BudgetSummarySkeleton />
          </div>
          <Skeleton className="h-20 w-full md:w-64 rounded-[2.5rem] opacity-40" />
        </div>

        {/* CategoryFilter Skeleton */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-11 w-24 rounded-full" />
          ))}
        </div>

        {/* Timeline Skeleton */}
        <div className="relative bg-transparent px-0 md:px-3 pb-20 pt-8 rounded-[3rem]">
          <div className="absolute left-[7px] md:left-[23px] top-0 h-full w-[2px] bg-border opacity-50" />
          <div className="relative space-y-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative flex gap-2 md:gap-4">
                <div className="relative flex w-4 md:w-6 shrink-0 flex-col items-center pt-4">
                  <div className="z-10 h-3 w-3 rounded-full bg-border border-2 border-background shadow-lg" />
                </div>
                <div className="min-w-0 flex-1 pb-2">
                  <div className="mb-4">
                    <Skeleton className="h-4 w-20 rounded-full" />
                  </div>
                  <EventCardSkeleton />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips Skeleton */}
        <TipsSectionSkeleton />
      </div>
    </TripLayout>
  );
}
