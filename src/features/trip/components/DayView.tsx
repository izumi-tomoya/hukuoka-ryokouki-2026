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
import ActionSummary from "@/features/trip/components/ActionSummary";
import { getAllLocations } from "@/features/trip/api/tripActions";

interface DayViewProps {
  events: TripEvent[];
  dayNumber: number;
  dayLabel?: string;
  dayTitle?: string;
  dayHighlight?: string;
  tips?: Tip[];
  slug: string;
  days?: { dayNumber: number }[];
  isAdmin?: boolean;
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
  isAdmin = false,
}: DayViewProps) {
  const [locationMaster] = await Promise.all([
    getAllLocations()
  ]);
  
  const locationNames = (locationMaster || []).map(l => l.name);
  const uniqueLocations = extractLocationsFromEvents(events, tips, isAdmin, locationNames);
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
        <TripMap events={events} isAdmin={isAdmin} locationMaster={locationMaster || []} />

        <ActionSummary events={events} isAdmin={isAdmin} locationNames={locationNames} />

        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
          <div className="grow max-w-sm">
            <BudgetSummary events={events} />
          </div>

          {uniqueLocations.length >= 2 && (
            <SafeLink
              href={routeUrl}
              className="group flex items-center gap-4 px-8 py-5 rounded-[2.5rem] bg-card border border-border text-foreground transition-all hover:shadow-2xl hover:border-primary/50 active:scale-95"
            >
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                <Map size={24} />
              </div>
              <div>
                <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-1 group-hover:text-primary transition-colors">Navigation</span>
                <span className="block text-sm font-bold tracking-tight">
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
