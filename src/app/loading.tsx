import { Skeleton } from "@/components/ui/Skeleton";

export default function RootLoading() {
  return (
    <div className="bg-background text-foreground min-h-screen transition-colors duration-500">
      {/* ─── Hero Skeleton ─── */}
      <header className="border-border relative overflow-hidden border-b bg-linear-to-br from-white via-stone-50 to-white px-6 pt-24 pb-16 md:pt-28 md:pb-20 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
        <div className="absolute -top-32 -left-32 h-150 w-150 rounded-full bg-rose-500/5 blur-[160px] dark:bg-rose-500/10" />
        <div className="bg-primary/5 dark:bg-primary/10 absolute right-0 -bottom-20 h-100 w-100 rounded-full blur-[120px]" />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center text-center">
          <Skeleton className="mb-8 h-8 w-40 rounded-full opacity-30 md:mb-10" />
          <Skeleton className="mb-8 h-16 w-64 rounded-2xl opacity-40 md:h-24 md:w-96" />
          <Skeleton className="h-4 w-64 opacity-20 md:w-80" />
        </div>
      </header>

      {/* ─── Grid Skeleton ─── */}
      <main className="mx-auto max-w-7xl px-6 py-12 md:py-20">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-10 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card border-border relative h-80 overflow-hidden rounded-[32px] border p-8 md:rounded-[40px] md:p-10"
            >
              <div className="mb-10">
                <div className="mb-4 flex items-center gap-3">
                  <Skeleton className="h-3 w-12 opacity-30" />
                  <div className="bg-border h-px flex-1" />
                </div>
                <Skeleton className="mb-4 h-10 w-3/4 rounded-xl opacity-40" />
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
