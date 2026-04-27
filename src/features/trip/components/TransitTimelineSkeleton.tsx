import { Skeleton } from "@/components/ui/Skeleton";

export default function TransitTimelineSkeleton() {
  return (
    <div className="mt-6 space-y-0">
      {[1, 2].map((i) => (
        <div key={i} className="relative flex gap-4">
          {/* Left: Time and Line */}
          <div className="flex flex-col items-center w-12 shrink-0">
            <Skeleton className="h-3 w-8 mb-1" />
            <div className="relative flex-1 flex flex-col items-center">
              <Skeleton className="h-3 w-3 rounded-full z-10" />
              <div className="w-1 flex-1 bg-stone-100" />
            </div>
          </div>

          {/* Right: Content */}
          <div className="flex-1 pb-6 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-12 rounded" />
            </div>

            <div className="mt-2 bg-white rounded-xl p-3 border border-stone-100 shadow-sm">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <Skeleton className="h-3 w-1/2" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
