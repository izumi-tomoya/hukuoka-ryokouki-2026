import { Skeleton } from "@/components/ui/Skeleton";

export default function HeroSkeleton() {
  return (
    <div className="bg-background relative w-full overflow-hidden">
      <div className="relative mx-auto max-w-5xl px-6 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <Skeleton className="mb-6 h-6 w-32 rounded-full" />
          <Skeleton className="mb-6 h-12 w-3/4 md:h-16 md:w-2/3" />
          <Skeleton className="mb-10 h-6 w-full md:w-1/2" />

          <div className="mt-10 flex flex-wrap items-center gap-6">
            <div className="space-y-2">
              <Skeleton className="h-2 w-12" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="bg-border hidden h-8 w-px sm:block" />
            <div className="space-y-2">
              <Skeleton className="h-2 w-12" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-border/50 absolute right-0 bottom-0 left-0 h-px" />
    </div>
  );
}
