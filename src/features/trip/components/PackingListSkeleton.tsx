import { MagazineCard } from "@/components/ui/MagazineCard";
import { Skeleton } from "@/components/ui/Skeleton";

export default function PackingListSkeleton() {
  return (
    <div className="space-y-8 opacity-60">
      {/* ─── Progress Overview Skeleton ─── */}
      <MagazineCard padding="lg" className="bg-secondary/15 dark:bg-background border-border/50 dark:border-border">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex flex-col items-center gap-2 md:items-end">
            <Skeleton className="mb-1 h-10 w-16" />
            <Skeleton className="h-2 w-48 rounded-full" />
            <Skeleton className="mt-1 h-3 w-32" />
          </div>
        </div>
      </MagazineCard>

      {/* ─── Tabs Skeleton ─── */}
      <div className="no-scrollbar flex flex-wrap gap-2 overflow-x-auto pb-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border-border bg-card flex items-center gap-3 rounded-3xl border px-6 py-4">
            <Skeleton className="h-[18px] w-[18px] rounded-full" />
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>

      {/* ─── List Area Skeleton ─── */}
      <div className="grid gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="border-border bg-card flex items-center gap-4 rounded-[2rem] border p-5">
            <Skeleton className="h-7 w-7 shrink-0 rounded-xl" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-4 rounded-md opacity-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
