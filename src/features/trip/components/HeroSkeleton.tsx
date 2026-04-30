import { Skeleton } from "@/components/ui/Skeleton";

export default function HeroSkeleton() {
  return (
    <div className="relative w-full overflow-hidden bg-background">
      <div className="relative mx-auto max-w-5xl px-6 pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <Skeleton className="h-6 w-32 rounded-full mb-6" />
          <Skeleton className="h-12 md:h-16 w-3/4 md:w-2/3 mb-6" />
          <Skeleton className="h-6 w-full md:w-1/2 mb-10" />
          
          <div className="flex flex-wrap items-center gap-6 mt-10">
            <div className="space-y-2">
              <Skeleton className="h-2 w-12" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="w-px h-8 bg-border hidden sm:block" />
            <div className="space-y-2">
              <Skeleton className="h-2 w-12" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-border/50" />
    </div>
  );
}
