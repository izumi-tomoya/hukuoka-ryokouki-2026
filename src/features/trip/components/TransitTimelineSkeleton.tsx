import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

export default function TransitTimelineSkeleton() {
  return (
    <div className="mt-6 space-y-0">
      {[1, 2, 3].map((i) => {
        const isLast = i === 3;
        return (
          <div key={i} className="relative flex gap-4">
            {/* Left: Time and Line Skeleton */}
            <div className="flex w-12 shrink-0 flex-col items-center">
              <Skeleton className="mb-1 h-3 w-8" />

              <div className="relative flex flex-1 flex-col items-center">
                {/* Dot */}
                <div className="border-background bg-border z-10 h-3 w-3 rounded-full border-2" />

                {/* Line */}
                {!isLast && <div className="bg-border/30 -mt-1 -mb-1 w-1 flex-1" />}
              </div>
            </div>

            {/* Right: Content Skeleton */}
            <div className={cn("min-w-0 flex-1 pb-6", isLast && "pb-0")}>
              <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-12 rounded" />
              </div>

              {/* Transit Detail Box Skeleton */}
              {!isLast && (
                <div className="bg-card border-border mt-2 rounded-xl border p-3 shadow-sm">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 shrink-0 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <Skeleton className="h-3 w-24" />
                        <Skeleton className="h-3 w-8" />
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-3 w-10" />
                        <Skeleton className="h-3 w-10" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
