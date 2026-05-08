import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export default function NewTripLoading() {
  return (
    <div className="min-h-screen bg-memoir-bg dark:bg-background pt-24 pb-12 transition-colors">
      <Container className="max-w-2xl">
        <div className="mb-8 md:mb-12 text-center md:text-left">
          <Skeleton className="h-10 sm:h-12 md:h-14 w-64 mb-4 mx-auto md:mx-0 opacity-20" />
          <Skeleton className="h-4 w-48 mx-auto md:mx-0 opacity-10" />
        </div>
        <div className="bg-white dark:bg-zinc-900 p-8 md:p-10 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
          <Skeleton className="h-14 w-full rounded-full mt-8" />
        </div>
      </Container>
    </div>
  );
}
