import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";
import PackingListSkeleton from "@/features/trip/components/PackingListSkeleton";
import TransitTimelineSkeleton from "@/features/trip/components/TransitTimelineSkeleton";
import TripLayout from "@/features/trip/components/TripLayout";
import TripWeatherSummarySkeleton from "@/features/trip/components/TripWeatherSummarySkeleton";
import WeatherStatsSkeleton from "@/features/trip/components/WeatherStatsSkeleton";

export default function InfoLoading() {
  return (
    <TripLayout isLoading={true}>
      <Container className="space-y-24 pb-24">
        {/* --- Weather Summary Skeleton --- */}
        <section>
          <div className="mb-8 flex flex-col gap-2">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-4 w-64 rounded-md" />
          </div>
          <TripWeatherSummarySkeleton />
        </section>

        {/* --- Budget Section Skeleton --- */}
        <section>
          <div className="mb-8 flex flex-col gap-2">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-4 w-64 rounded-md" />
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Skeleton className="h-64 rounded-[2rem]" />
            <Skeleton className="h-64 rounded-[2rem] lg:col-span-2" />
          </div>
        </section>

        {/* --- Transit Timeline Skeleton --- */}
        <section>
          <div className="mb-8 flex flex-col gap-2">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-4 w-64 rounded-md" />
          </div>
          <TransitTimelineSkeleton />
        </section>

        {/* --- Packing Section Skeleton --- */}
        <section>
          <div className="mb-8 flex flex-col gap-2">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-4 w-64 rounded-md" />
          </div>
          <div className="mb-8">
            <Skeleton className="h-32 w-full rounded-3xl" />
          </div>
          <PackingListSkeleton />
        </section>

        {/* --- Knowledge Section Skeleton --- */}
        <section>
          <div className="mb-8 flex flex-col gap-2">
            <Skeleton className="h-8 w-48 rounded-lg" />
            <Skeleton className="h-4 w-64 rounded-md" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-40 rounded-3xl" />
            ))}
          </div>
        </section>
      </Container>
    </TripLayout>
  );
}
