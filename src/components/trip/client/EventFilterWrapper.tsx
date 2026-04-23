"use client";

import { useFilterStore } from "@/lib/store/useFilterStore";
import { TripEvent } from "@/features/trip/types/trip";
import CategoryFilter from "@/components/trip/CategoryFilter";
import Timeline from "@/components/trip/Timeline";

export default function EventFilterWrapper({ 
  events,
  dayNumber
}: { 
  events: TripEvent[];
  dayNumber: 1 | 2;
}) {
  const { activeCategory } = useFilterStore();
  
  const filteredEvents = activeCategory 
    ? events.filter(e => e.type === activeCategory) 
    : events;

  return (
    <>
      <CategoryFilter />
      <Timeline events={filteredEvents} dayNumber={dayNumber} />
    </>
  );
}
