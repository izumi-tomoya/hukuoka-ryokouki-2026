import type { TripEvent, Tip } from "@/features/trip/types/trip";
import EventFilterWrapper from "@/components/trip/client/EventFilterWrapper";
import { CommonTipsSection } from "@/components/trip/CommonTipsSection";
import BudgetSummary from "@/components/trip/BudgetSummary";
import TripLayout from "@/components/trip/TripLayout";
import { auth } from "@/lib/auth";

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

  return (
    <TripLayout
      slug={slug}
      activePath={`/trip/${slug}/day/${dayNumber}`}
      isSecretMode={isAdmin}
      title={dayTitle ?? `Day ${dayNumber}`}
      subtitle={`${dayLabel || ''} — ${dayHighlight || ''}`}
    >
      <div className="space-y-12">
        <div className="max-w-xs">
          <BudgetSummary events={events} />
        </div>

        <EventFilterWrapper events={events} dayNumber={dayNumber} />

        <CommonTipsSection tips={tips || []} dayNumber={dayNumber} isAdmin={isAdmin} />
      </div>
    </TripLayout>
  );
}
