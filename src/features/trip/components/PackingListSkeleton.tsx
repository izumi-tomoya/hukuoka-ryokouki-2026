import { MagazineCard } from "@/components/ui/MagazineCard";
import { Skeleton } from "@/components/ui/Skeleton";

export default function PackingListSkeleton() {
  return (
    <div className="space-y-6 md:space-y-8">
      {/* ─── Progress Overview Skeleton ─── */}
      <MagazineCard padding="lg" className="border-primary/10 bg-linear-to-br from-primary/5 to-transparent">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="min-w-0">
            <Skeleton className="mb-2 h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex w-full flex-col items-center gap-2 md:w-auto md:items-end">
            <Skeleton className="mb-1 h-10 w-16" />
            <Skeleton className="h-2 w-full max-w-48 rounded-full" />
            <Skeleton className="mt-1 h-3 w-32" />
          </div>
        </div>
      </MagazineCard>

      {/* ─── Tabs Skeleton ─── */}
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-hidden px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-card border-border flex min-h-12 shrink-0 items-center gap-3 rounded-3xl border px-5 py-3.5 sm:px-6 sm:py-4"
          >
            <Skeleton className="h-[18px] w-[18px] rounded-full" />
            <Skeleton className="h-3 w-12" />
          </div>
        ))}
      </div>

      {/* ─── List Area Skeleton ─── */}
      <div className="grid gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="border-border bg-card flex items-center gap-3 rounded-3xl border p-4 sm:gap-4 sm:p-5"
          >
            <Skeleton className="h-9 w-9 shrink-0 rounded-xl" />
            <Skeleton className="h-4 flex-1" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}
