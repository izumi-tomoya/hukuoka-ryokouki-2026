import { Skeleton } from "@/components/ui/Skeleton";
import { MagazineCard } from "@/components/ui/MagazineCard";

export default function EventCardSkeleton() {
  return (
    <MagazineCard className="h-full relative overflow-hidden opacity-50">
      <div className="flex justify-between items-start mb-6">
        <Skeleton className="h-7 w-24 rounded-full" />
        <Skeleton className="h-7 w-20 rounded-full" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-8 md:h-10 w-3/4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>

        <div className="aspect-[16/9] w-full mt-6 rounded-[2rem]">
          <Skeleton className="h-full w-full rounded-[2rem]" />
        </div>

        <div className="pt-8 border-t border-border mt-8 flex justify-between">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-32 rounded-full" />
        </div>
      </div>
    </MagazineCard>
  );
}
