"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Banknote,
  Camera,
  CheckCircle2,
  ChevronRight,
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
  MapPin,
  MessageSquarePlus,
  Navigation,
  Receipt,
  Search,
  ShieldAlert,
  ShieldCheck,
  Smartphone,
  Sparkles,
  StickyNote,
  Sun,
  Ticket,
  TimerReset,
  TrendingUp,
  Users,
  Utensils,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { MagazineCard } from "@/components/ui/MagazineCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  appendTemperatureLog,
  type ExpensePayer,
  loadExpensePayers,
  loadTemperatureLogs,
  saveExpensePayers,
  TEMPERATURE_MOODS,
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
  type InsightEvent,
  type InsightTip,
  summarizeTemperature,
} from "@/features/trip/utils/tripInsights";
import { maskSecretText } from "@/features/trip/utils/tripUtils";
import { cn } from "@/lib/utils";
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
  events: (InsightEvent & { formalName?: string; tag?: string })[];
  tips: InsightTip[];
  isAdmin?: boolean;
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
      rainChance?: number;
      uvIndex?: number;
      windSpeed?: number;
      sunrise?: string;
      sunset?: string;
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
  { label: "ドラッグストア", query: "drugstore", icon: HeartPulse },
  { label: "ATM", query: "ATM", icon: Banknote },
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

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100, damping: 20 } },
};

