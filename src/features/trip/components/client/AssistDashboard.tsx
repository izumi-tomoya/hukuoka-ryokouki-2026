"use client";

import { useEffect, useMemo, useState } from "react";
import { MagazineCard } from "@/components/ui/MagazineCard";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowRightLeft,
  Banknote,
  CheckCircle2,
  Clock,
  CloudRain,
  Coffee,
  Copy,
  Download,
  ExternalLink,
  FileText,
  HeartPulse,
  Hotel,
  Loader2,
  MessageSquarePlus,
  Navigation,
  RotateCcw,
  Search,
  ShieldAlert,
  Smartphone,
  Sparkles,
  Ticket,
  TimerReset,
  Train,
} from "lucide-react";
import {
  appendTemperatureLog,
  loadExpensePayers,
  loadTemperatureLogs,
  saveExpensePayers,
  TEMPERATURE_MOODS,
  type ExpensePayer,
  type TemperatureLogEntry,
  type TemperatureMood,
} from "@/features/trip/utils/clientTripStorage";
import {
  buildEmergencyMemo,
  buildEmergencySnapshot,
  buildPackingRecommendations,
  computeDelayInsight,
  computeSettlement,
  currency,
  eventDateTime,
  formatMinutes,
  summarizeTemperature,
  type InsightEvent,
  type InsightTip,
} from "@/features/trip/utils/tripInsights";
import AdvisorConciergePanel from "./AdvisorConciergePanel";

