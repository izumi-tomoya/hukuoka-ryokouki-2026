import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export default function NewTripLoading() {
  return (
    <div className="bg-memoir-bg dark:bg-background min-h-screen pt-24 pb-12 transition-colors">
      <Container className="max-w-2xl">
        <div className="mb-8 text-center md:mb-12 md:text-left">
          <Skeleton className="mx-auto mb-4 h-10 w-64 opacity-20 sm:h-12 md:mx-0 md:h-14" />
          <Skeleton className="mx-auto h-4 w-48 opacity-10 md:mx-0" />
        </div>
        <div className="space-y-8 rounded-[2.5rem] border border-zinc-200 bg-white p-8 shadow-sm md:p-10 dark:border-zinc-800 dark:bg-zinc-900">
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
          <Skeleton className="mt-8 h-14 w-full rounded-full" />
        </div>
      </Container>
    </div>
  );
}
