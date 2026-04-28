import { Skeleton } from "@/components/ui/Skeleton";
import { Container } from "@/components/ui/Container";
import TripWeatherSummarySkeleton from "@/features/trip/components/TripWeatherSummarySkeleton";
import PackingListSkeleton from "@/features/trip/components/PackingListSkeleton";
import TripLayout from "@/features/trip/components/TripLayout";

export default function InfoLoading() {
  return (
    <TripLayout isLoading={true}>
      <Container className="pb-24">
        <div className="mb-16">
          <Skeleton className="h-8 w-48 mb-8 rounded-lg" />
          <TripWeatherSummarySkeleton />
        </div>

        <div className="mb-16">
          <Skeleton className="h-8 w-48 mb-8 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="bg-white rounded-[2rem] p-6 border border-stone-100 flex gap-4">
                <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />
                <div className="grow space-y-3">
                  <Skeleton className="h-5 w-3/4 rounded-md" />
                  <Skeleton className="h-4 w-full rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16">
          <Skeleton className="h-8 w-48 mb-8 rounded-lg" />
          <PackingListSkeleton />
        </div>
      </Container>
    </TripLayout>
  );
}
