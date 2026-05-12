import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";
import PackingListSkeleton from "@/features/trip/components/PackingListSkeleton";
import TripLayout from "@/features/trip/components/TripLayout";
import TripWeatherSummarySkeleton from "@/features/trip/components/TripWeatherSummarySkeleton";

export default function InfoLoading() {
  return (
    <TripLayout isLoading={true}>
      <Container className="pb-24">
        <div className="mb-16">
          <Skeleton className="mb-8 h-8 w-48 rounded-lg" />
          <TripWeatherSummarySkeleton />
        </div>

        <div className="mb-16">
          <Skeleton className="mb-8 h-8 w-48 rounded-lg" />
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4 rounded-[2rem] border border-stone-100 bg-white p-6">
                <Skeleton className="h-12 w-12 shrink-0 rounded-2xl" />
                <div className="grow space-y-3">
                  <Skeleton className="h-5 w-3/4 rounded-md" />
                  <Skeleton className="h-4 w-full rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <Skeleton className="mb-8 h-8 w-48 rounded-lg" />
          <PackingListSkeleton />
        </div>
      </Container>
    </TripLayout>
  );
}
