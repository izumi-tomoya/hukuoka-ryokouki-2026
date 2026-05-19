import { Map as MapIcon } from "lucide-react";
import BudgetSummary from "@/features/trip/components/BudgetSummary";
import { CommonTipsSection } from "@/features/trip/components/CommonTipsSection";
import EventFilterWrapper from "@/features/trip/components/client/EventFilterWrapper";
import { SafeLink } from "@/features/trip/components/client/SafeLink";
import TripLayout from "@/features/trip/components/TripLayout";
import type { Tip, TripEvent } from "@/features/trip/types/trip";
import { auth } from "@/lib/auth";
import { getDirectionsUrl } from "@/lib/mapUtils";

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

  const routeLocations = events
    .flatMap((e) => {
      if (e.type === "transport" && e.transitSteps && e.transitSteps.length > 0) {
        return e.transitSteps.map((s) => s.station).filter((s): s is string => !!s);
      }
      if (e.isYatai && e.yataiStops) {
        return e.yataiStops.map((s) => s.stop);
      }
      const skipTitles = ["出発", "到着", "ANA241便にて福岡へ出発", "ANA272便にて羽田へ"];
      if (e.title && skipTitles.includes(e.title)) return [];
      return [e.foodName || e.title];
    })
    .filter((loc): loc is string => !!loc && loc.length > 0);

  const uniqueLocations = routeLocations.filter((loc, i) => loc !== routeLocations[i - 1]);
  const routeUrl = getDirectionsUrl(uniqueLocations);

  return (
    <TripLayout
      slug={slug}
      activePath={`/trip/${slug}/day/${dayNumber}`}
      isSecretMode={isAdmin}
      title={dayTitle ?? `Day ${dayNumber}`}
      subtitle={`${dayLabel || ""} — ${dayHighlight || ""}`}
    >
      <div className="space-y-12">
        <div className="flex flex-col items-stretch justify-between gap-6 md:flex-row md:items-center">
          <div className="max-w-sm grow">
            <BudgetSummary events={events} />
          </div>

          {uniqueLocations.length >= 2 && (
            <SafeLink
              href={routeUrl}
              className="group rounded-article bg-card border-border text-foreground hover:border-primary/50 flex items-center gap-4 border px-8 py-5 transition-all hover:shadow-2xl active:scale-95"
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
          )}
        </div>

        <EventFilterWrapper events={events} dayNumber={dayNumber} isAdmin={isAdmin} />

        <CommonTipsSection tips={tips || []} isAdmin={isAdmin} />
      </div>
    </TripLayout>
  );
}
