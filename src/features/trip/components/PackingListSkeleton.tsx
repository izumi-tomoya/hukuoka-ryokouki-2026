import { Skeleton } from "@/components/ui/Skeleton";
import { MagazineCard } from "@/components/ui/MagazineCard";

export default function PackingListSkeleton() {
  return (
    <div className="space-y-8 opacity-60">
      {/* ─── Progress Overview Skeleton ─── */}
      <MagazineCard padding="lg" className="bg-stone-50/50 dark:bg-zinc-900 border-stone-100 dark:border-zinc-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex flex-col items-center md:items-end gap-2">
            <Skeleton className="h-10 w-16 mb-1" />
            <Skeleton className="h-2 w-48 rounded-full" />
            <Skeleton className="h-3 w-32 mt-1" />
          </div>
        </div>
      </MagazineCard>

      {/* ─── Tabs Skeleton ─── */}
      <div className="flex flex-wrap gap-2 overflow-x-auto no-scrollbar pb-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center gap-3 px-6 py-4 rounded-3xl border border-border bg-card">
            <Skeleton className="h-[18px] w-[18px] rounded-full" />
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>

      {/* ─── List Area Skeleton ─── */}
      <div className="grid gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4 p-5 rounded-[2rem] border border-border bg-card">
            <Skeleton className="h-7 w-7 rounded-xl shrink-0" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-4 w-4 rounded-md opacity-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
