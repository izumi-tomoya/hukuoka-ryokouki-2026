import { Skeleton } from "@/components/ui/Skeleton";

export default function TransitTimelineSkeleton() {
  return (
    <div className="mt-8 space-y-8 pl-4 border-l-2 border-border/30 opacity-50">
      {[1, 2].map((i) => (
        <div key={i} className="relative space-y-4">
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-12 rounded-full" />
            <Skeleton className="h-5 w-32" />
          </div>
          <div className="ml-4 p-4 rounded-2xl bg-secondary/30 border border-border space-y-3">
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="space-y-2 grow">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