type AssistDashboardProps = {
  trip: {
    id: string;
    slug: string;
    title: string;
    location: string;
    startDate: string;
    endDate: string;
  };
  events: InsightEvent[];
  tips: InsightTip[];
  weatherLabel?: string | null;
  weatherData?: {
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
};

type SharedNote = {
  id: string;
  body: string;
  createdAt: string;
};

type Trigger = "rain" | "crowd" | "tired" | "budget";

const utilityTypes = [
  { label: "コンビニ", query: "convenience store", icon: Coffee },
  { label: "トイレ", query: "public toilet", icon: ShieldAlert },
  { label: "ロッカー", query: "coin locker", icon: Ticket },
  { label: "タクシー", query: "taxi stand", icon: Navigation },
];

const payerLabels: Array<{ value: ExpensePayer; label: string }> = [
  { value: "you", label: "自分" },
  { value: "partner", label: "相手" },
  { value: "shared", label: "折半" },
];

function mapsSearchUrl(query: string, base: string) {
  return `https://www.google.com/maps/search/${encodeURIComponent(`${query} near ${base}`)}`;
}

export default function AssistDashboard({ trip, events, tips, weatherLabel, weatherData }: AssistDashboardProps) {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [delayMinutes, setDelayMinutes] = useState(0);
  const [skippedIds, setSkippedIds] = useState<string[]>([]);
  const [noteBody, setNoteBody] = useState("");
  const [notes, setNotes] = useState<SharedNote[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(window.localStorage.getItem(`memoir:shared-notes:${trip.id}`) || "[]");
    } catch {
      return [];
    }
  });
  const [checkedEventIds, setCheckedEventIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(window.localStorage.getItem(`memoir:event-checkins:${trip.id}`) || "[]");
    } catch {
      return [];
    }
  });
  const [payers, setPayers] = useState<Record<string, ExpensePayer>>(() =>
    typeof window === "undefined" ? {} : loadExpensePayers(trip.id)
  );
  const [temperatureLogs, setTemperatureLogs] = useState<TemperatureLogEntry[]>(() =>
    typeof window === "undefined" ? [] : loadTemperatureLogs(trip.id)
  );
  const [temperatureMood, setTemperatureMood] = useState<TemperatureMood>("joy");
  const [temperatureNote, setTemperatureNote] = useState("");
  const [temperatureRevisit, setTemperatureRevisit] = useState(false);
  const [aiTrigger, setAiTrigger] = useState<Trigger>("rain");
  const [aiSuggestions, setAiSuggestions] = useState<Array<{ title: string; reason: string; action: string }>>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const notesKey = `memoir:shared-notes:${trip.id}`;
  const checkinsKey = `memoir:event-checkins:${trip.id}`;

  useEffect(() => {
    const mountId = setTimeout(() => setMounted(true), 0);

    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => {
      clearTimeout(mountId);
      window.clearInterval(timer);
    };
  }, [checkinsKey, notesKey, trip.id]);

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => (eventDateTime(a)?.getTime() || 0) - (eventDateTime(b)?.getTime() || 0)),
    [events]
  );

  const activeEvents = sortedEvents.filter((event) => !skippedIds.includes(event.id));
  const nextEvent =
    activeEvents.find((event) => {
      const date = eventDateTime(event);
      return date ? date.getTime() + 30 * 60 * 1000 >= now.getTime() : false;
    }) || activeEvents[0];
  const nextIndex = nextEvent ? activeEvents.findIndex((event) => event.id === nextEvent.id) : -1;
  const nextTime = nextEvent ? eventDateTime(nextEvent) : null;
  const minutesToNext = nextTime ? Math.round((nextTime.getTime() - now.getTime()) / 60_000) - delayMinutes : null;
  const currentBase = nextEvent?.transitSteps?.[0]?.station || nextEvent?.title || trip.location;
  const warningTips = tips.filter((tip) => tip.isWarning || tip.category === "Warning");
  const actualTotal = sortedEvents.reduce((sum, event) => sum + (event.actualExpense || 0), 0);
  const delayInsight = computeDelayInsight(activeEvents, nextIndex, delayMinutes);
  const emergencySnapshot = buildEmergencySnapshot(trip, sortedEvents, tips);
  const emergencyMemo = buildEmergencyMemo(trip, emergencySnapshot);
  const settlement = computeSettlement(sortedEvents, payers);
  const temperatureSummary = summarizeTemperature(temperatureLogs);
  const briefingEvents = nextEvent ? sortedEvents.filter((event) => event.dayNumber === nextEvent.dayNumber) : [];
  const packingRecommendations = buildPackingRecommendations(sortedEvents, weatherData, []);
  const aiFallbackPrompt = {
    rain: "雨で外歩きが厳しい",
    crowd: "混雑を避けたい",
    tired: "疲れているので移動を減らしたい",
    budget: "予算を抑えたい",
  };

  const reportText = [
    `${trip.title} 旅メモ`,
    `場所: ${trip.location}`,
    nextEvent ? `次の予定: ${nextEvent.time} ${nextEvent.title}` : "",
    `実績支出: ${currency(actualTotal)}`,
    `精算: ${settlement.instruction}`,
    `温度ログ: ${temperatureSummary.highlightedLogs.length}件`,
    ...notes.slice(0, 4).map((note) => `- ${note.body}`),
  ]
    .filter(Boolean)
    .join("\n");

  const addNote = () => {
    const body = noteBody.trim();
    if (!body) return;

    const nextNotes = [{ id: crypto.randomUUID(), body, createdAt: new Date().toISOString() }, ...notes].slice(0, 20);
    setNotes(nextNotes);
    setNoteBody("");
    localStorage.setItem(notesKey, JSON.stringify(nextNotes));
  };

  const toggleCheckin = (eventId: string) => {
    const next = checkedEventIds.includes(eventId)
      ? checkedEventIds.filter((id) => id !== eventId)
      : [...checkedEventIds, eventId];
    setCheckedEventIds(next);
    localStorage.setItem(checkinsKey, JSON.stringify(next));
  };

  const copyEmergencyCard = async () => {
    await navigator.clipboard?.writeText(emergencyMemo);
  };

  const saveTemperatureEntry = () => {
    if (!nextEvent) return;

    const nextLogs = appendTemperatureLog(trip.id, {
      eventId: nextEvent.id,
      eventTitle: nextEvent.title,
      eventTime: nextEvent.time,
      dayNumber: nextEvent.dayNumber,
      mood: temperatureMood,
      energy: temperatureMood === "tired" ? 2 : temperatureMood === "joy" ? 5 : 4,
      revisit: temperatureRevisit || temperatureMood === "again",
      note: temperatureNote.trim() || undefined,
    });

    setTemperatureLogs(nextLogs);
    setTemperatureNote("");
    setTemperatureMood("joy");
    setTemperatureRevisit(false);
  };

  const updatePayer = (eventId: string, payer: ExpensePayer) => {
    const next = { ...payers, [eventId]: payer };
    setPayers(next);
    saveExpensePayers(trip.id, next);
  };

  const fetchAlternatives = async (trigger: Trigger) => {
    setAiTrigger(trigger);
    setIsAiLoading(true);

    try {
      const response = await fetch("/api/ai/alternatives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug: trip.slug,
          trigger,
          delayMinutes,
        }),
      });

      const data = await response.json();
      setAiSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []);
    } catch (error) {
      console.error("Failed to fetch AI alternatives", error);
      setAiSuggestions([]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const downloadReport = () => {
    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${trip.slug}-assist-report.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!mounted) {
    return (
      <div className="space-y-6 pb-24">
        <MagazineCard className="h-64 animate-pulse bg-secondary/20" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <MagazineCard className="h-40 animate-pulse bg-secondary/10" />
          <MagazineCard className="h-40 animate-pulse bg-secondary/10" />
          <MagazineCard className="h-40 animate-pulse bg-secondary/10" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 sm:space-y-8 lg:space-y-10">
      <section className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
        <MagazineCard className="min-w-0 border-primary/20 bg-card">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between md:gap-8">
            <div className="min-w-0">
              <div className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-primary sm:px-4 sm:tracking-[0.2em]">
                <Clock size={13} />
                <span className="truncate">Next Move Briefing</span>
              </div>
              <h2 className="break-words font-playfair text-[1.75rem] font-black leading-tight text-foreground sm:text-3xl md:text-5xl">
                {nextEvent ? nextEvent.title : "予定は登録されていません"}
              </h2>
              {nextEvent && (
                <p className="mt-4 text-sm font-medium leading-relaxed text-muted-foreground">
                  {nextEvent.time} / Day {nextEvent.dayNumber}
                  {nextEvent.desc ? ` - ${nextEvent.desc}` : ""}
                </p>
              )}
            </div>

            <div className="w-full shrink-0 rounded-[1.5rem] border border-border bg-secondary/40 p-4 text-center sm:rounded-[2rem] sm:p-6 md:w-auto md:min-w-44">
              <div
                className={cn(
                  "text-2xl font-black tracking-tight sm:text-3xl",
                  minutesToNext !== null && minutesToNext < 0 ? "text-rose-500" : "text-foreground"
                )}
              >
                {minutesToNext === null ? "--" : formatMinutes(minutesToNext)}
              </div>
              <div className="mt-2 text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground sm:tracking-[0.25em]">
                delay {delayMinutes} min
              </div>
            </div>
          </div>

          {nextEvent?.transitSteps && nextEvent.transitSteps.length > 0 && (
            <div className="mt-6 grid gap-3 border-t border-border pt-6 sm:mt-8 sm:pt-8 md:grid-cols-2">
              {nextEvent.transitSteps.slice(0, 4).map((step, index) => (
                <div key={`${step.time}-${index}`} className="min-w-0 rounded-2xl border border-border bg-background/60 p-4">
                  <div className="text-[10px] font-black uppercase tracking-widest text-primary">{step.time}</div>
                  <div className="mt-1 break-words font-bold text-foreground">{step.station}</div>
                  <div className="mt-1 text-xs font-medium text-muted-foreground">
                    {[step.lineName, step.duration, step.platform || step.exit].filter(Boolean).join(" / ")}
                  </div>
                </div>
              ))}
            </div>
          )}
        </MagazineCard>

        <MagazineCard className="min-w-0 border-amber-500/20">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-black">
              <ShieldAlert size={22} />
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-black text-foreground">Emergency Card</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground sm:tracking-widest">Offline Ready</p>
            </div>
          </div>
          <div className="space-y-3">
            {emergencySnapshot.hotels.slice(0, 2).map((item) => (
              <a key={item.label} href={item.href || "#"} target="_blank" rel="noreferrer" className="flex min-h-14 items-center gap-3 rounded-2xl border border-border p-4 transition-colors hover:border-primary/40">
                <Hotel size={17} className="shrink-0 text-primary" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold">{item.label}</span>
                  <span className="block truncate text-xs text-muted-foreground">{item.description}</span>
                </span>
                {item.href && <ExternalLink size={14} className="shrink-0 text-muted-foreground" />}
              </a>
            ))}
            {emergencySnapshot.reservations.slice(0, 2).map((item) => (
              <a key={item.label} href={item.href || "#"} target="_blank" rel="noreferrer" className="flex min-h-14 items-center gap-3 rounded-2xl border border-border p-4 transition-colors hover:border-primary/40">
                <Ticket size={17} className="shrink-0 text-primary" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold">{item.label}</span>
                  <span className="block truncate text-xs text-muted-foreground">{item.description}</span>
                </span>
                {item.href && <ExternalLink size={14} className="shrink-0 text-muted-foreground" />}
              </a>
            ))}
            <button onClick={copyEmergencyCard} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-foreground px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-background transition-transform active:scale-[0.98] sm:tracking-widest">
              <Copy size={14} />
              Copy Emergency Memo
            </button>
          </div>
        </MagazineCard>
      </section>

      <section>
        <AdvisorConciergePanel slug={trip.slug} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <MagazineCard className="border-primary/20">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-primary">
            <Sparkles size={13} />
            Morning Briefing
          </div>
          <h3 className="text-2xl font-black text-foreground">今日の持ち物と固定予定</h3>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl bg-secondary/25 p-4">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">Weather</div>
              <div className="mt-2 text-sm font-bold text-foreground">{weatherLabel || "天気情報を確認中"}</div>
            </div>
            <div className="rounded-2xl bg-secondary/25 p-4">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">Fixed Today</div>
              <div className="mt-2 text-sm font-bold text-foreground">
                {briefingEvents.filter((event) => event.isConfirmed).length} 件 / {briefingEvents.length} 件
              </div>
            </div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {packingRecommendations.slice(0, 3).map((item) => (
              <div key={item.name} className="rounded-2xl border border-border bg-background/60 p-4">
                <div className="text-xs font-black text-foreground">{item.name}</div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.reason}</p>
              </div>
            ))}
          </div>
        </MagazineCard>

        <MagazineCard>
          <div className="mb-6 flex items-center gap-3">
            <HeartPulse className="shrink-0 text-rose-500" />
            <h3 className="text-lg font-black">旅の温度ログ</h3>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(TEMPERATURE_MOODS).map(([value, config]) => (
              <button
                key={value}
                onClick={() => setTemperatureMood(value as TemperatureMood)}
                className={cn(
                  "min-h-11 rounded-2xl border px-2 text-[10px] font-black uppercase tracking-[0.12em] transition-colors",
                  temperatureMood === value ? "border-primary bg-primary text-primary-foreground" : "border-border bg-secondary/20"
                )}
              >
                <span className="block text-sm">{config.emoji}</span>
                <span>{config.label}</span>
              </button>
            ))}
          </div>
          <textarea
            value={temperatureNote}
            onChange={(event) => setTemperatureNote(event.target.value)}
            placeholder="いま残したい感情を一言"
            rows={3}
            className="mt-4 w-full rounded-[1.5rem] border border-border bg-background px-4 py-4 text-sm outline-none focus:border-primary"
          />
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={() => setTemperatureRevisit((current) => !current)}
              className={cn(
                "min-h-11 rounded-full border px-4 py-2 text-xs font-black transition-colors",
                temperatureRevisit ? "border-emerald-500 bg-emerald-500 text-white" : "border-border bg-secondary/20 text-muted-foreground"
              )}
            >
              また来たい
            </button>
            <button onClick={saveTemperatureEntry} className="min-h-11 rounded-full bg-foreground px-5 py-2 text-xs font-black uppercase tracking-[0.16em] text-background">
              Save Log
            </button>
          </div>
          <div className="mt-5 rounded-[1.5rem] border border-border bg-secondary/20 p-4 text-sm text-muted-foreground">
            直近ログ {temperatureSummary.highlightedLogs.length} 件。最頻値は <span className="font-black text-foreground">{TEMPERATURE_MOODS[temperatureSummary.topMood].label}</span>。
          </div>
        </MagazineCard>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <MagazineCard className="min-w-0">
          <div className="mb-6 flex items-center gap-3">
            <TimerReset className="shrink-0 text-primary" />
            <h3 className="text-lg font-black">遅延伝播アシスト</h3>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:flex sm:flex-wrap">
            {[0, 10, 15, 30, 45, 60].map((minutes) => (
              <button
                key={minutes}
                onClick={() => setDelayMinutes(minutes)}
                className={cn(
                  "min-h-11 rounded-full border px-3 py-2 text-xs font-black transition-colors sm:px-4",
                  delayMinutes === minutes ? "border-primary bg-primary text-primary-foreground" : "border-border bg-secondary/40"
                )}
              >
                {minutes}分
              </button>
            ))}
          </div>
          <div className="mt-6 rounded-[1.5rem] border border-border bg-secondary/25 p-4 text-sm leading-relaxed text-muted-foreground">
            {delayInsight.narrative}
          </div>
          {delayInsight.conflict && (
            <div className="mt-4 rounded-[1.5rem] border border-rose-500/20 bg-rose-500/5 p-4">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-rose-500">Late Risk</div>
              <div className="mt-2 text-sm font-black text-foreground">{delayInsight.conflict.time} {delayInsight.conflict.title}</div>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">約 {delayInsight.conflict.latenessMinutes} 分遅れの見込みです。</p>
            </div>
          )}
          {delayInsight.recoveryPlans.length > 0 && (
            <div className="mt-4 space-y-3">
              {delayInsight.recoveryPlans.slice(0, 2).map((plan) => (
                <div key={plan.label} className="rounded-2xl border border-border p-4">
                  <div className="text-sm font-black text-foreground">{plan.label}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{plan.recoveredMinutes}分ぶん回復できます。</div>
                </div>
              ))}
            </div>
          )}
          {nextEvent && (
            <button
              onClick={() => setSkippedIds((ids) => (ids.includes(nextEvent.id) ? ids : [...ids, nextEvent.id]))}
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full px-1 text-xs font-black uppercase tracking-[0.12em] text-rose-500 sm:tracking-widest"
            >
              <RotateCcw size={14} />
              この予定をスキップ
            </button>
          )}
        </MagazineCard>

        <MagazineCard className="min-w-0">
          <div className="mb-6 flex items-center gap-3">
            <CloudRain className="shrink-0 text-sky-500" />
            <h3 className="text-lg font-black">AIの代替案提案</h3>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(["rain", "crowd", "tired", "budget"] as Trigger[]).map((trigger) => (
              <button
                key={trigger}
                onClick={() => fetchAlternatives(trigger)}
                className={cn(
                  "min-h-11 rounded-full border px-3 py-2 text-xs font-black transition-colors",
                  aiTrigger === trigger ? "border-primary bg-primary text-primary-foreground" : "border-border bg-secondary/20"
                )}
              >
                {aiFallbackPrompt[trigger]}
              </button>
            ))}
          </div>
          {isAiLoading ? (
            <div className="mt-5 flex min-h-40 items-center justify-center rounded-[1.5rem] border border-border bg-secondary/20 text-muted-foreground">
              <Loader2 size={18} className="animate-spin" />
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {aiSuggestions.length > 0 ? (
                aiSuggestions.map((item) => (
                  <div key={item.title} className="rounded-[1.5rem] border border-border p-4">
                    <div className="text-sm font-black text-foreground">{item.title}</div>
                    <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.reason}</p>
                    <div className="mt-3 text-xs font-bold text-primary">{item.action}</div>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.5rem] border border-border bg-secondary/20 p-4 text-sm leading-relaxed text-muted-foreground">
                  トリガーを押すと、現在の旅程から近い代替案を提案します。
                </div>
              )}
            </div>
          )}
        </MagazineCard>

        <MagazineCard className="min-w-0">
          <div className="mb-6 flex items-center gap-3">
            <ArrowRightLeft className="shrink-0 text-emerald-500" />
            <h3 className="text-lg font-black">共同精算の速報</h3>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-secondary/30 p-4">
              <div className="text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">Total</div>
              <div className="mt-2 text-xl font-black text-foreground">{currency(settlement.total)}</div>
            </div>
            <div className="rounded-2xl bg-emerald-500/10 p-4 text-emerald-600">
              <div className="text-[10px] font-black uppercase tracking-[0.16em]">Balance</div>
              <div className="mt-2 text-sm font-black">{settlement.instruction}</div>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {settlement.expenseEvents.slice(0, 3).map((event) => (
              <div key={event.id} className="rounded-2xl border border-border p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-black text-foreground">{event.title}</div>
                    <div className="text-xs text-muted-foreground">{event.time} / {currency(event.actualExpense || 0)}</div>
                  </div>
                  <Banknote size={16} className="shrink-0 text-emerald-600" />
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {payerLabels.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updatePayer(event.id, option.value)}
                      className={cn(
                        "min-h-10 rounded-full border px-2 text-[10px] font-black transition-colors",
                        (payers[event.id] || "shared") === option.value
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-secondary/20 text-muted-foreground"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </MagazineCard>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <MagazineCard className="min-w-0">
          <div className="mb-6 flex items-center gap-3">
            <Search className="shrink-0 text-primary" />
            <h3 className="text-lg font-black">周辺便利スポット</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {utilityTypes.map((item) => (
              <a
                key={item.label}
                href={mapsSearchUrl(item.query, currentBase)}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-24 flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-secondary/20 p-4 text-center transition-colors hover:border-primary/40 sm:p-5"
              >
                <item.icon size={20} className="text-primary" />
                <span className="text-xs font-black">{item.label}</span>
              </a>
            ))}
          </div>
        </MagazineCard>

        <MagazineCard className="min-w-0">
          <div className="mb-6 flex items-center gap-3">
            <MessageSquarePlus className="shrink-0 text-primary" />
            <h3 className="text-lg font-black">共有メモ / チェックイン</h3>
          </div>
          <div className="flex gap-2">
            <input
              value={noteBody}
              onChange={(event) => setNoteBody(event.target.value)}
              onKeyDown={(event) => event.key === "Enter" && addNote()}
              placeholder="今のメモを残す"
              className="min-h-12 min-w-0 flex-1 rounded-2xl border border-border bg-background px-4 py-3 text-base outline-none focus:border-primary sm:text-sm"
            />
            <button onClick={addNote} className="flex min-h-12 min-w-12 items-center justify-center rounded-2xl bg-primary px-4 text-primary-foreground sm:px-5" aria-label="メモを追加">
              <MessageSquarePlus size={18} />
            </button>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {activeEvents.slice(Math.max(0, nextIndex), Math.max(0, nextIndex) + 4).map((event) => (
              <button
                key={event.id}
                onClick={() => toggleCheckin(event.id)}
                className="flex min-h-16 items-center gap-3 rounded-2xl border border-border p-4 text-left transition-colors hover:border-primary/40"
              >
                <CheckCircle2 className={cn("shrink-0", checkedEventIds.includes(event.id) ? "text-emerald-500" : "text-muted-foreground/40")} />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-bold">{event.time} {event.title}</span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Day {event.dayNumber}</span>
                </span>
              </button>
            ))}
          </div>
          {notes.length > 0 && (
            <div className="mt-6 space-y-2 border-t border-border pt-6">
              {notes.slice(0, 4).map((note) => (
                <div key={note.id} className="break-words rounded-2xl bg-secondary/30 p-4 text-sm font-medium text-muted-foreground">
                  {note.body}
                </div>
              ))}
            </div>
          )}
        </MagazineCard>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <MagazineCard className="min-w-0 lg:col-span-2">
          <div className="mb-6 flex items-center gap-3">
            <CloudRain className="shrink-0 text-primary" />
            <h3 className="text-lg font-black">注意事項</h3>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {warningTips.slice(0, 6).map((tip) => (
              <div key={tip.id} className="min-w-0 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-500" />
                  <div className="min-w-0">
                    <div className="break-words text-sm font-black">{tip.title}</div>
                    <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{tip.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </MagazineCard>

        <MagazineCard className="min-w-0">
          <div className="mb-6 flex items-center gap-3">
            <FileText className="shrink-0 text-primary" />
            <h3 className="text-lg font-black">旅レポート</h3>
          </div>
          <div className="break-words rounded-2xl border border-border bg-secondary/20 p-4 text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap">
            {reportText}
          </div>
          <button
            onClick={downloadReport}
            className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-foreground px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-background sm:tracking-widest"
          >
            <Download size={14} />
            TXTをダウンロード
          </button>
          <a
            href={`/api/trip/${trip.slug}/report`}
            className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-border px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-foreground sm:tracking-widest"
          >
            <FileText size={14} />
            PDFをダウンロード
          </a>
        </MagazineCard>
      </section>

      <section className="rounded-[1.5rem] border border-border bg-secondary/20 p-4 sm:rounded-[2rem] sm:p-5">
        <div className="flex flex-col gap-2 text-xs font-bold leading-relaxed text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          <Smartphone size={16} className="shrink-0 text-primary" />
          <span>このサイトはホーム画面追加とオフラインキャッシュに対応しました。</span>
          <Sparkles size={14} className="hidden shrink-0 text-primary sm:block" />
          <span>緊急カードはこの画面を一度開いておけば、通信が弱い場所でも再表示しやすくなります。</span>
          <Train size={14} className="hidden shrink-0 text-primary sm:block" />
        </div>
      </section>
    </div>
  );
}
