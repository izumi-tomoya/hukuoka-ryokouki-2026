import { Skeleton } from "@/components/ui/Skeleton";

export default function HeroSkeleton() {
  return (
    <header className="relative overflow-hidden py-16 bg-background">
      {/* 背景の装飾はそのまま残すか、スケルトン用に薄くする */}
      <div className="absolute top-0 right-0 h-100 w-100 rounded-full bg-stone-100/50 blur-[120px] -translate-y-1/2 translate-x-1/4" />
      <div className="absolute bottom-0 left-0 h-75 w-75 rounded-full bg-stone-100/50 blur-[100px] translate-y-1/3 -translate-x-1/4" />

      <div className="relative z-10 flex flex-col items-center px-6 text-center">
        {/* SecretToggle の場所 */}
        <Skeleton className="h-6 w-32 rounded-full mb-8" />

        <div className="mt-8 mb-6 flex flex-col items-center">
          {/* 年份表示 */}
          <Skeleton className="h-4 w-24 mb-4" />
          {/* タイトル */}
          <Skeleton className="h-12 w-64 md:w-96" />
        </div>

        {/* 日付表示 */}
        <Skeleton className="h-5 w-48 mb-8" />

        {/* カウントダウン */}
        <Skeleton className="h-20 w-80 max-w-full rounded-2xl" />
      </div>
    </header>
  );
}
