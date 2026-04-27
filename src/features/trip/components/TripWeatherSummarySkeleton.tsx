import { Skeleton } from "@/components/ui/Skeleton";
import { MagazineCard } from "@/components/ui/MagazineCard";

export default function TripWeatherSummarySkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
      {[1, 2, 3].map((i) => (
        <MagazineCard key={i} padding="sm" className="bg-stone-50/50 border-stone-100 flex flex-col items-center text-center">
          <Skeleton className="h-3 w-16 mb-4" />
          
          <Skeleton className="h-8 w-8 rounded-full mb-4" />
          
          <Skeleton className="h-8 w-24 mb-4" />

          <div className="w-full pt-4 border-t border-stone-100 flex justify-between items-center">
            <Skeleton className="h-3 w-10" />
            <Skeleton className="h-3 w-10" />
          </div>
        </MagazineCard>
      ))}
    </div>
  );
}
