import { Skeleton } from "@/components/ui/Skeleton";
import EventCardSkeleton from "@/components/trip/EventCardSkeleton";

export default function DayLoading() {
  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <header className="px-6 pt-16 pb-8 mx-auto max-w-5xl">
        <div className="mb-10 text-center md:text-left">
          {/* Title Skeleton */}
          <Skeleton className="h-14 w-3/4 md:w-1/2 mb-4 mx-auto md:mx-0" />
          {/* Subtitle Skeleton */}
          <Skeleton className="h-4 w-1/2 md:w-1/3 mx-auto md:mx-0" />
        </div>

        {/* CategoryTabs Skeleton */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          <Skeleton className="h-12 w-28 rounded-full" />
          <Skeleton className="h-12 w-28 rounded-full" />
          <Skeleton className="h-12 w-28 rounded-full" />
          <Skeleton className="h-12 w-28 rounded-full" />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6">
        <div className="space-y-12">
          {/* BudgetSummary Skeleton */}
          <div className="max-w-xs">
            <Skeleton className="h-16 w-full rounded-2xl" />
          </div>

          {/* CategoryFilter Skeleton */}
          <div className="flex flex-wrap gap-2 mb-8">
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
          </div>

          {/* Timeline Skeleton */}
          <div className="relative bg-stone-50 px-3 pb-20 pt-8">
            {/* Vertical connecting line */}
            <div className="absolute left-[19px] top-0 h-full w-px bg-stone-100" />

            <div className="relative space-y-10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="relative flex gap-2 md:gap-4">
                  {/* Left column: dot */}
                  <div className="relative flex w-6 shrink-0 flex-col items-center pt-3">
                    <div className="z-10 h-3 w-3 rounded-full border-2 border-white shadow-sm ring-2 ring-stone-50 bg-stone-200" />
                  </div>

                  {/* Right column: time + card */}
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
        </div>
      </main>
    </div>
  );
}
