import { Skeleton } from "@/components/ui/Skeleton";

export default function RootLoading() {
  return (
    <div className="min-h-screen bg-[#FFFCF9]">
      {/* ─── Hero Skeleton ─── */}
      <header
        className="relative overflow-hidden px-6 pt-28 pb-20"
        style={{ background: 'linear-gradient(160deg, #FFF5F7 0%, #FFE8F0 45%, #F5E8FF 100%)' }}
      >
        <div className="relative mx-auto max-w-7xl flex flex-col items-center text-center">
          <Skeleton className="h-6 w-32 rounded-full mb-10" />
          <Skeleton className="h-24 w-64 md:w-96 mb-8" />
          <Skeleton className="h-4 w-64 md:w-80" />
        </div>
      </header>

      {/* ─── Grid Skeleton ─── */}
      <main className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="relative h-80 overflow-hidden rounded-[40px] bg-white p-10 ring-1 ring-rose-100/50">
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-4">
                  <Skeleton className="h-3 w-12" />
                  <div className="h-px flex-1 bg-rose-50" />
                </div>
                <Skeleton className="h-10 w-3/4 mb-4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
