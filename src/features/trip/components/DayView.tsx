import { auth } from "@/lib/auth";
import { getDirectionsUrl } from "@/lib/mapUtils";
import { Map } from "lucide-react";
import type { TripEvent, Tip } from "@/features/trip/types/trip";
import EventFilterWrapper from "@/features/trip/components/client/EventFilterWrapper";
import { CommonTipsSection } from "@/features/trip/components/CommonTipsSection";
import BudgetSummary from "@/features/trip/components/BudgetSummary";
import TripLayout from "@/features/trip/components/TripLayout";
import { SafeLink } from "@/features/trip/components/client/SafeLink";
import TripMap from "./client/TripMap";
import { extractLocationsFromEvents } from "@/features/trip/utils/mapUtils";

interface DayViewProps {
  events: TripEvent[];
  dayNumber: number;
  dayLabel?: string;
  dayTitle?: string;
  dayHighlight?: string;
  tips?: Tip[];
  slug: string;
  days?: { dayNumber: number }[];
}

export default async function DayView({
  events,
  dayNumber,
  dayLabel,
  dayTitle,
  dayHighlight,
  tips,
  slug,
  days,
}: DayViewProps) {
  const session = await auth();
  const isAdmin = !!session?.user?.isAdmin;

  const uniqueLocations = extractLocationsFromEvents(events, tips, isAdmin);
  const routeUrl = getDirectionsUrl(uniqueLocations);

  return (
    <TripLayout
      slug={slug}
      activePath={`/trip/${slug}/day/${dayNumber}`}
      isSecretMode={isAdmin}
      title={dayTitle ?? `Day ${dayNumber}`}
      subtitle={`${dayLabel || ''} — ${dayHighlight || ''}`}
      days={days}
    >
      <div className="space-y-12">
        {/* Map Section */}
        <TripMap locations={uniqueLocations} />

        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="max-w-xs">
            <BudgetSummary events={events} />
          </div>

          {uniqueLocations.length >= 2 && (
            <SafeLink
              href={routeUrl}
              className="group flex items-center gap-4 px-8 py-5 rounded-[2.5rem] bg-white border border-rose-100 text-stone-900 transition-all hover:shadow-xl hover:border-rose-200 active:scale-95"
            >
              <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all">
                <Map size={24} />
              </div>
              <div>
                <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-rose-400 mb-1">Navigation</span>
                <span className="block text-sm font-bold tracking-tight group-hover:text-rose-600 transition-colors">
                  今日の全ルートを表示
                </span>
              </div>
            </SafeLink>
          )}
        </div>

        <EventFilterWrapper events={events} dayNumber={dayNumber as 1 | 2} isAdmin={isAdmin} />

        <CommonTipsSection tips={tips || []} isAdmin={isAdmin} />
      </div>
    </TripLayout>
  );
}
