import { MagazineCard } from "@/components/ui/MagazineCard";
import { Skeleton } from "@/components/ui/Skeleton";

export default function TipsSectionSkeleton() {
  return (
    <section className="mt-12 opacity-60 md:mt-16">
      <div className="mb-6 flex items-center gap-3 md:mb-8 md:gap-4">
        <Skeleton className="h-7 w-40 md:h-8 md:w-48" />
        <div className="bg-border h-px flex-1" />
      </div>

      <div className="grid gap-4 md:gap-6">
        {[1, 2].map((i) => (
          <MagazineCard key={i} padding="sm" className="relative overflow-hidden">
            <div className="absolute top-0 right-0">
              <Skeleton className="h-6 w-20 rounded-bl-xl" />
            </div>

            <div className="flex items-start gap-3 md:gap-4">
              <Skeleton className="mt-1 h-5 w-5 shrink-0 rounded-full" />
              <div className="flex-1 pr-10">
                <div className="mb-2 flex flex-col gap-2 md:flex-row md:items-center">
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
