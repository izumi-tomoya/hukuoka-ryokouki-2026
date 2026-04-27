import type { Prisma } from '@prisma/client';
import type { TripEvent, EventType, TagType, YataiStop, TransitStep, WeatherStats } from '@/features/trip/types/trip';

type EventWithStops = Prisma.EventGetPayload<{
  include: { 
    yataiStops: true;
    transitSteps: true;
  };
}>;

export function mapEventToTripEvent(event: EventWithStops): TripEvent {
  // Use plannedBudget if budget is not provided, or vice versa for backward compatibility
  const plannedBudget = event.plannedBudget ?? undefined;

  return {
    time: event.time,
    type: event.type as EventType,
    title: event.title ?? undefined,
    desc: event.desc ?? undefined,
    tag: (event.tag ?? undefined) as TagType | undefined,
    tagLabel: event.tagLabel ?? undefined,
    locationUrl: event.locationUrl ?? undefined,
    foodName: event.foodName ?? undefined,
    foodDesc: event.foodDesc ?? undefined,
    highlight: event.highlight ?? undefined,
    isYatai: event.isYatai,
    isConfirmed: event.isConfirmed,
    id: event.id,
    weatherStats: (event as unknown as { weatherStats?: WeatherStats }).weatherStats ?? undefined,
    status: event.status ?? undefined,
    
    // Memoir & Expense mapping
    notes: event.notes ?? undefined,
    actualPhotos: event.actualPhotos,
    actualExpense: event.actualExpense ?? undefined,
    plannedBudget: plannedBudget,
    budget: plannedBudget,
    
    yataiStops: (event.yataiStops || []).map((s): YataiStop => ({
      id: s.id,
      time: s.time,
      stop: s.stop,
      desc: s.desc,
      isVisited: s.isVisited,
      waitMinutes: s.waitMinutes ?? undefined,
      liveStatus: s.liveStatus ?? undefined,
    })),

    transitSteps: (event.transitSteps || []).map((s): TransitStep => ({
      id: s.id,
      time: s.time,
      station: s.station,
      mode: s.mode as TransitStep['mode'],
      lineName: s.lineName ?? undefined,
      duration: s.duration ?? undefined,
      fare: s.fare ?? undefined,
      platform: s.platform ?? undefined,
      exit: s.exit ?? undefined,
      isTransfer: s.isTransfer,
    })),
  };
}