export default function AssistDashboard({ trip, events, tips, isAdmin = false, weatherData }: AssistDashboardProps) {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [delayMinutes, setDelayMinutes] = useState(0);
  const [skippedIds] = useState<string[]>([]);
  const [noteBody, setNoteBody] = useState("");
  const [activeTab, setActiveTab] = useState("spotlight");

  const [notes, setNotes] = useState<SharedNote[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(window.localStorage.getItem(`memoir:shared-notes:${trip.id}`) || "[]");
    } catch {
      return [];
    }
  });
  const [payers, setPayers] = useState<Record<string, ExpensePayer>>(() =>
    typeof window === "undefined" ? {} : loadExpensePayers(trip.id),
  );
  const [temperatureLogs, setTemperatureLogs] = useState<TemperatureLogEntry[]>(() =>
    typeof window === "undefined" ? [] : loadTemperatureLogs(trip.id),
  );
  const [temperatureMood, setTemperatureMood] = useState<TemperatureMood>("joy");
  const [temperatureNote, setTemperatureNote] = useState("");
  const [temperatureRevisit, setTemperatureRevisit] = useState(false);
  const [aiTrigger, setAiTrigger] = useState<Trigger>("rain");
  const [aiSuggestions, setAiSuggestions] = useState<Array<{ title: string; reason: string; action: string }>>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  const notesKey = `memoir:shared-notes:${trip.id}`;

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    requestAnimationFrame(() => setMounted(true));
    return () => window.clearInterval(timer);
  }, []);

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => (eventDateTime(a)?.getTime() || 0) - (eventDateTime(b)?.getTime() || 0)),
    [events],
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

  const isNextSurprise = !isAdmin && nextEvent?.tag === "surprise";
  const currentBaseRaw =
    nextEvent?.transitSteps?.[0]?.station || nextEvent?.formalName || nextEvent?.title || trip.location;
  const currentBase = maskSecretText(currentBaseRaw, isAdmin);

  const warningTips = tips.filter((tip) => tip.isWarning || tip.category === "Warning");
  const actualTotal = sortedEvents.reduce((sum, event) => sum + (event.actualExpense || 0), 0);
  const delayInsight = computeDelayInsight(activeEvents, nextIndex, delayMinutes);
  const emergencySnapshot = buildEmergencySnapshot(trip, sortedEvents, tips, isAdmin);
  const emergencyMemo = buildEmergencyMemo(trip, emergencySnapshot);
  const settlement = computeSettlement(sortedEvents, payers);
  const temperatureSummary = summarizeTemperature(temperatureLogs);
  const briefingEvents = nextEvent ? sortedEvents.filter((event) => event.dayNumber === nextEvent.dayNumber) : [];
  const packingRecommendations = buildPackingRecommendations(sortedEvents, weatherData ?? null, []);

  const reportText = [
    `${trip.title} 旅メモ`,
    `場所: ${trip.location}`,
    nextEvent
      ? `次の予定: ${nextEvent.time} ${isNextSurprise ? "🎁 Surprise Spot" : maskSecretText(nextEvent.title, isAdmin)}`
      : "",
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

  const copyEmergencyCard = async () => {
    await navigator.clipboard?.writeText(emergencyMemo);
    alert("緊急連絡先をコピーしました");
  };

  const saveTemperatureEntry = () => {
    if (!nextEvent) return;

    const nextLogs = appendTemperatureLog(trip.id, {
      eventId: nextEvent.id,
      eventTitle: isNextSurprise ? "🎁 Surprise Spot" : maskSecretText(nextEvent.title, isAdmin),
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

  const downloadPdf = async () => {
    setIsPdfLoading(true);
    try {
      const [{ pdf }, { default: AssistReportDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("@/features/trip/components/pdf/AssistReportDocument"),
      ]);

      const blob = await pdf(
        <AssistReportDocument
          trip={trip}
          events={sortedEvents}
          tips={tips}
          temperatureLogs={temperatureLogs}
          notes={notes}
          reportText={reportText}
          actualTotal={currency(actualTotal)}
          settlementText={settlement.instruction}
        />,
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${trip.slug}-report.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF download failed", error);
      alert("PDF 生成に失敗しました。");
    } finally {
      setIsPdfLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="flex flex-col gap-6 pb-32 lg:gap-8">
        <div className="bg-background/80 border-border/40 sticky top-0 z-50 -mx-4 border-b px-4 py-3 backdrop-blur-xl">
          <Skeleton className="h-14 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-96 w-full rounded-[2.5rem]" />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Skeleton className="h-64 w-full rounded-[2.5rem]" />
          <Skeleton className="h-64 w-full rounded-[2.5rem]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-32 lg:gap-8">
      {/* --- Sticky Navigation Tabs --- */}
      <div className="bg-background/80 border-border/40 sticky top-0 z-50 -mx-4 border-b px-4 py-3 backdrop-blur-xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="bg-secondary/20 border-border/40 flex w-full justify-between rounded-2xl border p-1">
            <TabsTrigger value="spotlight" className="flex-1 gap-2 rounded-xl py-2.5">
              <Sparkles size={16} />
              <span className="hidden sm:inline">Now</span>
            </TabsTrigger>
            <TabsTrigger value="safety" className="flex-1 gap-2 rounded-xl py-2.5">
              <ShieldAlert size={16} />
              <span className="hidden sm:inline">Safety</span>
            </TabsTrigger>
            <TabsTrigger value="tools" className="flex-1 gap-2 rounded-xl py-2.5">
              <Zap size={16} />
              <span className="hidden sm:inline">Tools</span>
            </TabsTrigger>
            <TabsTrigger value="logistics" className="flex-1 gap-2 rounded-xl py-2.5">
              <Receipt size={16} />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <AnimatePresence mode="wait">
        {/* --- Spotlight Tab: Main Info --- */}
        {activeTab === "spotlight" && (
          <motion.div
            key="spotlight"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="space-y-6"
          >
            {/* Spotlight Hero Section */}
            <motion.div variants={itemVariants}>
              <MagazineCard
                padding="none"
                className="from-primary/5 via-background to-secondary/20 shadow-primary/5 relative overflow-hidden border-none bg-linear-to-br shadow-2xl"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1 p-8 md:p-12">
                    <div className="mb-8 flex items-center gap-4">
                      <div className="bg-primary shadow-primary/20 text-primary-foreground flex h-10 w-10 items-center justify-center rounded-2xl shadow-lg">
                        <Clock size={20} className="animate-pulse" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-primary text-[10px] font-black tracking-[0.2em] uppercase">
                          Next Move
                        </span>
                        <span className="text-muted-foreground text-xs font-bold">
                          Starts in {minutesToNext === null ? "--" : formatMinutes(minutesToNext).replace("あと", "")}
                        </span>
                      </div>
                    </div>

                    <h2 className="font-playfair text-foreground mb-6 text-4xl leading-tight font-black tracking-tight md:text-6xl">
                      {nextEvent ? (isNextSurprise ? "🎁 Surprise Spot" : nextEvent.title) : "予定はありません"}
                    </h2>

                    {nextEvent && (
                      <div className="mb-10 flex flex-wrap gap-3">
                        <span className="bg-secondary/40 text-foreground border-border/40 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-black backdrop-blur-md">
                          <TimerReset size={14} className="text-primary" />
                          {nextEvent.time}
                        </span>
                        <span className="bg-secondary/40 text-foreground border-border/40 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-black backdrop-blur-md">
                          <Sparkles size={14} className="text-amber-500" />
                          Day {nextEvent.dayNumber}
                        </span>
                        {nextEvent.isConfirmed && (
                          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-black text-emerald-600 backdrop-blur-md">
                            <CheckCircle2 size={14} />
                            Reserved
                          </span>
                        )}
                      </div>
                    )}

                    <p className="text-muted-foreground/90 max-w-2xl text-lg leading-relaxed font-medium italic">
                      {isNextSurprise
                        ? "“当日までのお楽しみ。ふたりの特別な時間が待っています。”"
                        : nextEvent?.desc || "この予定の詳細を確認しましょう。"}
                    </p>
                  </div>

                  <div className="bg-secondary/10 border-border/40 flex w-full flex-col justify-between border-t p-8 backdrop-blur-sm md:w-80 md:border-t-0 md:border-l">
                    <div className="space-y-6">
                      <div>
                        <span className="text-muted-foreground mb-2 block text-[10px] font-black tracking-widest uppercase">
                          Location
                        </span>
                        <div className="flex items-center gap-3">
                          <MapPin size={18} className="text-primary" />
                          <span className="text-lg font-black">{currentBase}</span>
                        </div>
                      </div>

                      <div className="border-border/40 border-t pt-6">
                        <span className="text-muted-foreground mb-4 block text-[10px] font-black tracking-widest uppercase">
                          Transit Timeline
                        </span>
                        <div className="space-y-6">
                          {nextEvent?.transitSteps?.slice(0, 3).map((step, idx) => (
                            <div key={`${step.time}-${step.station}`} className="flex items-start gap-4">
                              <div className="flex flex-col items-center">
                                <div className="bg-primary h-2 w-2 rounded-full" />
                                {idx !== 2 && <div className="from-primary h-8 w-px bg-linear-to-b to-transparent" />}
                              </div>
                              <div className="min-w-0">
                                <div className="text-primary text-[10px] font-black">{step.time}</div>
                                <div className="truncate text-xs font-bold">
                                  {maskSecretText(step.station, isAdmin)}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <a
                      href={
                        isNextSurprise
                          ? mapsSearchUrl(currentBase, trip.location)
                          : nextEvent?.locationUrl || mapsSearchUrl(currentBase, trip.location)
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="bg-foreground text-background mt-8 flex w-full items-center justify-center gap-2 rounded-2xl py-4 text-xs font-black tracking-widest uppercase shadow-xl transition-all hover:scale-[1.02] active:scale-95"
                    >
                      <Navigation size={16} />
                      Open in Maps
                    </a>
                  </div>
                </div>
              </MagazineCard>
            </motion.div>

            {/* Weather & Briefing Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <MagazineCard padding="none" className="border-sky-500/10 bg-sky-500/3 p-6 md:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-1.5 text-[10px] font-black tracking-widest text-sky-600 uppercase">
                    <CloudRain size={13} />
                    Briefing
                  </div>
                  <Sun size={20} className="text-amber-500" />
                </div>
                <h3 className="mb-4 text-2xl font-black">今日の持ち物</h3>
                <div className="space-y-3">
                  {packingRecommendations.length > 0 ? (
                    packingRecommendations.slice(0, 3).map((item) => (
                      <div
                        key={item.name}
                        className="dark:bg-card/40 flex items-center gap-3 rounded-2xl border border-sky-500/5 bg-white/50 p-3"
                      >
                        <div className="h-2 w-2 rounded-full bg-sky-400" />
                        <span className="text-foreground text-sm font-bold">{item.name}</span>
                        <span className="text-muted-foreground ml-auto text-[10px]">{item.reason}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-sm">特に追加の持ち物はありません。</p>
                  )}
                </div>
              </MagazineCard>

              <MagazineCard padding="none" className="from-background to-secondary/10 bg-linear-to-br p-6 md:p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div className="bg-secondary/60 text-muted-foreground border-border/40 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[10px] font-black tracking-widest uppercase">
                    <Clock size={13} />
                    Current Status
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm font-bold">今日の予定</span>
                    <span className="text-xl font-black">{briefingEvents.length} 件</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-sm font-bold">予約確定済み</span>
                    <span className="text-xl font-black text-emerald-600">
                      {briefingEvents.filter((e) => e.isConfirmed).length} 件
                    </span>
                  </div>
                  <div className="border-border/40 border-t pt-4">
                    <div className="text-primary flex items-center gap-2 text-[10px] font-black tracking-widest uppercase">
                      <TrendingUp size={12} />
                      Next Step Insight
                    </div>
                    <p className="text-muted-foreground mt-2 text-sm leading-relaxed font-medium">
                      {delayInsight.narrative}
                    </p>
                  </div>
                </div>
              </MagazineCard>
            </motion.div>

            {/* AI Advisor Panel */}
            <motion.div variants={itemVariants}>
              <AdvisorConciergePanel slug={trip.slug} />
            </motion.div>
          </motion.div>
        )}

        {/* --- Safety Tab: Emergency & Warnings --- */}
        {activeTab === "safety" && (
          <motion.div
            key="safety"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <MagazineCard padding="none" className="overflow-hidden border-rose-500/20 bg-rose-500/2">
                <div className="bg-rose-500 p-8 text-white">
                  <div className="mb-6 flex items-center justify-between">
                    <ShieldAlert size={32} />
                    <button
                      type="button"
                      onClick={copyEmergencyCard}
                      className="rounded-xl bg-white/20 p-2 transition-colors hover:bg-white/30"
                    >
                      <Copy size={20} />
                    </button>
                  </div>
                  <h3 className="text-3xl font-black tracking-tight">Emergency Card</h3>
                  <p className="mt-2 text-sm font-bold tracking-widest text-rose-100 uppercase opacity-80">
                    緊急時の重要情報
                  </p>
                </div>

                <div className="space-y-8 p-8">
                  {emergencySnapshot.hotels.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-rose-600 uppercase">
                        <Hotel size={14} />
                        Hotels
                      </div>
                      <div className="grid gap-3">
                        {emergencySnapshot.hotels.map((item) => (
                          <a
                            key={item.label}
                            href={item.href || "#"}
                            target="_blank"
                            rel="noreferrer"
                            className="group flex items-center gap-4 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm transition-all hover:border-rose-300"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="text-foreground font-bold">{item.label}</div>
                              <div className="text-muted-foreground truncate text-xs">{item.description}</div>
                            </div>
                            <ExternalLink
                              size={14}
                              className="text-muted-foreground transition-colors group-hover:text-rose-500"
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {emergencySnapshot.reservations.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-rose-600 uppercase">
                        <Ticket size={14} />
                        Reservations
                      </div>
                      <div className="grid gap-3">
                        {emergencySnapshot.reservations.map((item) => (
                          <a
                            key={item.label}
                            href={item.href || "#"}
                            target="_blank"
                            rel="noreferrer"
                            className="group flex items-center gap-4 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm transition-all hover:border-rose-300"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="text-foreground font-bold">{item.label}</div>
                              <div className="text-muted-foreground truncate text-xs">{item.description}</div>
                            </div>
                            <ExternalLink
                              size={14}
                              className="text-muted-foreground transition-colors group-hover:text-rose-500"
                            />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="border-t border-rose-100 bg-rose-50 p-4 text-center">
                  <p className="text-[10px] font-bold text-rose-500">オフラインでもこの情報は保持されます</p>
                </div>
              </MagazineCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="mb-4 px-2 text-lg font-black">注意事項・Tips</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {warningTips.map((tip) => (
                  <MagazineCard key={tip.id} className="border-amber-500/20 bg-amber-500/5 p-6">
                    <div className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500/20 text-amber-600">
                        <AlertTriangle size={20} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-foreground mb-1 font-black">{tip.title}</div>
                        <p className="text-muted-foreground text-xs leading-relaxed">{tip.body}</p>
                      </div>
                    </div>
                  </MagazineCard>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* --- Tools Tab: AI, Delay, Utilities --- */}
        {activeTab === "tools" && (
          <motion.div
            key="tools"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="space-y-6"
          >
            {/* Delay & AI Row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <motion.div variants={itemVariants}>
                <MagazineCard
                  padding="none"
                  className={cn(
                    "h-full border-l-4 p-8 transition-colors",
                    delayMinutes === 0 ? "border-emerald-500 bg-emerald-500/2" : "border-rose-500 bg-rose-500/2",
                  )}
                >
                  <div className="mb-8 flex items-center gap-3">
                    <div
                      className={cn(
                        "rounded-2xl p-3 text-white",
                        delayMinutes === 0 ? "bg-emerald-500" : "bg-rose-500",
                      )}
                    >
                      <TimerReset size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black">遅延アシスト</h3>
                      <span className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
                        Adjust Timeline
                      </span>
                    </div>
                  </div>

                  <div className="mb-8 flex flex-wrap gap-2">
                    {[0, 15, 30, 45, 60].map((mins) => (
                      <button
                        type="button"
                        key={mins}
                        onClick={() => setDelayMinutes(mins)}
                        className={cn(
                          "min-w-12 flex-1 rounded-2xl border py-3 text-xs font-black transition-all active:scale-95",
                          delayMinutes === mins
                            ? "bg-foreground text-background border-foreground shadow-lg"
                            : "border-border text-muted-foreground hover:border-primary bg-white",
                        )}
                      >
                        {mins}分
                      </button>
                    ))}
                  </div>

                  <div className="border-border text-muted-foreground rounded-2xl border bg-white p-4 text-sm leading-relaxed shadow-sm">
                    {delayInsight.narrative}
                  </div>
                </MagazineCard>
              </motion.div>

              <motion.div variants={itemVariants}>
                <MagazineCard padding="none" className="border-primary/20 bg-primary/2 h-full p-8">
                  <div className="mb-8 flex items-center gap-3">
                    <div className="bg-primary text-primary-foreground rounded-2xl p-3">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black">AI 代替案</h3>
                      <span className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
                        Smart Rescheduling
                      </span>
                    </div>
                  </div>

                  <div className="mb-6 grid grid-cols-2 gap-2">
                    {(["rain", "crowd", "tired", "budget"] as Trigger[]).map((t) => (
                      <button
                        type="button"
                        key={t}
                        onClick={() => fetchAlternatives(t)}
                        className={cn(
                          "flex flex-col items-center justify-center gap-1 rounded-2xl border py-4 transition-all active:scale-95",
                          aiTrigger === t
                            ? "bg-primary text-primary-foreground border-primary shadow-lg"
                            : "border-border text-muted-foreground hover:border-primary bg-white",
                        )}
                      >
                        {t === "rain" && <CloudRain size={16} />}
                        {t === "crowd" && <Users size={16} />}
                        {t === "tired" && <HeartPulse size={16} />}
                        {t === "budget" && <Banknote size={16} />}
                        <span className="text-[10px] font-black tracking-widest uppercase">{t}</span>
                      </button>
                    ))}
                  </div>

                  {isAiLoading ? (
                    <div className="border-border flex flex-col items-center justify-center rounded-2xl border border-dashed bg-white/50 p-8">
                      <Loader2 size={24} className="text-primary animate-spin" />
                    </div>
                  ) : aiSuggestions.length > 0 ? (
                    <div className="space-y-3">
                      {aiSuggestions.slice(0, 1).map((s) => (
                        <div key={s.title} className="border-primary/10 rounded-2xl border bg-white p-5 shadow-sm">
                          <div className="text-foreground mb-2 text-sm font-black">{s.title}</div>
                          <p className="text-muted-foreground text-xs leading-relaxed">{s.reason}</p>
                          <div className="border-border/50 text-primary mt-4 flex items-center gap-2 border-t pt-4 text-xs font-bold">
                            <ChevronRight size={14} /> {s.action}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground py-4 text-center text-xs">トリガーを選択して代替案を表示</p>
                  )}
                </MagazineCard>
              </motion.div>
            </div>

            {/* Dynamic Quick Views */}
            <motion.div variants={itemVariants}>
              <h3 className="mb-4 px-2 text-lg font-black">Quick Views</h3>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Link
                  href={`/trip/${trip.slug}/category/food`}
                  className="border-border hover:border-primary flex flex-col items-center justify-center gap-2 rounded-3xl border bg-white p-4 shadow-sm transition-all active:scale-95"
                >
                  <Utensils size={20} className="text-rose-500" />
                  <span className="text-center text-[10px] font-black tracking-widest uppercase">Gourmet</span>
                </Link>
                <Link
                  href={`/trip/${trip.slug}/category/sightseeing`}
                  className="border-border hover:border-primary flex flex-col items-center justify-center gap-2 rounded-3xl border bg-white p-4 shadow-sm transition-all active:scale-95"
                >
                  <Camera size={20} className="text-sky-500" />
                  <span className="text-center text-[10px] font-black tracking-widest uppercase">Spots</span>
                </Link>
                <Link
                  href={`/trip/${trip.slug}/checklist/essential`}
                  className="border-border hover:border-primary flex flex-col items-center justify-center gap-2 rounded-3xl border bg-white p-4 shadow-sm transition-all active:scale-95"
                >
                  <ShieldCheck size={20} className="text-emerald-500" />
                  <span className="text-center text-[10px] font-black tracking-widest uppercase">Packing</span>
                </Link>
                <Link
                  href={`/trip/${trip.slug}/checklist/gadget`}
                  className="border-border hover:border-primary flex flex-col items-center justify-center gap-2 rounded-3xl border bg-white p-4 shadow-sm transition-all active:scale-95"
                >
                  <Smartphone size={20} className="text-indigo-500" />
                  <span className="text-center text-[10px] font-black tracking-widest uppercase">Gadgets</span>
                </Link>
              </div>
            </motion.div>

            {/* Utility Spots */}
            <motion.div variants={itemVariants}>
              <MagazineCard padding="none" className="p-8">
                <div className="mb-8 flex items-center gap-3">
                  <div className="bg-secondary/60 rounded-2xl p-3">
                    <Search size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black">周辺便利スポット</h3>
                    <span className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
                      Near {trip.location}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {utilityTypes.map((item) => (
                    <a
                      key={item.label}
                      href={mapsSearchUrl(item.query, trip.location)}
                      target="_blank"
                      rel="noreferrer"
                      className="group border-border hover:border-primary flex flex-col items-center gap-3 rounded-3xl border bg-white p-6 shadow-sm transition-all active:scale-95"
                    >
                      <item.icon size={24} className="text-primary transition-transform group-hover:scale-110" />
                      <span className="text-xs font-black">{item.label}</span>
                    </a>
                  ))}
                </div>

                <div className="border-border/40 mt-8 border-t pt-8">
                  <div className="mb-4 flex items-center gap-2">
                    <Navigation size={14} className="text-primary" />
                    <span className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
                      Current Context Search
                    </span>
                  </div>
                  <div className="no-scrollbar -mx-2 flex gap-3 overflow-x-auto px-2 pb-2">
                    {["レストラン", "カフェ", "駅", "展望台", "お土産"].map((q) => (
                      <a
                        key={q}
                        href={mapsSearchUrl(q, currentBase)}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-secondary/30 border-border text-muted-foreground hover:bg-primary/5 hover:text-primary shrink-0 rounded-2xl border px-5 py-3 text-[10px] font-black tracking-widest whitespace-nowrap uppercase transition-all"
                      >
                        {q} near {currentBase}
                      </a>
                    ))}
                  </div>
                </div>
              </MagazineCard>
            </motion.div>
          </motion.div>
        )}

        {/* --- Logistics Tab: Expense, Memo, Reports --- */}
        {activeTab === "logistics" && (
          <motion.div
            key="logistics"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="space-y-6"
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Expense Card */}
              <motion.div variants={itemVariants}>
                <MagazineCard padding="none" className="border-emerald-500/20 bg-emerald-500/2 p-8">
                  <div className="mb-8 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-2xl bg-emerald-500 p-3 text-white shadow-lg shadow-emerald-500/20">
                        <Banknote size={20} />
                      </div>
                      <h3 className="text-xl font-black">共同精算</h3>
                    </div>
                    <Receipt size={20} className="text-emerald-500/40" />
                  </div>

                  <div className="mb-8 grid grid-cols-2 gap-4">
                    <div className="rounded-3xl border border-emerald-100 bg-white p-5 shadow-sm">
                      <span className="text-muted-foreground mb-1 block text-[10px] font-black tracking-widest uppercase">
                        Total Spent
                      </span>
                      <span className="text-foreground text-xl font-black">{currency(settlement.total)}</span>
                    </div>
                    <div className="rounded-3xl bg-emerald-500 p-5 text-white shadow-lg shadow-emerald-500/10">
                      <span className="mb-1 block text-[10px] font-black tracking-widest text-emerald-100 uppercase">
                        Settlement
                      </span>
                      <span className="line-clamp-2 text-xs leading-tight font-bold">{settlement.instruction}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {settlement.expenseEvents.slice(0, 3).map((e) => (
                      <div key={e.id} className="border-border rounded-2xl border bg-white p-4">
                        <div className="mb-4 flex items-center justify-between">
                          <span className="max-w-37.5 truncate text-sm font-black">
                            {maskSecretText(e.title, isAdmin)}
                          </span>
                          <span className="text-xs font-bold text-emerald-600">{currency(e.actualExpense || 0)}</span>
                        </div>
                        <div className="flex gap-2">
                          {payerLabels.map((p) => (
                            <button
                              type="button"
                              key={p.value}
                              onClick={() => updatePayer(e.id, p.value)}
                              className={cn(
                                "flex-1 rounded-xl py-2 text-[10px] font-black transition-all",
                                (payers[e.id] || "shared") === p.value
                                  ? "bg-emerald-500 text-white shadow-md"
                                  : "bg-secondary/40 text-muted-foreground hover:bg-secondary/60",
                              )}
                            >
                              {p.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </MagazineCard>
              </motion.div>

              {/* Memory Log & Memo */}
              <motion.div variants={itemVariants} className="space-y-6">
                <MagazineCard padding="none" className="p-8">
                  <div className="mb-8 flex items-center gap-3">
                    <HeartPulse size={24} className="text-rose-500" />
                    <h3 className="text-xl font-black">旅の温度ログ</h3>
                  </div>
                  <div className="mb-6 flex justify-between gap-2">
                    {Object.entries(TEMPERATURE_MOODS).map(([val, cfg]) => (
                      <button
                        type="button"
                        key={val}
                        onClick={() => setTemperatureMood(val as TemperatureMood)}
                        className={cn(
                          "flex flex-1 flex-col items-center justify-center rounded-2xl border p-3 transition-all active:scale-90",
                          temperatureMood === val
                            ? "border-rose-500 bg-rose-500 text-white shadow-lg"
                            : "border-border bg-white grayscale hover:grayscale-0",
                        )}
                      >
                        <span className="mb-1 text-2xl">{cfg.emoji}</span>
                        <span className="text-[8px] font-black tracking-widest uppercase">{cfg.label}</span>
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={temperatureNote}
                    onChange={(e) => setTemperatureNote(e.target.value)}
                    placeholder="いまの気持ちを一言..."
                    className="border-border bg-secondary/10 h-24 w-full resize-none rounded-2xl border p-4 text-sm transition-all outline-none focus:border-rose-500/50"
                  />
                  <button
                    type="button"
                    onClick={saveTemperatureEntry}
                    className="bg-foreground text-background mt-4 w-full rounded-2xl py-4 text-xs font-black tracking-widest uppercase shadow-xl transition-all hover:scale-[1.02] active:scale-95"
                  >
                    Save Log
                  </button>
                </MagazineCard>

                <MagazineCard padding="none" className="p-8">
                  <div className="mb-6 flex items-center gap-3">
                    <StickyNote size={24} className="text-amber-500" />
                    <h3 className="text-xl font-black">共有メモ</h3>
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={noteBody}
                      onChange={(e) => setNoteBody(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addNote()}
                      placeholder="ふたりのメモを記録"
                      className="border-border bg-secondary/10 flex-1 rounded-2xl border px-4 py-3 text-sm outline-none focus:border-amber-500/50"
                    />
                    <button
                      type="button"
                      onClick={addNote}
                      className="rounded-2xl bg-amber-500 p-4 text-white shadow-lg shadow-amber-500/20 active:scale-95"
                    >
                      <MessageSquarePlus size={20} />
                    </button>
                  </div>
                </MagazineCard>
              </motion.div>
            </div>

            {/* Reports Section */}
            <motion.div variants={itemVariants}>
              <MagazineCard padding="none" className="from-background to-secondary/10 bg-linear-to-br p-8">
                <div className="flex flex-col items-start gap-8 md:flex-row">
                  <div className="min-w-0 flex-1">
                    <div className="mb-6 flex items-center gap-3">
                      <FileText size={24} className="text-primary" />
                      <h3 className="text-xl font-black">旅レポート・書き出し</h3>
                    </div>
                    <div className="border-border text-muted-foreground no-scrollbar max-h-48 overflow-y-auto rounded-3xl border bg-white/80 p-6 text-xs leading-relaxed whitespace-pre-wrap shadow-inner backdrop-blur-sm">
                      {reportText}
                    </div>
                  </div>
                  <div className="w-full space-y-3 md:w-64">
                    <button
                      type="button"
                      onClick={downloadReport}
                      className="bg-secondary/40 border-border hover:bg-secondary/60 flex w-full items-center justify-center gap-3 rounded-2xl border py-4 text-xs font-black tracking-widest uppercase transition-colors"
                    >
                      <Download size={16} /> TXT Export
                    </button>
                    <button
                      type="button"
                      onClick={downloadPdf}
                      disabled={isPdfLoading}
                      className="bg-foreground text-background flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-xs font-black tracking-widest uppercase shadow-xl transition-all hover:scale-[1.02] active:scale-95"
                    >
                      {isPdfLoading ? <Loader2 className="animate-spin" size={16} /> : <FileText size={16} />}
                      PDF Export
                    </button>
                  </div>
                </div>
              </MagazineCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Footer Status Tip --- */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="border-border/40 bg-secondary/5 rounded-[2.5rem] border p-6 backdrop-blur-md"
      >
        <div className="text-muted-foreground flex items-center gap-4 text-[10px] leading-relaxed font-bold">
          <Smartphone size={16} className="text-primary animate-bounce" />
          <span>ホーム画面に追加すると、オフラインでも緊急カードが快適に動作します。</span>
        </div>
      </motion.section>
    </div>
  );
}
