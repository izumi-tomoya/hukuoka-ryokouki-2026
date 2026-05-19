"use client";

import CategoryFilter from "@/features/trip/components/CategoryFilter";
import Timeline from "@/features/trip/components/Timeline";
import type { TripEvent } from "@/features/trip/types/trip";
import { useFilterStore } from "@/lib/store/useFilterStore";
import AddPlanButton from "./AddPlanButton";

export default function EventFilterWrapper({
  dayId,
  events,
  dayNumber,
  isAdmin,
}: {
  dayId?: string;
  events: TripEvent[];
  dayNumber: 1 | 2;
  isAdmin?: boolean;
}) {
  const { activeCategory } = useFilterStore();

  const filteredEvents = activeCategory ? events.filter((e) => e.type === activeCategory) : events;

  return (
    <div className="space-y-8">
      <CategoryFilter />

      {isAdmin && dayId && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-700">
          <AddPlanButton dayId={dayId} />
        </div>
      )}

      <Timeline events={filteredEvents} dayNumber={dayNumber} isAdmin={isAdmin} />
    </div>
  );
}
