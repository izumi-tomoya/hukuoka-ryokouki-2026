import type { ExpensePayer, TemperatureLogEntry, TemperatureMood } from "@/features/trip/utils/clientTripStorage";

type TransitLikeStep = {
  time: string;
  station: string;
  lineName?: string;
  duration?: string;
  platform?: string;
  exit?: string;
};

export type InsightEvent = {
  id: string;
  dayNumber: number;
  date: string;
  time: string;
  type: string;
  title: string;
  desc?: string;
  locationUrl?: string;
  isConfirmed?: boolean;
  plannedBudget?: number;
  actualExpense?: number;
  transitSteps?: TransitLikeStep[];
};

export type InsightTip = {
  id: string;
  title: string;
  body: string;
  venue?: string;
  imageUrl?: string;
  isWarning?: boolean;
  isConfirmed?: boolean;
  category?: string;
};

type WeatherLike = {
  themeStatus?: string;
  current?: {
    temp?: number;
    text?: string;
    condition?: string;
  };
  forecast?: Array<{
    date: string;
    tempMax: number;
    tempMin: number;
    text?: string;
    condition?: string;
  }>;
} | null;

export interface DelayConflict {
  eventId: string;
  title: string;
  time: string;
  latenessMinutes: number;
}

export interface DelayRecoveryPlan {
  label: string;
  recoveredMinutes: number;
  eventIds: string[];
}

export interface DelayInsight {
  conflict: DelayConflict | null;
  recoveryPlans: DelayRecoveryPlan[];
  shiftedTitles: string[];
  narrative: string;
}

export interface PackingSuggestion {
  name: string;
  reason: string;
  category: "Essential" | "Clothing" | "Gadget" | "Other";
  urgency: "high" | "medium" | "low";
}

export interface EmergencyLink {
  label: string;
  href?: string;
  description: string;
}

export interface EmergencySnapshot {
  hotels: EmergencyLink[];
  flights: EmergencyLink[];
  reservations: EmergencyLink[];
  warnings: string[];
  contacts: string[];
}

const EVENT_DURATION_DEFAULTS: Record<string, number> = {
  food: 80,
  transport: 45,
  sightseeing: 100,
  hotel: 35,
  shopping: 55,
  surprise: 75,
  basic: 45,
};

const PHONE_REGEX = /(?:\+?\d{1,3}[-\s]?)?(?:\d{2,4}[-\s]?){2,3}\d{3,4}/g;

export const TEMPERATURE_MOOD_NARRATIVES: Record<TemperatureMood, string> = {
  joy: "高揚感が残った瞬間",
  calm: "静かに沁みた瞬間",
  tired: "疲れも含めて記憶に残る瞬間",
  surprised: "不意に心が動いた瞬間",
  again: "また戻りたくなった瞬間",
};

