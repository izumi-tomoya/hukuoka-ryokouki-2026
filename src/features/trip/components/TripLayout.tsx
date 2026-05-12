"use client";

import { type ReactNode, useEffect } from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import type { Tip, TripEvent } from "@/features/trip/types/trip";
import { useModalStore } from "@/lib/store/useModalStore";
import CategoryTabs from "./CategoryTabs";
import QuickCapturePanel from "./client/QuickCapturePanel";

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
  isLoading,
}: Props) {
  const updateTips = useModalStore((s) => s.updateTips);

  useEffect(() => {
    if (tips.length > 0) {
      updateTips(tips);
    }
  }, [tips, updateTips]);

  return (
    <div className="bg-background text-foreground min-h-screen overflow-x-hidden pb-20 transition-colors duration-500">
      <header className="mx-auto max-w-5xl px-4 pt-8 pb-5 sm:px-6 md:pt-16 md:pb-8">
        <div className="mb-7 text-center md:mb-10 md:text-left">
          {isLoading ? (
            <>
              <Skeleton className="mx-auto mb-4 h-10 w-3/4 opacity-20 md:mx-0 md:h-14 md:w-1/2" />
              <Skeleton className="mx-auto h-4 w-1/2 opacity-20 md:mx-0 md:w-1/3" />
            </>
          ) : (
            <>
              <h1 className="font-playfair text-foreground mb-3 text-[2rem] leading-tight font-extrabold tracking-tight break-words sm:text-4xl md:mb-4 md:text-5xl">
                {title}
              </h1>
              {subtitle && (
                <p className="text-muted-foreground text-[10px] leading-relaxed font-bold tracking-[0.14em] break-words uppercase sm:tracking-[0.2em] md:text-xs">
                  {subtitle}
                </p>
              )}
            </>
          )}
        </div>

        {isLoading ? (
          <div className="-mx-4 mb-8 flex items-center justify-start gap-2 overflow-hidden px-4 md:mx-0 md:mb-16 md:gap-3 md:px-0 lg:justify-center">
            <Skeleton className="h-11 w-28 shrink-0 rounded-full opacity-10" />
            <Skeleton className="h-11 w-28 shrink-0 rounded-full opacity-10" />
            <Skeleton className="h-11 w-28 shrink-0 rounded-full opacity-10" />
            <Skeleton className="h-11 w-24 shrink-0 rounded-full opacity-5" />
          </div>
        ) : (
          <CategoryTabs slug={slug} activePath={activePath} isSecretMode={isSecretMode} days={days} />
        )}
      </header>

      <main className="mx-auto max-w-5xl px-4 sm:px-6">{children}</main>

      {/* --- Global Quick Capture --- */}
      {!isLoading && tripId && events.length > 0 && isSecretMode && (
        <QuickCapturePanel tripId={tripId} events={events} />
      )}
    </div>
  );
}
