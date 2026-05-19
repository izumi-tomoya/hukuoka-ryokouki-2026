import { Container } from "@/components/ui/Container";
import { MagazineCard } from "@/components/ui/MagazineCard";
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
          <MagazineCard padding="lg" className="border-primary/20 from-primary/8 bg-linear-to-br to-transparent">
            <div className="mb-8">
              <Skeleton className="mb-4 h-7 w-32 rounded-full" />
              <Skeleton className="mb-2 h-10 w-64" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="border-border bg-background/70 flex flex-col rounded-[1.75rem] border p-5"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-11 w-11 rounded-2xl" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                    </div>
                    <Skeleton className="h-10 w-10 rounded-2xl" />
                  </div>
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="mt-1 h-3 w-5/6" />
                </div>
              ))}
            </div>
          </MagazineCard>
        </div>

        <div className="mb-16">
          <Skeleton className="mb-8 h-8 w-48 rounded-lg" />
          <PackingListSkeleton />
        </div>
      </Container>
    </TripLayout>
  );
}
