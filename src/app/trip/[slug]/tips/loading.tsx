import { Skeleton } from "@/components/ui/Skeleton";
import TipsSectionSkeleton from "@/features/trip/components/TipsSectionSkeleton";

export default function TipsLoading() {
  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <header className="px-6 pt-16 pb-8 mx-auto max-w-5xl">
        {/* CategoryTabs Skeleton */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          <Skeleton className="h-12 w-28 rounded-full" />
          <Skeleton className="h-12 w-28 rounded-full" />
          <Skeleton className="h-12 w-28 rounded-full" />
          <Skeleton className="h-12 w-28 rounded-full" />
        </div>
        
        <div className="mt-12 text-center md:text-left">
          <Skeleton className="h-14 w-3/4 md:w-1/2 mb-4 mx-auto md:mx-0" />
          <Skeleton className="h-4 w-1/2 md:w-1/3 mx-auto md:mx-0" />
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6">
        <TipsSectionSkeleton />
      </main>
    </div>
  );
}