export function parseMinutes(time: string) {
  const match = time.match(/(\d{1,2}):(\d{2})/);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

export function eventDateTime(event: Pick<InsightEvent, "date" | "time">) {
  const minutes = parseMinutes(event.time);
  if (minutes === null) return null;

  const date = new Date(event.date);
  date.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return date;
}

export function formatMinutes(value: number) {
  const abs = Math.abs(value);
  const hours = Math.floor(abs / 60);
  const minutes = abs % 60;
  const text = hours > 0 ? `${hours}時間${minutes}分` : `${minutes}分`;
  return value >= 0 ? `あと${text}` : `${text}超過`;
}

export function currency(value = 0) {
  return `¥${value.toLocaleString()}`;
}

function inferDurationMinutes(event: InsightEvent, nextEvent?: InsightEvent) {
  const fallback = EVENT_DURATION_DEFAULTS[event.type] ?? EVENT_DURATION_DEFAULTS.basic;
  if (!nextEvent) return fallback;

  const currentMinutes = parseMinutes(event.time);
  const nextMinutes = parseMinutes(nextEvent.time);
  if (currentMinutes === null || nextMinutes === null || currentMinutes >= nextMinutes) {
    return fallback;
  }

  const gap = nextMinutes - currentMinutes;
  return Math.max(20, Math.min(fallback, gap - 10));
}

export function computeDelayInsight(events: InsightEvent[], startIndex: number, delayMinutes: number): DelayInsight {
  if (startIndex < 0 || startIndex >= events.length || delayMinutes <= 0) {
    return {
      conflict: null,
      recoveryPlans: [],
      shiftedTitles: [],
      narrative: "現在の遅延は次の固定予定に影響しません。",
    };
  }

  let remainingDelay = delayMinutes;
  let conflict: DelayConflict | null = null;
  const shiftedTitles: string[] = [];

  for (let index = startIndex; index < events.length - 1; index += 1) {
    const current = events[index];
    const next = events[index + 1];
    const duration = inferDurationMinutes(current, next);
    const currentMinutes = parseMinutes(current.time);
    const nextMinutes = parseMinutes(next.time);

    if (currentMinutes === null || nextMinutes === null || nextMinutes <= currentMinutes) continue;

    const gap = nextMinutes - currentMinutes;
    const slack = Math.max(gap - duration, 0);
    const latenessAtNext = Math.max(0, remainingDelay - slack);

    if (latenessAtNext > 0) {
      shiftedTitles.push(next.title);
    }

    if (!conflict && next.isConfirmed && latenessAtNext > 0) {
      conflict = {
        eventId: next.id,
        title: next.title,
        time: next.time,
        latenessMinutes: latenessAtNext,
      };
    }

    remainingDelay = latenessAtNext;
  }

  if (!conflict) {
    return {
      conflict: null,
      recoveryPlans: [],
      shiftedTitles,
      narrative:
        shiftedTitles.length > 0
          ? `${delayMinutes}分遅れても、固定予定には間に合います。柔軟な予定が後ろへずれます。`
          : "現在の遅延は次の固定予定に影響しません。",
    };
  }

  const recoveryPlans = buildRecoveryPlans(events, startIndex, conflict.eventId, conflict.latenessMinutes);

  return {
    conflict,
    recoveryPlans,
    shiftedTitles,
    narrative: `${delayMinutes}分遅れると ${conflict.time} の ${conflict.title} に約${conflict.latenessMinutes}分遅れます。`,
  };
}

function buildRecoveryPlans(
  events: InsightEvent[],
  startIndex: number,
  conflictEventId: string,
  minutesNeeded: number
) {
  const plans: DelayRecoveryPlan[] = [];
  const candidates = events
    .slice(startIndex)
    .filter((event) => event.id !== conflictEventId && !event.isConfirmed);

  const chosen: InsightEvent[] = [];
  let recovered = 0;

  for (let index = 0; index < candidates.length; index += 1) {
    const event = candidates[index];
    const nextEvent = candidates[index + 1];
    chosen.push(event);
    recovered += inferDurationMinutes(event, nextEvent);

    plans.push({
      label: chosen.map((item) => item.title).join(" / "),
      recoveredMinutes: recovered,
      eventIds: chosen.map((item) => item.id),
    });

    if (recovered >= minutesNeeded) break;
  }

  return plans;
}

export function buildPackingRecommendations(
  events: InsightEvent[],
  weatherData: WeatherLike,
  existingNames: string[]
) {
  const suggestions: PackingSuggestion[] = [];
  const lowerNames = new Set(existingNames.map((name) => name.trim().toLowerCase()));
  const transportCount = events.filter((event) => event.type === "transport").length;
  const firstEventMinutes = events.map((event) => parseMinutes(event.time)).filter((value): value is number => value !== null);
  const earliestEvent = firstEventMinutes.length > 0 ? Math.min(...firstEventMinutes) : null;
  const hotelCount = events.filter((event) => event.type === "hotel").length;
  const todayForecast = weatherData?.forecast?.[0];
  const currentTemp = weatherData?.current?.temp;

  const push = (suggestion: PackingSuggestion) => {
    if (lowerNames.has(suggestion.name.toLowerCase())) return;
    if (suggestions.some((item) => item.name === suggestion.name)) return;
    suggestions.push(suggestion);
  };

  if (weatherData?.themeStatus === "rainy" || todayForecast?.text?.includes("雨")) {
    push({
      name: "折りたたみ傘",
      reason: "雨予報に備えて、移動中でもすぐ使えます。",
      category: "Essential",
      urgency: "high",
    });
    push({
      name: "タオルハンカチ",
      reason: "雨の日の移動と冷房対策の両方に使えます。",
      category: "Other",
      urgency: "medium",
    });
  }

  if ((todayForecast?.tempMax ?? currentTemp ?? 0) >= 25) {
    push({
      name: "日焼け止め",
      reason: "日中の外歩きが長い日に効きます。",
      category: "Essential",
      urgency: "medium",
    });
  }

  if ((todayForecast?.tempMin ?? currentTemp ?? 99) <= 14) {
    push({
      name: "薄手の羽織り",
      reason: "朝晩の気温差と車内冷房に備えられます。",
      category: "Clothing",
      urgency: "high",
    });
  }

  if (transportCount >= 2 || hotelCount === 0) {
    push({
      name: "モバイルバッテリー",
      reason: "地図とカメラを長時間使う旅程です。",
      category: "Gadget",
      urgency: "high",
    });
  }

  if (earliestEvent !== null && earliestEvent <= 7 * 60) {
    push({
      name: "軽食",
      reason: "早朝出発の移動でリズムを崩しにくくなります。",
      category: "Other",
      urgency: "medium",
    });
  }

  if (hotelCount > 0) {
    push({
      name: "スキンケアセット",
      reason: "ホテル滞在の夜と翌朝の支度が安定します。",
      category: "Other",
      urgency: "low",
    });
  }

  return suggestions.slice(0, 6);
}

export function buildEmergencySnapshot(trip: { location: string }, events: InsightEvent[], tips: InsightTip[]): EmergencySnapshot {
  const hotels = events
    .filter((event) => event.type === "hotel")
    .slice(0, 2)
    .map((event) => ({
      label: event.title,
      href: event.locationUrl,
      description: event.desc || `${event.time} 予定`,
    }));

  const flights = events
    .filter((event) => /空港|flight|フライト|✈|🛬/i.test(`${event.title} ${event.desc || ""}`))
    .slice(0, 3)
    .map((event) => ({
      label: event.title,
      href: event.locationUrl,
      description: `${event.time} / ${event.desc || trip.location}`,
    }));

  const reservations = [
    ...events
      .filter((event) => event.isConfirmed)
      .slice(0, 4)
      .map((event) => ({
        label: event.title,
        href: event.locationUrl,
        description: `${event.time} / ${event.desc || "予約済み"}`,
      })),
    ...tips
      .filter((tip) => tip.category === "Reservation" || tip.isConfirmed || tip.imageUrl)
      .slice(0, 3)
      .map((tip) => ({
        label: tip.title,
        href: tip.imageUrl,
        description: tip.body,
      })),
  ].slice(0, 6);

  const warnings = tips
    .filter((tip) => tip.isWarning)
    .map((tip) => `${tip.title}: ${tip.body}`)
    .slice(0, 4);

  const contacts = Array.from(
    new Set(
      [
        ...events.map((event) => `${event.title} ${event.desc || ""}`),
        ...tips.map((tip) => `${tip.title} ${tip.body}`),
      ]
        .flatMap((text) => text.match(PHONE_REGEX) || [])
        .map((phone) => phone.trim())
    )
  ).slice(0, 4);

  return { hotels, flights, reservations, warnings, contacts };
}

export function buildEmergencyMemo(
  trip: { title: string; location: string },
  snapshot: EmergencySnapshot
) {
  return [
    trip.title,
    `場所: ${trip.location}`,
    snapshot.hotels.length > 0 ? "ホテル" : "",
    ...snapshot.hotels.map((item) => `- ${item.label} / ${item.description}`),
    snapshot.flights.length > 0 ? "移動" : "",
    ...snapshot.flights.map((item) => `- ${item.label} / ${item.description}`),
    snapshot.reservations.length > 0 ? "予約" : "",
    ...snapshot.reservations.map((item) => `- ${item.label} / ${item.description}`),
    snapshot.contacts.length > 0 ? `連絡先: ${snapshot.contacts.join(", ")}` : "",
    snapshot.warnings.length > 0 ? "注意" : "",
    ...snapshot.warnings.map((item) => `- ${item}`),
  ]
    .filter(Boolean)
    .join("\n");
}

export function computeSettlement(events: InsightEvent[], payers: Record<string, ExpensePayer>) {
  const expenseEvents = events.filter((event) => (event.actualExpense || 0) > 0);

  const totals = expenseEvents.reduce(
    (acc, event) => {
      const amount = event.actualExpense || 0;
      const payer = payers[event.id] || "shared";

      if (payer === "you") {
        acc.youPaid += amount;
      } else if (payer === "partner") {
        acc.partnerPaid += amount;
      } else {
        acc.youPaid += Math.ceil(amount / 2);
        acc.partnerPaid += Math.floor(amount / 2);
      }

      acc.total += amount;
      return acc;
    },
    { total: 0, youPaid: 0, partnerPaid: 0 }
  );

  const target = Math.ceil(totals.total / 2);
  const youDelta = totals.youPaid - target;
  const partnerDelta = totals.partnerPaid - target;

  return {
    expenseEvents,
    total: totals.total,
    youPaid: totals.youPaid,
    partnerPaid: totals.partnerPaid,
    target,
    youDelta,
    partnerDelta,
    instruction:
      youDelta > 0
        ? `相手から ${currency(youDelta)} 受け取ると均等です。`
        : youDelta < 0
          ? `${currency(Math.abs(youDelta))} を相手へ渡すと均等です。`
          : "すでにちょうど半分ずつです。",
  };
}

export function summarizeTemperature(logs: TemperatureLogEntry[]) {
  const counts = logs.reduce<Record<TemperatureMood, number>>(
    (acc, log) => {
      acc[log.mood] += 1;
      return acc;
    },
    { joy: 0, calm: 0, tired: 0, surprised: 0, again: 0 }
  );

  const topMood = (Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] || "joy") as TemperatureMood;
  const revisitCount = logs.filter((log) => log.revisit).length;

  return {
    counts,
    topMood,
    revisitCount,
    highlightedLogs: logs.slice(0, 5),
  };
}

