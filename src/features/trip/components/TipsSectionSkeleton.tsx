import { Skeleton } from "@/components/ui/Skeleton";
import { MagazineCard } from "@/components/ui/MagazineCard";

export default function TipsSectionSkeleton() {
  return (
    <section className="mt-16">
      <div className="flex items-center gap-4 mb-8">
        <Skeleton className="h-8 w-64" />
        <div className="h-px flex-1 bg-stone-100" />
      </div>

      <div className="grid gap-6">
        {[1, 2, 3].map((i) => (
          <MagazineCard key={i} padding="sm" className="relative overflow-hidden">
            <div className="absolute top-0 right-0">
              <Skeleton className="h-6 w-20 rounded-bl-xl" />
            </div>

            <div className="flex items-start gap-4">
              <Skeleton className="mt-1 h-5 w-5 rounded-full shrink-0" />
              <div className="flex-1 pr-12">
                <div className="flex items-center gap-3 mb-2">
                  <Skeleton className="h-4 w-3/4" />
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
