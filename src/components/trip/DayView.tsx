import type { TripEvent, Tip } from "@/features/trip/types/trip";
import EventFilterWrapper from "@/components/trip/client/EventFilterWrapper";
import { CommonTipsSection } from "@/components/trip/CommonTipsSection";
import BudgetSummary from "@/components/trip/BudgetSummary";
import TripLayout from "@/components/trip/TripLayout";
import { auth } from "@/lib/auth";
import { getDirectionsUrl } from "@/lib/mapUtils";
import { Map } from "lucide-react";
import { SafeLink } from "@/components/trip/client/SafeLink";

interface DayViewProps {
  events: TripEvent[];
  dayNumber: 1 | 2;
  dayLabel?: string;
  dayTitle?: string;
  dayHighlight?: string;
  tips?: Tip[];
  slug: string;
}

export default async function DayView({
  events,
  dayNumber,
  dayLabel,
  dayTitle,
  dayHighlight,
  tips,
  slug,
}: DayViewProps) {
  const session = await auth();
  const isAdmin = !!session?.user?.isAdmin;
  console.log("DEBUG: Admin check in DayView:", session?.user?.email, isAdmin);

  const locationUrls = events
    .map(e => e.locationUrl)
    .filter((url): url is string => !!url && url.length > 0);

  const routeUrl = getDirectionsUrl(locationUrls);

  return (
    <TripLayout
      slug={slug}
      activePath={`/trip/${slug}/day/${dayNumber}`}
      isSecretMode={isAdmin}
      title={dayTitle ?? `Day ${dayNumber}`}
      subtitle={`${dayLabel || ''} — ${dayHighlight || ''}`}
    >
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
          <div className="max-w-xs">
            <BudgetSummary events={events} />
          </div>

          {locationUrls.length >= 2 && (
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

        <EventFilterWrapper events={events} dayNumber={dayNumber} isAdmin={isAdmin} />

        <CommonTipsSection tips={tips || []} isAdmin={isAdmin} />
      </div>
    </TripLayout>
  );
}
