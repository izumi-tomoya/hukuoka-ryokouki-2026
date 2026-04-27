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

        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="max-w-xs w-full">
            <BudgetSummarySkeleton />
          </div>
          <Skeleton className="h-20 w-full md:w-64 rounded-[2.5rem]" />
        </div>

        {/* CategoryFilter Skeleton */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-10 w-24 rounded-full" />
          ))}
        </div>

        {/* Timeline Skeleton */}
        <div className="relative bg-stone-50/50 px-3 pb-20 pt-8 rounded-[3rem]">
          <div className="absolute left-[19px] top-0 h-full w-px bg-stone-100" />
          <div className="relative space-y-10">
            {[1, 2, 3].map((i) => (
              <div key={i} className="relative flex gap-4">
                <div className="relative flex w-6 shrink-0 flex-col items-center pt-3">
                  <div className="z-10 h-3 w-3 rounded-full bg-stone-200 border-2 border-white shadow-sm" />
                </div>
                <div className="min-w-0 flex-1 pb-2">
                  <div className="mb-4">
                    <Skeleton className="h-4 w-16 rounded-full" />
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
