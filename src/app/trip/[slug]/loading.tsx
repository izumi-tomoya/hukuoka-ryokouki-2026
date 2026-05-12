import { Container } from "@/components/ui/Container";
import { MagazineCard } from "@/components/ui/MagazineCard";
import { Skeleton } from "@/components/ui/Skeleton";
import TripLayout from "@/features/trip/components/TripLayout";
import TripWeatherSummarySkeleton from "@/features/trip/components/TripWeatherSummarySkeleton";

export default function TripLoading() {
  return (
    <TripLayout isLoading={true}>
      <Container className="pb-24">
        <div className="grid grid-cols-1 gap-16">
          {/* Hero / Overview Card Skeleton */}
          <MagazineCard padding="lg" className="border-border shadow-primary/5 shadow-xl dark:shadow-none">
            <div className="flex flex-col justify-between gap-12 lg:flex-row lg:items-center">
              <div className="w-full max-w-xl">
                <Skeleton className="mb-8 h-4 w-32 rounded-full" />
                <Skeleton className="mb-6 h-14 w-3/4 rounded-2xl md:h-16" />
                <Skeleton className="mb-4 h-6 w-full" />
                <div className="mt-10 flex gap-4">
                  <Skeleton className="h-10 w-28 rounded-full" />
                  <Skeleton className="h-10 w-36 rounded-full" />
                </div>
              </div>
              <Skeleton className="rounded-article h-40 w-56 shrink-0 opacity-20" />
            </div>

            <div className="border-border mt-16 border-t pt-12">
              <div className="mb-8 flex items-center gap-3">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <TripWeatherSummarySkeleton />
            </div>
          </MagazineCard>

          {/* Featured Sections Skeletons */}
          <div className="space-y-12">
            <div className="mb-8 flex items-center gap-4">
              <div className="bg-border h-px grow" />
              <Skeleton className="h-8 w-48 rounded-full" />
              <div className="bg-border h-px grow" />
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <MagazineCard key={i} className="border-border opacity-50">
                  <div className="mb-8 flex items-start justify-between">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-10 w-10 rounded-xl" />
                  </div>
                  <Skeleton className="mb-4 h-8 w-3/4 rounded-lg" />
                  <Skeleton className="mb-6 h-4 w-1/2" />
                  <div className="border-border flex justify-between border-t pt-6">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-12 rounded-full" />
                  </div>
                </MagazineCard>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </TripLayout>
  );
}
