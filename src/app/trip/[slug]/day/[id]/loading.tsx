import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";
import BudgetSummarySkeleton from "@/features/trip/components/BudgetSummarySkeleton";
import EventCardSkeleton from "@/features/trip/components/EventCardSkeleton";
import TipsSectionSkeleton from "@/features/trip/components/TipsSectionSkeleton";
import TransitTimelineSkeleton from "@/features/trip/components/TransitTimelineSkeleton";
import TripLayout from "@/features/trip/components/TripLayout";
import TripMapSkeleton from "@/features/trip/components/TripMapSkeleton";

export default function DayLoading() {
  return (
    <TripLayout isLoading={true}>
      <div className="relative pt-8 pb-12">
        <Container>
          <div className="flex items-center justify-between mb-8">
            <Skeleton className="h-4 w-32 rounded-full" />
            <div className="flex gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-64 w-full rounded-[2.5rem] opacity-20" />
        </Container>
      </div>

      <Container className="pb-24 space-y-16">
        {/* Weather Forecast Skeleton */}
        <Skeleton className="h-48 w-full rounded-[2.5rem] opacity-30" />

        {/* Map Skeleton */}
        <div className="space-y-6">
          <Skeleton className="h-3 w-32 rounded-full" />
          <TripMapSkeleton />
        </div>

        {/* Action Summary Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-[2.5rem] opacity-40" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <BudgetSummarySkeleton />
          <Skeleton className="h-20 w-full rounded-[2.5rem] opacity-40" />
        </div>

        {/* Timeline Skeleton */}
        <div className="space-y-12">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px grow bg-border opacity-30" />
            <Skeleton className="h-8 w-48 rounded-lg" />
            <div className="h-px grow bg-border opacity-30" />
          </div>

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
                    {/* Transit + Card Skeleton */}
                    <div className="space-y-6">
                      {i === 1 && <TransitTimelineSkeleton />}
                      <EventCardSkeleton />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Day Notes Skeleton */}
        <Skeleton className="h-40 w-full rounded-[2.5rem] opacity-30" />

        {/* Tips Skeleton */}
        <TipsSectionSkeleton />
      </Container>
    </TripLayout>
  );
}
