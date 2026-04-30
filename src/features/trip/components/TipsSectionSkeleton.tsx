import { Skeleton } from "@/components/ui/Skeleton";
import { MagazineCard } from "@/components/ui/MagazineCard";

export default function TipsSectionSkeleton() {
  return (
    <section className="mt-12 md:mt-16 opacity-60">
      <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
        <Skeleton className="h-7 md:h-8 w-40 md:w-48" />
        <div className="h-px flex-1 bg-border" />
      </div>

      <div className="grid gap-4 md:gap-6">
        {[1, 2].map((i) => (
          <MagazineCard key={i} padding="sm" className="relative overflow-hidden">
            <div className="absolute top-0 right-0">
              <Skeleton className="h-6 w-20 rounded-bl-xl" />
            </div>

            <div className="flex items-start gap-3 md:gap-4">
              <Skeleton className="mt-1 h-5 w-5 rounded-full shrink-0" />
              <div className="flex-1 pr-10">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-5/6" />
                </div>
              </div>
            </div>
          </MagazineCard>
        ))}
      </div>
    </section>
  );
}
