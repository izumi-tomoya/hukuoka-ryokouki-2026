import type { Prisma } from '@prisma/client';
import type { TripEvent, EventType, TagType, YataiStop } from '@/types/trip';

type EventWithStops = Prisma.EventGetPayload<{
  include: { yataiStops: true };
}>;

export function mapEventToTripEvent(event: EventWithStops): TripEvent {
  // Use type assertion as a fallback if the generated Prisma types are out of sync in the current environment
  const isConfirmed = (event as unknown as { isConfirmed?: boolean }).isConfirmed;
  
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
    isConfirmed: isConfirmed ?? false,
    id: event.id,
    yataiStops: event.yataiStops.map((s): YataiStop => ({
      time: s.time,
      stop: s.stop,
      desc: s.desc,
    })),
  };
}
