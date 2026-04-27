import { Skeleton } from "@/components/ui/Skeleton";

export default function WeatherStatsSkeleton() {
  return (
    <div className="mt-5 rounded-[2rem] bg-rose-50/50 p-6 ring-1 ring-rose-100">
      <div className="mb-4 flex items-center gap-3">
        <div className="h-1 w-8 bg-rose-200 rounded-full" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col items-center justify-center rounded-[1.5rem] bg-white/80 p-4 border border-white shadow-sm"
          >
            <Skeleton className="h-[18px] w-[18px] mb-2 rounded-full" />
            <Skeleton className="h-5 w-12 mb-2" />
            <Skeleton className="h-2 w-8" />
          </div>
        ))}
      </div>
    </div>
  );
}
