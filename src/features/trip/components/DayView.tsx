import { Map } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { getAllLocations } from "@/features/trip/api/tripActions";
import ActionSummary from "@/features/trip/components/ActionSummary";
import BudgetSummary from "@/features/trip/components/BudgetSummary";
import { CommonTipsSection } from "@/features/trip/components/CommonTipsSection";
import DayCompletionToggle from "@/features/trip/components/client/DayCompletionToggle";
import DayNotes from "@/features/trip/components/client/DayNotes";
import EventFilterWrapper from "@/features/trip/components/client/EventFilterWrapper";
import { SafeLink } from "@/features/trip/components/client/SafeLink";
import { DayForecast } from "@/features/trip/components/DayForecast";
import { DayHeader } from "@/features/trip/components/DayHeader";
import TripLayout from "@/features/trip/components/TripLayout";
import type { Tip, TripEvent } from "@/features/trip/types/trip";
import { extractLocationsFromEvents } from "@/features/trip/utils/mapUtils";
import { getDirectionsUrl } from "@/lib/mapUtils";
import { DynamicTripMap } from "./client/DynamicTripMap";

interface DayViewProps {
  dayId: string;
  events: TripEvent[];
  dayNumber: number;
  dayLabel: string;
  dayTitle?: string;
  dayHighlight?: string;
  dayNotes?: string;
  isCompleted?: boolean;
  date: string;
  location: string;
  tips?: Tip[];
  slug: string;
  days: { dayNumber: number }[];
  isAdmin?: boolean;
}

export default async function DayView({
  dayId,
  events,
  dayNumber,
  dayLabel,
  dayTitle,
  dayHighlight,
  dayNotes,
  isCompleted,
  date,
  location,
  tips,
  slug,
  days,
  isAdmin = false,
}: DayViewProps) {
  const [locationMaster] = await Promise.all([getAllLocations()]);

  const locationNames = (locationMaster || []).map((l) => l.name);
  const uniqueLocations = extractLocationsFromEvents(events, tips, isAdmin, locationNames);
  const routeUrl = getDirectionsUrl(uniqueLocations);

  const prevDay = days.find((d) => d.dayNumber === dayNumber - 1)?.dayNumber;
  const nextDay = days.find((d) => d.dayNumber === dayNumber + 1)?.dayNumber;

  return (
    <TripLayout
      slug={slug}
      activePath={`/trip/${slug}/day/${dayNumber}`}
      isSecretMode={isAdmin}
      title={dayTitle ?? `Day ${dayNumber}`}
      subtitle={`${dayLabel || ""} — ${dayHighlight || ""}`}
      days={days}
    >
      <DayHeader
        dayId={dayId}
        slug={slug}
        dayNumber={dayNumber}
        dateLabel={dayLabel}
        title={dayTitle}
        highlight={dayHighlight}
        isCompleted={isCompleted}
        totalEvents={events.length}
        prevDay={prevDay}
        nextDay={nextDay}
        isAdmin={isAdmin}
      />

      <Container className="pb-24 space-y-16">
        {/* Weather Forecast for the day */}
        <DayForecast location={location} date={date} />

        {/* Map Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <h2 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Geospatial Path</h2>
          </div>
          <DynamicTripMap events={events} isAdmin={isAdmin} locationMaster={locationMaster || []} />
        </div>

        <ActionSummary events={events} isAdmin={isAdmin} locationNames={locationNames} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          <BudgetSummary events={events} />

          {uniqueLocations.length >= 2 ? (
            <SafeLink
              href={routeUrl}
              className="group flex items-center gap-4 px-8 py-5 rounded-[2.5rem] bg-card border border-border text-foreground transition-all hover:shadow-2xl hover:border-primary/50 active:scale-95"
            >
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                <Map size={24} />
              </div>
              <div>
                <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-1 group-hover:text-primary transition-colors">
                  Navigation
                </span>
                <span className="block text-sm font-bold tracking-tight">今日の全ルートを表示</span>
              </div>
            </SafeLink>
          ) : (
            <DayCompletionToggle dayId={dayId} initialCompleted={isCompleted} />
          )}
        </div>

        {uniqueLocations.length >= 2 && (
          <div className="flex justify-end">
            <DayCompletionToggle dayId={dayId} initialCompleted={isCompleted} />
          </div>
        )}

        <div className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="h-px grow bg-border" />
            <h2 className="font-playfair text-2xl md:text-3xl font-black text-foreground text-center px-4">
              Daily Timeline
            </h2>
            <div className="h-px grow bg-border" />
          </div>
          <EventFilterWrapper dayId={dayId} events={events} dayNumber={dayNumber as 1 | 2} isAdmin={isAdmin} />
        </div>

        <DayNotes dayId={dayId} initialNotes={dayNotes} isAdmin={isAdmin} />

        <CommonTipsSection tips={tips || []} isAdmin={isAdmin} />
      </Container>
    </TripLayout>
  );
}