export function buildFallbackAlternatives(
  trigger: "rain" | "crowd" | "tired" | "budget",
  events: InsightEvent[],
  tips: InsightTip[],
  delayMinutes = 0
) {
  const futureEvents = events.slice(0, 5);
  const hiddenTips = tips.filter((tip) => ["Hidden Gem", "General", "Gourmet"].includes(tip.category || ""));

  if (trigger === "rain") {
    return [
      {
        title: "屋内寄りの順番へ寄せる",
        reason: "雨脚が強いなら、移動距離の長い外歩きを後ろへ回すのが安全です。",
        action: hiddenTips[0]?.venue || hiddenTips[0]?.title || "駅直結エリアを先に回る",
      },
      {
        title: "カフェ休憩を差し込む",
        reason: `${delayMinutes || 15}分ほど天候待ちを挟むと、その後の移動が安定します。`,
        action: futureEvents.find((event) => event.type === "food")?.title || "予約のない飲食スポットへ退避",
      },
    ];
  }

  if (trigger === "crowd") {
    return [
      {
        title: "固定予約を優先し、自由行動を短縮する",
        reason: "混雑時は並び時間の振れ幅が大きいので、予約済みの価値が上がります。",
        action: futureEvents.find((event) => event.isConfirmed)?.title || "次の予約へ直行",
      },
      {
        title: "穴場候補へ切り替える",
        reason: "人の密度が高い時間帯は、Hidden Gem 系の候補が効きます。",
        action: hiddenTips[0]?.title || "メイン導線から一度外れる",
      },
    ];
  }

  if (trigger === "tired") {
    return [
      {
        title: "移動を1本減らす",
        reason: "疲労時は到着後の満足度より移動コストが勝ちやすいです。",
        action: futureEvents.find((event) => event.type === "sightseeing")?.title || "寄り道を1件見送る",
      },
      {
        title: "ホテル基点へ戻す",
        reason: "荷物整理と休憩を挟むと夜の予定が持ち直しやすくなります。",
        action: futureEvents.find((event) => event.type === "hotel")?.title || "ホテル周辺で過ごす",
      },
    ];
  }

  return [
    {
      title: "無料または軽めの立ち寄りへ差し替える",
      reason: "予算超過時は観光より食事と移動の固定費を優先した方が満足度を落としにくいです。",
      action: hiddenTips[0]?.venue || "散策中心の時間に切り替える",
    },
    {
      title: "次の出費までのクッションを作る",
      reason: "このあとの高単価イベントに備えて、直前の買い物を削るのが効きます。",
      action: futureEvents.find((event) => event.type === "shopping")?.title || "お土産タイミングを後ろへ回す",
    },
  ];
}
