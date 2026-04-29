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
    photos: (event.photos || []).map(p => ({
      id: p.id,
      url: p.url,
      type: p.type,
      createdAt: p.createdAt
    })),
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

export interface BudgetStats {
  totalPlanned: number;
  totalActual: number;
  byCategory: {
    category: string;
    planned: number;
    actual: number;
    color: string;
  }[];
}

export function calculateBudgetStats(events: TripEvent[]): BudgetStats {
  const categories = [
    { id: 'food', label: '食事', color: '#F43F5E' },
    { id: 'transport', label: '交通', color: '#3B82F6' },
    { id: 'sightseeing', label: '観光', color: '#0EA5E9' },
    { id: 'hotel', label: '宿泊', color: '#10B981' },
    { id: 'shopping', label: 'お土産', color: '#EC4899' },
    { id: 'basic', label: 'その他', color: '#71717A' },
  ];

  const totalPlanned = events.reduce((sum, e) => sum + (e.plannedBudget || 0), 0);
  const totalActual = events.reduce((sum, e) => sum + (e.actualExpense || 0), 0);

  const byCategory = categories.map(cat => {
    const catEvents = events.filter(e => e.type === cat.id);
    return {
      category: cat.label,
      planned: catEvents.reduce((sum, e) => sum + (e.plannedBudget || 0), 0),
      actual: catEvents.reduce((sum, e) => sum + (e.actualExpense || 0), 0),
      color: cat.color,
    };
  }).filter(c => c.planned > 0 || c.actual > 0);

  return { totalPlanned, totalActual, byCategory };
}
