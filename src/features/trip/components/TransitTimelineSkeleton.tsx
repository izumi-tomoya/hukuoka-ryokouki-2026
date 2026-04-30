import { Skeleton } from "@/components/ui/Skeleton";
import { cn } from "@/lib/utils";

export default function TransitTimelineSkeleton() {
  return (
    <div className="mt-6 space-y-0 opacity-60">
      {[1, 2, 3].map((i) => {
        const isLast = i === 3;
        return (
          <div key={i} className="relative flex gap-4">
            {/* Left: Time and Line Skeleton */}
            <div className="flex flex-col items-center w-12 shrink-0">
              <Skeleton className="h-3 w-8 mb-1" />
              
              <div className="relative flex-1 flex flex-col items-center">
                {/* Dot */}
                <div className="h-3 w-3 rounded-full border-2 border-background bg-border z-10" />
                
                {/* Line */}
                {!isLast && (
                  <div className="w-1 flex-1 -mt-1 -mb-1 bg-border/30" />
                )}
              </div>
            </div>

            {/* Right: Content Skeleton */}
            <div className={cn("flex-1 pb-6 min-w-0", isLast && "pb-0")}>
              <div className="flex items-center justify-between gap-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-12 rounded" />
              </div>

              {/* Transit Detail Box Skeleton */}
              {!isLast && (
                <div className="mt-2 bg-card rounded-xl p-3 border border-border shadow-sm">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-8 w-8 rounded-full shrink-0" />
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
