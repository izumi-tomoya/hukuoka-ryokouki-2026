import { Skeleton } from "@/components/ui/Skeleton";
import { Container } from "@/components/ui/Container";
import TripWeatherSummarySkeleton from "@/features/trip/components/TripWeatherSummarySkeleton";
import TripLayout from "@/features/trip/components/TripLayout";
import { MagazineCard } from "@/components/ui/MagazineCard";

export default function TripLoading() {
  return (
    <TripLayout isLoading={true}>
      <Container className="pb-24">
        <div className="grid grid-cols-1 gap-16">
          {/* Hero / Overview Card Skeleton */}
          <MagazineCard padding="lg" className="border-border shadow-xl shadow-primary/5 dark:shadow-none">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
              <div className="max-w-xl w-full">
                <Skeleton className="h-4 w-32 mb-8 rounded-full" />
                <Skeleton className="h-14 md:h-16 w-3/4 mb-6 rounded-2xl" />
                <Skeleton className="h-6 w-full mb-4" />
                <div className="flex gap-4 mt-10">
                  <Skeleton className="h-10 w-28 rounded-full" />
                  <Skeleton className="h-10 w-36 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-40 w-56 rounded-article shrink-0 opacity-20" />
            </div>
            
            <div className="mt-16 pt-12 border-t border-border">
              <div className="flex items-center gap-3 mb-8">
                <Skeleton className="h-5 w-5 rounded-full" />
                <Skeleton className="h-4 w-32" />
              </div>
              <TripWeatherSummarySkeleton />
            </div>
          </MagazineCard>

          {/* Featured Sections Skeletons */}
          <div className="space-y-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px grow bg-border" />
              <Skeleton className="h-8 w-48 rounded-full" />
              <div className="h-px grow bg-border" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <MagazineCard key={i} className="opacity-50 border-border">
                  <div className="flex justify-between items-start mb-8">
                    <Skeleton className="h-6 w-16 rounded-full" />
                    <Skeleton className="h-10 w-10 rounded-xl" />
                  </div>
                  <Skeleton className="h-8 w-3/4 mb-4 rounded-lg" />
                  <Skeleton className="h-4 w-1/2 mb-6" />
                  <div className="pt-6 border-t border-border flex justify-between">
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
