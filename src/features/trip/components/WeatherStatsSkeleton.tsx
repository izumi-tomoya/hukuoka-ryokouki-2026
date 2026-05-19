import { Skeleton } from "@/components/ui/Skeleton";

export default function WeatherStatsSkeleton() {
  return (
    <div className="mt-5 rounded-[2rem] bg-linear-to-br from-rose-50 to-pink-50 p-6 shadow-inner ring-1 ring-rose-100">
      <div className="mb-4 flex items-center gap-3 text-xs font-bold tracking-[0.2em] text-rose-400 uppercase">
        <div className="h-1 w-8 rounded-full bg-rose-300" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center rounded-3xl border border-white bg-white/80 p-4 shadow-sm"
          >
            <Skeleton className="mb-2 h-[18px] w-[18px] rounded-full" />
            <Skeleton className="mb-2 h-5 w-12" />
            <Skeleton className="h-2 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}
