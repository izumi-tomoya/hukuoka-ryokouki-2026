import type { Prisma } from '@prisma/client';
import type { TripEvent, EventType, TagType, YataiStop } from '@/types/trip';

type EventWithStops = Prisma.EventGetPayload<{
  include: { yataiStops: true };
}>;

export function mapEventToTripEvent(event: EventWithStops): TripEvent {
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
    yataiStops: event.yataiStops.map((s): YataiStop => ({
      time: s.time,
      stop: s.stop,
      desc: s.desc,
    })),
  };
}
