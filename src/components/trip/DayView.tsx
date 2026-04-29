import type { TripEvent, Tip } from '@/features/trip/types/trip';
import EventFilterWrapper from '@/features/trip/components/client/EventFilterWrapper';
import { CommonTipsSection } from '@/features/trip/components/CommonTipsSection';
import BudgetSummary from '@/features/trip/components/BudgetSummary';
import TripLayout from '@/features/trip/components/TripLayout';
import { auth } from '@/lib/auth';
import { getDirectionsUrl } from '@/lib/mapUtils';
import { Map } from 'lucide-react';
import { SafeLink } from '@/features/trip/components/client/SafeLink';

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
      if (e.type === 'transport' && e.transitSteps && e.transitSteps.length > 0) {
        return e.transitSteps.map((s) => s.station).filter((s): s is string => !!s);
      }
      if (e.isYatai && e.yataiStops) {
        return e.yataiStops.map((s) => s.stop);
      }
      const skipTitles = ['出発', '到着', 'ANA241便にて福岡へ出発', 'ANA272便にて羽田へ'];
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
      subtitle={`${dayLabel || ''} — ${dayHighlight || ''}`}
    >
      <div className="space-y-12">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
          <div className="grow max-w-sm">
            <BudgetSummary events={events} />
          </div>

          {uniqueLocations.length >= 2 && (
            <SafeLink
              href={routeUrl}
              className="group flex items-center gap-4 px-8 py-5 rounded-article bg-card border border-border text-foreground transition-all hover:shadow-2xl hover:border-primary/50 active:scale-95"
            >
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                <Map size={24} />
              </div>
              <div>
                <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-1 group-hover:text-primary transition-colors">
                  Navigation
                </span>
                <span className="block text-sm font-bold tracking-tight">
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
