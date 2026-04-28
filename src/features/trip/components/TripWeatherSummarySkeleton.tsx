import { Skeleton } from "@/components/ui/Skeleton";
import { MagazineCard } from "@/components/ui/MagazineCard";

export default function TripWeatherSummarySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      {[1, 2, 3].map((i) => (
        <MagazineCard key={i} padding="sm" className="bg-secondary/30 border-border flex flex-col items-center opacity-50">
          <Skeleton className="h-3 w-16 mb-6 rounded-full" />
          <Skeleton className="h-10 w-10 mb-6 rounded-xl" />
          <div className="flex items-baseline gap-1 mb-6">
            <Skeleton className="h-8 w-12" />
            <Skeleton className="h-4 w-6" />
          </div>
          <div className="w-full pt-4 border-t border-border flex justify-between gap-4">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-3 w-10" />
          </div>
        </MagazineCard>
      ))}
    </div>
  );
}
