import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export default function UserLoading() {
  return (
    <div className="bg-memoir-bg dark:bg-background min-h-screen pt-24 pb-12 transition-colors">
      <Container>
        <div className="mb-8 text-center md:mb-12 md:text-left">
          <Skeleton className="mx-auto mb-4 h-10 w-64 opacity-20 sm:h-12 md:mx-0 md:h-14" />
          <Skeleton className="mx-auto h-4 w-48 opacity-10 md:mx-0" />
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          {/* Sidebar Skeleton */}
          <div className="space-y-6 lg:col-span-4">
            <div className="flex flex-col items-center rounded-[2.5rem] border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
              <Skeleton className="mb-6 h-32 w-32 rounded-full" />
              <Skeleton className="mb-2 h-8 w-3/4" />
              <Skeleton className="mb-6 h-4 w-1/2" />
              <Skeleton className="h-16 w-full rounded-2xl" />
            </div>

            <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
              <Skeleton className="mb-6 h-4 w-1/4" />
              <div className="grid grid-cols-3 gap-2">
                <Skeleton className="h-24 rounded-2xl" />
                <Skeleton className="h-24 rounded-2xl" />
                <Skeleton className="h-24 rounded-2xl" />
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="space-y-8 lg:col-span-8">
            <div className="rounded-[2.5rem] border border-zinc-200 bg-white p-8 lg:p-10 dark:border-zinc-800 dark:bg-zinc-900">
              <Skeleton className="mb-8 h-8 w-1/3" />
              <div className="space-y-4">
                <Skeleton className="h-28 rounded-3xl" />
                <Skeleton className="h-28 rounded-3xl" />
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-zinc-200 bg-white p-8 lg:p-10 dark:border-zinc-800 dark:bg-zinc-900">
              <Skeleton className="mb-8 h-8 w-1/3" />
              <div className="space-y-6">
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-12 w-full rounded-xl" />
                <Skeleton className="h-32 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
