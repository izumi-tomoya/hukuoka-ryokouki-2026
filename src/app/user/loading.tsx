import { Container } from "@/components/ui/Container";
import { Skeleton } from "@/components/ui/Skeleton";

export default function UserLoading() {
  return (
    <div className="min-h-screen bg-memoir-bg dark:bg-background pt-24 pb-12 transition-colors">
      <Container>
        <div className="mb-8 md:mb-12 text-center md:text-left">
          <Skeleton className="h-10 sm:h-12 md:h-14 w-64 mb-4 mx-auto md:mx-0 opacity-20" />
          <Skeleton className="h-4 w-48 mx-auto md:mx-0 opacity-10" />
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-12">
          {/* Sidebar Skeleton */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 flex flex-col items-center text-center">
              <Skeleton className="h-32 w-32 rounded-full mb-6" />
              <Skeleton className="h-8 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-6" />
              <Skeleton className="h-16 w-full rounded-2xl" />
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-6">
              <Skeleton className="h-4 w-1/4 mb-6" />
              <div className="grid grid-cols-3 gap-2">
                <Skeleton className="h-24 rounded-2xl" />
                <Skeleton className="h-24 rounded-2xl" />
                <Skeleton className="h-24 rounded-2xl" />
              </div>
            </div>
          </div>

          {/* Main Content Skeleton */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 lg:p-10">
              <Skeleton className="h-8 w-1/3 mb-8" />
              <div className="space-y-4">
                <Skeleton className="h-28 rounded-3xl" />
                <Skeleton className="h-28 rounded-3xl" />
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] p-8 lg:p-10">
              <Skeleton className="h-8 w-1/3 mb-8" />
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
