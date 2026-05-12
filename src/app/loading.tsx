import { Skeleton } from "@/components/ui/Skeleton";

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500">
      {/* ─── Hero Skeleton ─── */}
      <header className="relative overflow-hidden px-6 pt-24 md:pt-28 pb-16 md:pb-20 bg-linear-to-br from-white via-stone-50 to-white dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 border-b border-border">
        <div className="absolute -top-32 -left-32 h-150 w-150 rounded-full bg-rose-500/5 dark:bg-rose-500/10 blur-[160px]" />
        <div className="absolute -bottom-20 right-0 h-100 w-100 rounded-full bg-primary/5 dark:bg-primary/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl flex flex-col items-center text-center">
          <Skeleton className="h-8 w-40 rounded-full mb-8 md:mb-10 opacity-30" />
          <Skeleton className="h-16 md:h-24 w-64 md:w-96 mb-8 rounded-2xl opacity-40" />
          <Skeleton className="h-4 w-64 md:w-80 opacity-20" />
        </div>
      </header>

      {/* ─── Grid Skeleton ─── */}
      <main className="mx-auto max-w-7xl px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="relative h-80 overflow-hidden rounded-[32px] md:rounded-[40px] bg-card p-8 md:p-10 border border-border"
            >
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <Skeleton className="h-3 w-12 opacity-30" />
                  <div className="h-px flex-1 bg-border" />
                </div>
                <Skeleton className="h-10 w-3/4 mb-4 rounded-xl opacity-40" />
                <Skeleton className="h-4 w-1/2 opacity-20" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-20 opacity-20" />
                <Skeleton className="h-8 w-8 rounded-full opacity-30" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
