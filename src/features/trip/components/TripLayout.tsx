"use client";

import { ReactNode, useEffect } from "react";
import CategoryTabs from "./CategoryTabs";
import { Skeleton } from "@/components/ui/Skeleton";
import QuickCapturePanel from "./client/QuickCapturePanel";
import { TripEvent, Tip } from "@/features/trip/types/trip";
import { LazyMotion, domMax } from "framer-motion";
import { useModalStore } from "@/lib/store/useModalStore";

interface Props {
  slug?: string;
  tripId?: string;
  activePath?: string;
  isSecretMode?: boolean;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  days?: { dayNumber: number }[];
  events?: TripEvent[];
  tips?: Tip[];
  isLoading?: boolean;
}

export default function TripLayout({ 
  slug = "", 
  tripId = "",
  activePath = "", 
  isSecretMode = false, 
  title, 
  subtitle, 
  children, 
  days, 
  events = [],
  tips = [],
  isLoading 
}: Props) {
  const updateTips = useModalStore((s) => s.updateTips);

  useEffect(() => {
    if (tips.length > 0) {
      updateTips(tips);
    }
  }, [tips, updateTips]);
  return (
    <LazyMotion features={domMax}>
      <div className="min-h-screen bg-background text-foreground pb-20 transition-colors duration-500 overflow-x-hidden">
        <header className="px-4 sm:px-6 pt-8 md:pt-16 pb-5 md:pb-8 mx-auto max-w-5xl">
          <div className="mb-7 md:mb-10 text-center md:text-left">
            {isLoading ? (
              <>
                <Skeleton className="h-10 md:h-14 w-3/4 md:w-1/2 mb-4 mx-auto md:mx-0 opacity-20" />
                <Skeleton className="h-4 w-1/2 md:w-1/3 mx-auto md:mx-0 opacity-20" />
              </>
            ) : (
              <>
                <h1 className="break-words font-playfair text-[2rem] sm:text-4xl md:text-5xl font-extrabold text-foreground mb-3 md:mb-4 tracking-tight leading-tight">
                  {title}
                </h1>
                {subtitle && (
                  <p className="break-words text-muted-foreground text-[10px] md:text-xs font-bold tracking-[0.14em] sm:tracking-[0.2em] uppercase leading-relaxed">
                    {subtitle}
                  </p>
                )}
              </>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-start lg:justify-center gap-2 md:gap-3 mb-8 md:mb-16 overflow-hidden -mx-4 px-4 md:mx-0 md:px-0">
              <Skeleton className="h-11 w-28 rounded-full shrink-0 opacity-10" />
              <Skeleton className="h-11 w-28 rounded-full shrink-0 opacity-10" />
              <Skeleton className="h-11 w-28 rounded-full shrink-0 opacity-10" />
              <Skeleton className="h-11 w-24 rounded-full shrink-0 opacity-5" />
            </div>
          ) : (
            <CategoryTabs slug={slug} activePath={activePath} isSecretMode={isSecretMode} days={days} />
          )}
        </header>

        <main className="mx-auto max-w-5xl px-4 sm:px-6">
          {children}
        </main>

        {/* --- Global Quick Capture --- */}
        {!isLoading && tripId && events.length > 0 && isSecretMode && (
        <QuickCapturePanel events={events} />
        )}
      </div>
    </LazyMotion>
  );
}
