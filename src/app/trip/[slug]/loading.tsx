import { Skeleton } from "@/components/ui/Skeleton";
import { Container } from "@/components/ui/Container";

export default function TripLoading() {
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
        <Container className="pb-24">
          <div className="grid grid-cols-1 gap-8 lg:gap-10">
            {/* Countdown / Weather Card Skeleton */}
            <div className="overflow-hidden rounded-[3rem] bg-white border border-rose-100 p-8 md:p-12 shadow-sm">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
                <div className="w-full md:w-1/2">
                  <Skeleton className="h-4 w-32 mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-20 w-64 rounded-2xl shrink-0" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                <Skeleton className="h-32 rounded-[2rem]" />
                <Skeleton className="h-32 rounded-[2rem]" />
                <Skeleton className="h-32 rounded-[2rem]" />
              </div>
            </div>

            {/* SectionHeader Skeleton */}
            <Skeleton className="h-8 w-48 mb-8" />

            {/* Daily Plans Skeletons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="rounded-[2.5rem] border border-rose-100 bg-white p-10 shadow-sm">
                  <div className="flex justify-between items-start mb-12">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-14 w-14 rounded-3xl" />
                  </div>
                  <Skeleton className="h-10 w-3/4 mb-4" />
                  <div className="pt-6 border-t border-stone-50 flex justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
