import { ReactNode } from "react";
import CategoryTabs from "./CategoryTabs";
import { Skeleton } from "@/components/ui/Skeleton";

interface Props {
  slug?: string;
  activePath?: string;
  isSecretMode?: boolean;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  days?: { dayNumber: number }[];
  isLoading?: boolean;
}

export default function TripLayout({ 
  slug = "", 
  activePath = "", 
  isSecretMode = false, 
  title, 
  subtitle, 
  children, 
  days, 
  isLoading 
}: Props) {
  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <header className="px-6 pt-10 md:pt-16 pb-6 md:pb-8 mx-auto max-w-5xl">
        <div className="mb-8 md:mb-10 text-center md:text-left">
          {isLoading ? (
            <>
              <Skeleton className="h-10 md:h-14 w-3/4 md:w-1/2 mb-4 mx-auto md:mx-0" />
              <Skeleton className="h-4 w-1/2 md:w-1/3 mx-auto md:mx-0" />
            </>
          ) : (
            <>
              <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 mb-3 md:mb-4 tracking-tight leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-stone-400 text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase">
                  {subtitle}
                </p>
              )}
            </>
          )}
        </div>

        {isLoading ? (
          <div className="flex items-center justify-start md:justify-center gap-2 md:gap-3 mb-12 md:mb-16 overflow-hidden -mx-6 px-6 md:mx-0 md:px-0">
            <Skeleton className="h-11 w-28 rounded-full shrink-0" />
            <Skeleton className="h-11 w-28 rounded-full shrink-0" />
            <Skeleton className="h-11 w-28 rounded-full shrink-0" />
            <Skeleton className="h-11 w-28 rounded-full shrink-0" />
          </div>
        ) : (
          <CategoryTabs slug={slug} activePath={activePath} isSecretMode={isSecretMode} days={days} />
        )}
      </header>

      <main className="mx-auto max-w-5xl px-6">
        {children}
      </main>
    </div>
  );
}

