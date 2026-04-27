import { Skeleton } from "@/components/ui/Skeleton";
import { MagazineCard } from "@/components/ui/MagazineCard";

export default function PackingListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <MagazineCard key={i} className="flex flex-col gap-8 h-full">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-2xl shrink-0" />
            <Skeleton className="h-6 w-32" />
          </div>
          <div className="space-y-4 flex-grow">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="flex items-start gap-4">
                <Skeleton className="h-5 w-5 rounded-full shrink-0 mt-0.5" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </MagazineCard>
      ))}
    </div>
  );
}
