import { Skeleton } from "@/components/ui/Skeleton";
import { Container } from "@/components/ui/Container";
import TripWeatherSummarySkeleton from "@/features/trip/components/TripWeatherSummarySkeleton";
import AIAdvisorSkeleton from "@/features/trip/components/AIAdvisorSkeleton";
import TripLayout from "@/features/trip/components/TripLayout";

export default function TripLoading() {
  return (
    <TripLayout isLoading={true}>
      <Container className="pb-24">
        <div className="grid grid-cols-1 gap-12">
          {/* Countdown / Weather Card Skeleton */}
          <div className="overflow-hidden rounded-[3.5rem] bg-white border border-rose-100 p-8 md:p-16 shadow-xl shadow-rose-100/20">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 mb-8">
              <div className="max-w-xl w-full">
                <Skeleton className="h-4 w-32 mb-6" />
                <Skeleton className="h-12 w-full mb-6" />
                <div className="flex gap-4 mt-8">
                  <Skeleton className="h-8 w-24 rounded-full" />
                  <Skeleton className="h-8 w-32 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-32 w-48 rounded-[2.5rem] shrink-0" />
            </div>
            <div className="mt-16 pt-12 border-t border-rose-50">
              <TripWeatherSummarySkeleton />
            </div>
          </div>

          {/* AI Advisor Skeleton */}
          <AIAdvisorSkeleton />

          {/* Daily Plans Skeletons */}
          <div>
            <div className="flex flex-col gap-2 mb-10">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2].map((i) => (
                <div key={i} className="rounded-[3rem] border border-rose-100 bg-white p-8 md:p-10 shadow-sm">
                  <div className="flex justify-between items-start mb-12">
                    <div className="flex flex-col gap-2">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-1 w-8 rounded-full" />
                    </div>
                    <Skeleton className="h-12 w-12 rounded-2xl" />
                  </div>
                  <Skeleton className="h-10 w-3/4 mb-4" />
                  <Skeleton className="h-4 w-1/2 mb-6" />
                  <div className="pt-6 border-t border-stone-50 flex justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </TripLayout>
  );
}
