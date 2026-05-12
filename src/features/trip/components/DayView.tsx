import { Map as MapIcon } from "lucide-react";
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

      <Container className="space-y-16 pb-24">
        {/* Weather Forecast for the day */}
        <DayForecast location={location} date={date} />

        {/* Map Section */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary h-2 w-2 rounded-full" />
            <h2 className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">Geospatial Path</h2>
          </div>
          <DynamicTripMap events={events} isAdmin={isAdmin} locationMaster={locationMaster || []} />
        </div>

        <ActionSummary events={events} slug={slug} isAdmin={isAdmin} locationNames={locationNames} />

        <div className="grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
          <BudgetSummary events={events} />

          {uniqueLocations.length >= 2 ? (
            <SafeLink
              href={routeUrl}
              className="group bg-card border-border text-foreground hover:border-primary/50 flex items-center gap-4 rounded-[2.5rem] border px-8 py-5 transition-all hover:shadow-2xl active:scale-95"
            >
              <div className="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex h-12 w-12 items-center justify-center rounded-2xl transition-all">
                <MapIcon size={24} />
              </div>
              <div>
                <span className="text-muted-foreground group-hover:text-primary mb-1 block text-[10px] font-black tracking-[0.3em] uppercase transition-colors">
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
            <div className="bg-border h-px grow" />
            <h2 className="font-playfair text-foreground px-4 text-center text-2xl font-black md:text-3xl">
              Daily Timeline
            </h2>
            <div className="bg-border h-px grow" />
          </div>
          <EventFilterWrapper dayId={dayId} events={events} dayNumber={dayNumber as 1 | 2} isAdmin={isAdmin} />
        </div>

        <DayNotes dayId={dayId} initialNotes={dayNotes} isAdmin={isAdmin} />

        <CommonTipsSection tips={tips || []} isAdmin={isAdmin} />
      </Container>
    </TripLayout>
  );
}
