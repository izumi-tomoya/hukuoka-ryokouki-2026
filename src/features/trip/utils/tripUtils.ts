import type { Prisma } from "@prisma/client";
import type { EventType, TagType, TransitStep, TripEvent, WeatherStats, YataiStop } from "@/features/trip/types/trip";

type EventWithStops = Prisma.EventGetPayload<{
  include: {
    yataiStops: true;
    transitSteps: true;
    photos: true;
  };
}>;

export const SECRET_SPOTS = ["ヒルトン", "ヒルトン福岡シーホーク", "CLOUDS", "天空のサプライズ"];

export function isSecretContent(text: string | undefined | null): boolean {
  if (!text) return false;
  const lower = text.toLowerCase();
  return (
    SECRET_SPOTS.some((spot) => lower.includes(spot.toLowerCase())) ||
    lower.includes("secret spot") ||
    lower.includes("サプライズ")
  );
}

export function isSecretEvent(
  event: {
    title?: string | null;
    desc?: string | null;
    tag?: string | null;
    foodName?: string | null;
    formalName?: string | null;
    highlight?: string | null;
    foodDesc?: string | null;
  },
  isAdmin: boolean,
): boolean {
  if (isAdmin) return false;
  if (event.tag === "surprise") return true;

  // 予定のアイデンティティに関わるフィールドのみで判定
  const identityTexts = [
    event.title,
    event.foodName,
    event.formalName,
    event.foodDesc, // foodDesc は店名が含まれることが多いため含める
  ].filter(Boolean) as string[];

  return identityTexts.some((text) => isSecretContent(text));
}

export function maskSecretText(name: string | undefined | null, isAdmin: boolean) {
  if (!name || isAdmin) return name ?? "";
  return isSecretContent(name) ? "🎁 Surprise Spot" : name;
}

export function maskLineName(name: string | undefined | null, isAdmin: boolean) {
  if (!name || isAdmin) return name ?? "";
  const lowerName = name.toLowerCase();
  const isSecret =
    SECRET_SPOTS.some((spot) => lowerName.includes(spot.toLowerCase())) ||
    lowerName.includes("secret spot") ||
    lowerName.includes("サプライズ");
  return isSecret ? "？？？" : name;
}

export function mapEventToTripEvent(event: EventWithStops): TripEvent {
  // Use plannedBudget if budget is not provided, or vice versa for backward compatibility
  const plannedBudget = event.plannedBudget ?? undefined;
  const reservationText = [event.tagLabel, event.desc, event.foodDesc, event.highlight].filter(Boolean).join(" ");
  const isReservationLike =
    event.type === "food" ||
    (event.type === "hotel" && /朝食|チェックイン|ホテル/.test(event.title || "")) ||
    /予約|Reserved|確認済み/i.test(reservationText);

  return {
    time: event.time,
    type: event.type as EventType,
    title: event.title ?? undefined,
    formalName: event.formalName ?? undefined,
    desc: event.desc ?? undefined,
    tag: (event.tag ?? undefined) as TagType | undefined,
    tagLabel: event.tagLabel ?? undefined,
    locationUrl: event.locationUrl ?? undefined,
    foodName: event.foodName ?? undefined,
    foodDesc: event.foodDesc ?? undefined,
    highlight: event.highlight ?? undefined,
    isYatai: event.isYatai,
    isConfirmed: event.isConfirmed || isReservationLike,
    id: event.id,
    weatherStats: (event as unknown as { weatherStats?: WeatherStats }).weatherStats ?? undefined,
    status: event.status ?? undefined,

    // Memoir & Expense mapping
    notes: event.notes ?? undefined,
    photos: (event.photos || []).map((p) => ({
      id: p.id,
      url: p.url,
      type: p.type,
      createdAt: p.createdAt,
    })),
    actualExpense: event.actualExpense ?? undefined,
    plannedBudget: plannedBudget,
    budget: plannedBudget,

    yataiStops: (event.yataiStops || []).map(
      (s): YataiStop => ({
        id: s.id,
        time: s.time,
        stop: s.stop,
        desc: s.desc,
        isVisited: s.isVisited,
        waitMinutes: s.waitMinutes ?? undefined,
        liveStatus: s.liveStatus ?? undefined,
      }),
    ),

    transitSteps: (event.transitSteps || []).map(
      (s): TransitStep => ({
        id: s.id,
        time: s.time,
        station: s.station,
        mode: s.mode as TransitStep["mode"],
        lineName: s.lineName ?? undefined,
        duration: s.duration ?? undefined,
        fare: s.fare ?? undefined,
        platform: s.platform ?? undefined,
        exit: s.exit ?? undefined,
        isTransfer: s.isTransfer,
      }),
    ),
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
    { id: "food", label: "食事", color: "#F43F5E" },
    { id: "transport", label: "交通", color: "#3B82F6" },
    { id: "sightseeing", label: "観光", color: "#0EA5E9" },
    { id: "hotel", label: "宿泊", color: "#10B981" },
    { id: "shopping", label: "お土産", color: "#EC4899" },
    { id: "basic", label: "その他", color: "#71717A" },
  ];

  const totalPlanned = events.reduce((sum, e) => sum + (e.plannedBudget || 0), 0);
  const totalActual = events.reduce((sum, e) => sum + (e.actualExpense || 0), 0);

  const byCategory = categories
    .map((cat) => {
      const catEvents = events.filter((e) => e.type === cat.id);
      return {
        category: cat.label,
        planned: catEvents.reduce((sum, e) => sum + (e.plannedBudget || 0), 0),
        actual: catEvents.reduce((sum, e) => sum + (e.actualExpense || 0), 0),
        color: cat.color,
      };
    })
    .filter((c) => c.planned > 0 || c.actual > 0);

  return { totalPlanned, totalActual, byCategory };
}
