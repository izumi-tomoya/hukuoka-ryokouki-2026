'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MagazineCard } from '@/components/ui/MagazineCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils';
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
  Sun,
  Sunrise,
  Sunset,
  Ticket,
  TimerReset,
  Train,
  Umbrella,
  Users,
  Wind,
  Zap,
  MapPin,
  ChevronRight,
  TrendingUp,
  Receipt,
  StickyNote,
} from 'lucide-react';
import {
  appendTemperatureLog,
  loadExpensePayers,
  loadTemperatureLogs,
  saveExpensePayers,
  TEMPERATURE_MOODS,
  type ExpensePayer,
  type TemperatureLogEntry,
  type TemperatureMood,
} from '@/features/trip/utils/clientTripStorage';
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
} from '@/features/trip/utils/tripInsights';
import AdvisorConciergePanel from './AdvisorConciergePanel';

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

type Trigger = 'rain' | 'crowd' | 'tired' | 'budget';

const utilityTypes = [
  { label: 'コンビニ', query: 'convenience store', icon: Coffee },
  { label: 'トイレ', query: 'public toilet', icon: ShieldAlert },
  { label: 'ロッカー', query: 'coin locker', icon: Ticket },
  { label: 'タクシー', query: 'taxi stand', icon: Navigation },
];

const payerLabels: Array<{ value: ExpensePayer; label: string }> = [
  { value: 'you', label: '自分' },
  { value: 'partner', label: '相手' },
  { value: 'shared', label: '折半' },
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
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
};

export default function AssistDashboard({
  trip,
  events,
  tips,
  isAdmin = false,
  weatherLabel,
  weatherData,
}: AssistDashboardProps) {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [delayMinutes, setDelayMinutes] = useState(0);
  const [skippedIds, setSkippedIds] = useState<string[]>([]);
  const [noteBody, setNoteBody] = useState('');
  const [activeTab, setActiveTab] = useState('spotlight');
  
  const [notes, setNotes] = useState<SharedNote[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(window.localStorage.getItem(`memoir:shared-notes:${trip.id}`) || '[]');
    } catch {
      return [];
    }
  });
  const [checkedEventIds, setCheckedEventIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(window.localStorage.getItem(`memoir:event-checkins:${trip.id}`) || '[]');
    } catch {
      return [];
    }
  });
  const [payers, setPayers] = useState<Record<string, ExpensePayer>>(() =>
    typeof window === 'undefined' ? {} : loadExpensePayers(trip.id)
  );
  const [temperatureLogs, setTemperatureLogs] = useState<TemperatureLogEntry[]>(() =>
    typeof window === 'undefined' ? [] : loadTemperatureLogs(trip.id)
  );
  const [temperatureMood, setTemperatureMood] = useState<TemperatureMood>('joy');
  const [temperatureNote, setTemperatureNote] = useState('');
  const [temperatureRevisit, setTemperatureRevisit] = useState(false);
  const [aiTrigger, setAiTrigger] = useState<Trigger>('rain');
  const [aiSuggestions, setAiSuggestions] = useState<
    Array<{ title: string; reason: string; action: string }>
  >([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(false);

  const notesKey = `memoir:shared-notes:${trip.id}`;
  const checkinsKey = `memoir:event-checkins:${trip.id}`;

  useEffect(() => {
    setMounted(true);
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  const sortedEvents = useMemo(
    () =>
      [...events].sort(
        (a, b) => (eventDateTime(a)?.getTime() || 0) - (eventDateTime(b)?.getTime() || 0)
      ),
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
  const minutesToNext = nextTime
    ? Math.round((nextTime.getTime() - now.getTime()) / 60_000) - delayMinutes
    : null;

  const isNextSurprise = !isAdmin && nextEvent?.tag === 'surprise';
  const currentBase = nextEvent?.transitSteps?.[0]?.station || nextEvent?.formalName || nextEvent?.title || trip.location;
  
  const warningTips = tips.filter((tip) => tip.isWarning || tip.category === 'Warning');
  const actualTotal = sortedEvents.reduce((sum, event) => sum + (event.actualExpense || 0), 0);
  const delayInsight = computeDelayInsight(activeEvents, nextIndex, delayMinutes);
  const emergencySnapshot = buildEmergencySnapshot(trip, sortedEvents, tips, isAdmin);
  const emergencyMemo = buildEmergencyMemo(trip, emergencySnapshot);
  const settlement = computeSettlement(sortedEvents, payers);
  const temperatureSummary = summarizeTemperature(temperatureLogs);
  const briefingEvents = nextEvent
    ? sortedEvents.filter((event) => event.dayNumber === nextEvent.dayNumber)
    : [];
  const packingRecommendations = buildPackingRecommendations(sortedEvents, weatherData ?? null, []);

  const reportText = [
    `${trip.title} 旅メモ`,
    `場所: ${trip.location}`,
    nextEvent ? `次の予定: ${nextEvent.time} ${nextEvent.title}` : '',
    `実績支出: ${currency(actualTotal)}`,
    `精算: ${settlement.instruction}`,
    `温度ログ: ${temperatureSummary.highlightedLogs.length}件`,
    ...notes.slice(0, 4).map((note) => `- ${note.body}`),
  ]
    .filter(Boolean)
    .join('\n');

  const addNote = () => {
    const body = noteBody.trim();
    if (!body) return;

    const nextNotes = [
      { id: crypto.randomUUID(), body, createdAt: new Date().toISOString() },
      ...notes,
    ].slice(0, 20);
    setNotes(nextNotes);
    setNoteBody('');
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
    alert('緊急連絡先をコピーしました');
  };

  const saveTemperatureEntry = () => {
    if (!nextEvent) return;

    const nextLogs = appendTemperatureLog(trip.id, {
      eventId: nextEvent.id,
      eventTitle: nextEvent.title,
      eventTime: nextEvent.time,
      dayNumber: nextEvent.dayNumber,
      mood: temperatureMood,
      energy: temperatureMood === 'tired' ? 2 : temperatureMood === 'joy' ? 5 : 4,
      revisit: temperatureRevisit || temperatureMood === 'again',
      note: temperatureNote.trim() || undefined,
    });

    setTemperatureLogs(nextLogs);
    setTemperatureNote('');
    setTemperatureMood('joy');
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
      const response = await fetch('/api/ai/alternatives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: trip.slug,
          trigger,
          delayMinutes,
        }),
      });

      const data = await response.json();
      setAiSuggestions(Array.isArray(data.suggestions) ? data.suggestions : []);
    } catch (error) {
      console.error('Failed to fetch AI alternatives', error);
      setAiSuggestions([]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const downloadReport = () => {
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${trip.slug}-assist-report.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const downloadPdf = async () => {
    setIsPdfLoading(true);
    try {
      const [{ pdf }, { default: AssistReportDocument }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('@/features/trip/components/pdf/AssistReportDocument'),
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
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${trip.slug}-report.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('PDF download failed', error);
      alert('PDF 生成に失敗しました。');
    } finally {
      setIsPdfLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="flex flex-col gap-6 lg:gap-8 pb-32">
        <div className="sticky top-0 z-50 -mx-4 px-4 py-3 backdrop-blur-xl bg-background/80 border-b border-border/40">
          <Skeleton className="w-full h-14 rounded-2xl" />
        </div>
        <Skeleton className="w-full h-96 rounded-[2.5rem]" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="w-full h-64 rounded-[2.5rem]" />
          <Skeleton className="w-full h-64 rounded-[2.5rem]" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 lg:gap-8 pb-32">
      {/* --- Sticky Navigation Tabs --- */}
      <div className="sticky top-0 z-50 -mx-4 px-4 py-3 backdrop-blur-xl bg-background/80 border-b border-border/40">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full flex justify-between bg-secondary/20 p-1 rounded-2xl border border-border/40">
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
        {activeTab === 'spotlight' && (
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
              <MagazineCard padding="none" className="relative overflow-hidden border-none bg-linear-to-br from-primary/5 via-background to-secondary/20 shadow-2xl shadow-primary/5">
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1 p-8 md:p-12">
                    <div className="mb-8 flex items-center gap-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20 text-primary-foreground">
                        <Clock size={20} className="animate-pulse" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Next Move</span>
                        <span className="text-xs font-bold text-muted-foreground">Starts in {minutesToNext === null ? '--' : formatMinutes(minutesToNext).replace('あと', '')}</span>
                      </div>
                    </div>

                    <h2 className="font-playfair text-4xl md:text-6xl font-black leading-tight text-foreground tracking-tight mb-6">
                      {nextEvent ? (isNextSurprise ? '🎁 Surprise Spot' : nextEvent.title) : '予定はありません'}
                    </h2>

                    {nextEvent && (
                      <div className="flex flex-wrap gap-3 mb-10">
                        <span className="inline-flex items-center gap-2 rounded-full bg-secondary/40 px-4 py-2 text-xs font-black text-foreground border border-border/40 backdrop-blur-md">
                          <TimerReset size={14} className="text-primary" />
                          {nextEvent.time}
                        </span>
                        <span className="inline-flex items-center gap-2 rounded-full bg-secondary/40 px-4 py-2 text-xs font-black text-foreground border border-border/40 backdrop-blur-md">
                          <Sparkles size={14} className="text-amber-500" />
                          Day {nextEvent.dayNumber}
                        </span>
                        {nextEvent.isConfirmed && (
                          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-black text-emerald-600 border border-emerald-500/20 backdrop-blur-md">
                            <CheckCircle2 size={14} />
                            Reserved
                          </span>
                        )}
                      </div>
                    )}

                    <p className="max-w-2xl text-lg text-muted-foreground/90 font-medium leading-relaxed italic">
                      {isNextSurprise 
                        ? '“当日までのお楽しみ。ふたりの特別な時間が待っています。”' 
                        : (nextEvent?.desc || 'この予定の詳細を確認しましょう。')}
                    </p>
                  </div>

                  <div className="w-full md:w-80 bg-secondary/10 backdrop-blur-sm border-t md:border-t-0 md:border-l border-border/40 p-8 flex flex-col justify-between">
                    <div className="space-y-6">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-2">Location</span>
                        <div className="flex items-center gap-3">
                          <MapPin size={18} className="text-primary" />
                          <span className="font-black text-lg">{currentBase}</span>
                        </div>
                      </div>
                      
                      <div className="pt-6 border-t border-border/40">
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-4">Transit Timeline</span>
                        <div className="space-y-6">
                          {nextEvent?.transitSteps?.slice(0, 3).map((step, idx) => (
                            <div key={idx} className="flex gap-4 items-start">
                              <div className="flex flex-col items-center">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                {idx !== 2 && <div className="w-px h-8 bg-linear-to-b from-primary to-transparent" />}
                              </div>
                              <div className="min-w-0">
                                <div className="text-[10px] font-black text-primary">{step.time}</div>
                                <div className="text-xs font-bold truncate">{step.station}</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <a
                      href={nextEvent?.locationUrl || mapsSearchUrl(currentBase, trip.location)}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-8 flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-foreground text-background text-xs font-black uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02] active:scale-95"
                    >
                      <Navigation size={16} />
                      Open in Maps
                    </a>
                  </div>
                </div>
              </MagazineCard>
            </motion.div>

            {/* Weather & Briefing Grid */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <MagazineCard padding="none" className="bg-sky-500/[0.03] border-sky-500/10 p-6 md:p-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-sky-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-sky-600 border border-sky-500/20">
                    <CloudRain size={13} />
                    Briefing
                  </div>
                  <Sun size={20} className="text-amber-500" />
                </div>
                <h3 className="text-2xl font-black mb-4">今日の持ち物</h3>
                <div className="space-y-3">
                  {packingRecommendations.length > 0 ? (
                    packingRecommendations.slice(0, 3).map((item) => (
                      <div key={item.name} className="flex items-center gap-3 p-3 rounded-2xl bg-white/50 border border-sky-500/5 dark:bg-card/40">
                        <div className="h-2 w-2 rounded-full bg-sky-400" />
                        <span className="text-sm font-bold text-foreground">{item.name}</span>
                        <span className="text-[10px] text-muted-foreground ml-auto">{item.reason}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">特に追加の持ち物はありません。</p>
                  )}
                </div>
              </MagazineCard>

              <MagazineCard padding="none" className="p-6 md:p-8 bg-linear-to-br from-background to-secondary/10">
                <div className="flex items-center justify-between mb-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-secondary/60 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-muted-foreground border border-border/40">
                    <Clock size={13} />
                    Current Status
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-muted-foreground">今日の予定</span>
                    <span className="text-xl font-black">{briefingEvents.length} 件</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-muted-foreground">予約確定済み</span>
                    <span className="text-xl font-black text-emerald-600">{briefingEvents.filter(e => e.isConfirmed).length} 件</span>
                  </div>
                  <div className="pt-4 border-t border-border/40">
                    <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-widest">
                      <TrendingUp size={12} />
                      Next Step Insight
                    </div>
                    <p className="mt-2 text-sm font-medium text-muted-foreground leading-relaxed">
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
        {activeTab === 'safety' && (
          <motion.div
            key="safety"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="space-y-6"
          >
            <motion.div variants={itemVariants}>
              <MagazineCard padding="none" className="border-rose-500/20 bg-rose-500/[0.02] overflow-hidden">
                <div className="bg-rose-500 p-8 text-white">
                  <div className="flex items-center justify-between mb-6">
                    <ShieldAlert size={32} />
                    <button onClick={copyEmergencyCard} className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-colors">
                      <Copy size={20} />
                    </button>
                  </div>
                  <h3 className="text-3xl font-black tracking-tight">Emergency Card</h3>
                  <p className="mt-2 text-sm font-bold text-rose-100 opacity-80 uppercase tracking-widest">緊急時の重要情報</p>
                </div>
                
                <div className="p-8 space-y-8">
                  {emergencySnapshot.hotels.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-rose-600">
                        <Hotel size={14} />
                        Hotels
                      </div>
                      <div className="grid gap-3">
                        {emergencySnapshot.hotels.map((item) => (
                          <a key={item.label} href={item.href || '#'} target="_blank" rel="noreferrer" className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-rose-100 hover:border-rose-300 transition-all shadow-sm">
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-foreground">{item.label}</div>
                              <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                            </div>
                            <ExternalLink size={14} className="text-muted-foreground group-hover:text-rose-500 transition-colors" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {emergencySnapshot.reservations.length > 0 && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-rose-600">
                        <Ticket size={14} />
                        Reservations
                      </div>
                      <div className="grid gap-3">
                        {emergencySnapshot.reservations.map((item) => (
                          <a key={item.label} href={item.href || '#'} target="_blank" rel="noreferrer" className="group flex items-center gap-4 p-4 rounded-2xl bg-white border border-rose-100 hover:border-rose-300 transition-all shadow-sm">
                            <div className="min-w-0 flex-1">
                              <div className="font-bold text-foreground">{item.label}</div>
                              <div className="text-xs text-muted-foreground truncate">{item.description}</div>
                            </div>
                            <ExternalLink size={14} className="text-muted-foreground group-hover:text-rose-500 transition-colors" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <div className="bg-rose-50 p-4 text-center border-t border-rose-100">
                  <p className="text-[10px] font-bold text-rose-500">オフラインでもこの情報は保持されます</p>
                </div>
              </MagazineCard>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h3 className="text-lg font-black px-2 mb-4">注意事項・Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {warningTips.map((tip) => (
                  <MagazineCard key={tip.id} className="border-amber-500/20 bg-amber-500/5 p-6">
                    <div className="flex gap-4">
                      <div className="h-10 w-10 shrink-0 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-600">
                        <AlertTriangle size={20} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-black text-foreground mb-1">{tip.title}</div>
                        <p className="text-xs text-muted-foreground leading-relaxed">{tip.body}</p>
                      </div>
                    </div>
                  </MagazineCard>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* --- Tools Tab: AI, Delay, Utilities --- */}
        {activeTab === 'tools' && (
          <motion.div
            key="tools"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="space-y-6"
          >
            {/* Delay & AI Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div variants={itemVariants}>
                <MagazineCard padding="none" className={cn(
                  "h-full border-l-4 transition-colors p-8",
                  delayMinutes === 0 ? "border-emerald-500 bg-emerald-500/[0.02]" : "border-rose-500 bg-rose-500/[0.02]"
                )}>
                  <div className="flex items-center gap-3 mb-8">
                    <div className={cn("p-3 rounded-2xl text-white", delayMinutes === 0 ? "bg-emerald-500" : "bg-rose-500")}>
                      <TimerReset size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black">遅延アシスト</h3>
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Adjust Timeline</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {[0, 15, 30, 45, 60].map((mins) => (
                      <button
                        key={mins}
                        onClick={() => setDelayMinutes(mins)}
                        className={cn(
                          "flex-1 min-w-[3rem] py-3 rounded-2xl border text-xs font-black transition-all active:scale-95",
                          delayMinutes === mins ? "bg-foreground text-background border-foreground shadow-lg" : "bg-white border-border text-muted-foreground hover:border-primary"
                        )}
                      >
                        {mins}分
                      </button>
                    ))}
                  </div>

                  <div className="p-4 rounded-2xl bg-white border border-border shadow-sm text-sm text-muted-foreground leading-relaxed">
                    {delayInsight.narrative}
                  </div>
                </MagazineCard>
              </motion.div>

              <motion.div variants={itemVariants}>
                <MagazineCard padding="none" className="h-full p-8 border-primary/20 bg-primary/[0.02]">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 rounded-2xl bg-primary text-primary-foreground">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black">AI 代替案</h3>
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Smart Rescheduling</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {(['rain', 'crowd', 'tired', 'budget'] as Trigger[]).map((t) => (
                      <button
                        key={t}
                        onClick={() => fetchAlternatives(t)}
                        className={cn(
                          "flex flex-col items-center justify-center gap-1 py-4 rounded-2xl border transition-all active:scale-95",
                          aiTrigger === t ? "bg-primary text-primary-foreground border-primary shadow-lg" : "bg-white border-border text-muted-foreground hover:border-primary"
                        )}
                      >
                        {t === 'rain' && <CloudRain size={16} />}
                        {t === 'crowd' && <Users size={16} />}
                        {t === 'tired' && <HeartPulse size={16} />}
                        {t === 'budget' && <Banknote size={16} />}
                        <span className="text-[10px] font-black uppercase tracking-widest">{t}</span>
                      </button>
                    ))}
                  </div>

                  {isAiLoading ? (
                    <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-dashed border-border bg-white/50">
                      <Loader2 size={24} className="animate-spin text-primary" />
                    </div>
                  ) : aiSuggestions.length > 0 ? (
                    <div className="space-y-3">
                      {aiSuggestions.slice(0, 1).map((s, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-white border border-primary/10 shadow-sm">
                          <div className="text-sm font-black text-foreground mb-2">{s.title}</div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{s.reason}</p>
                          <div className="mt-4 pt-4 border-t border-border/50 text-xs font-bold text-primary flex items-center gap-2">
                            <ChevronRight size={14} /> {s.action}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground text-center py-4">トリガーを選択して代替案を表示</p>
                  )}
                </MagazineCard>
              </motion.div>
            </div>

            {/* Utility Spots */}
            <motion.div variants={itemVariants}>
              <MagazineCard padding="none" className="p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 rounded-2xl bg-secondary/60">
                    <Search size={20} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black">周辺便利スポット</h3>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Near {currentBase}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {utilityTypes.map((item) => (
                    <a key={item.label} href={mapsSearchUrl(item.query, currentBase)} target="_blank" rel="noreferrer" className="group flex flex-col items-center gap-3 p-6 rounded-3xl border border-border bg-white hover:border-primary transition-all shadow-sm active:scale-95">
                      <item.icon size={24} className="text-primary group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-black">{item.label}</span>
                    </a>
                  ))}
                </div>
              </MagazineCard>
            </motion.div>
          </motion.div>
        )}

        {/* --- Logistics Tab: Expense, Memo, Reports --- */}
        {activeTab === 'logistics' && (
          <motion.div
            key="logistics"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Expense Card */}
              <motion.div variants={itemVariants}>
                <MagazineCard padding="none" className="p-8 border-emerald-500/20 bg-emerald-500/[0.02]">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
                        <Banknote size={20} />
                      </div>
                      <h3 className="text-xl font-black">共同精算</h3>
                    </div>
                    <Receipt size={20} className="text-emerald-500/40" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="p-5 rounded-3xl bg-white border border-emerald-100 shadow-sm">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Total Spent</span>
                      <span className="text-xl font-black text-foreground">{currency(settlement.total)}</span>
                    </div>
                    <div className="p-5 rounded-3xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/10">
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-100 block mb-1">Settlement</span>
                      <span className="text-xs font-bold leading-tight line-clamp-2">{settlement.instruction}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {settlement.expenseEvents.slice(0, 3).map((e) => (
                      <div key={e.id} className="p-4 rounded-2xl bg-white border border-border">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm font-black truncate max-w-[150px]">{e.title}</span>
                          <span className="text-xs font-bold text-emerald-600">{currency(e.actualExpense || 0)}</span>
                        </div>
                        <div className="flex gap-2">
                          {payerLabels.map((p) => (
                            <button
                              key={p.value}
                              onClick={() => updatePayer(e.id, p.value)}
                              className={cn(
                                "flex-1 py-2 rounded-xl text-[10px] font-black transition-all",
                                (payers[e.id] || 'shared') === p.value ? "bg-emerald-500 text-white shadow-md" : "bg-secondary/40 text-muted-foreground hover:bg-secondary/60"
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
                  <div className="flex items-center gap-3 mb-8">
                    <HeartPulse size={24} className="text-rose-500" />
                    <h3 className="text-xl font-black">旅の温度ログ</h3>
                  </div>
                  <div className="flex justify-between gap-2 mb-6">
                    {Object.entries(TEMPERATURE_MOODS).map(([val, cfg]) => (
                      <button
                        key={val}
                        onClick={() => setTemperatureMood(val as TemperatureMood)}
                        className={cn(
                          "flex-1 flex flex-col items-center justify-center p-3 rounded-2xl border transition-all active:scale-90",
                          temperatureMood === val ? "bg-rose-500 border-rose-500 text-white shadow-lg" : "bg-white border-border grayscale hover:grayscale-0"
                        )}
                      >
                        <span className="text-2xl mb-1">{cfg.emoji}</span>
                        <span className="text-[8px] font-black uppercase tracking-widest">{cfg.label}</span>
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={temperatureNote}
                    onChange={(e) => setTemperatureNote(e.target.value)}
                    placeholder="いまの気持ちを一言..."
                    className="w-full h-24 p-4 rounded-2xl border border-border bg-secondary/10 text-sm outline-none focus:border-rose-500/50 transition-all resize-none"
                  />
                  <button onClick={saveTemperatureEntry} className="w-full mt-4 py-4 rounded-2xl bg-foreground text-background text-xs font-black uppercase tracking-widest shadow-xl transition-all hover:scale-[1.02] active:scale-95">
                    Save Log
                  </button>
                </MagazineCard>

                <MagazineCard padding="none" className="p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <StickyNote size={24} className="text-amber-500" />
                    <h3 className="text-xl font-black">共有メモ</h3>
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={noteBody}
                      onChange={(e) => setNoteBody(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addNote()}
                      placeholder="ふたりのメモを記録"
                      className="flex-1 px-4 py-3 rounded-2xl border border-border bg-secondary/10 text-sm outline-none focus:border-amber-500/50"
                    />
                    <button onClick={addNote} className="p-4 rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/20 active:scale-95">
                      <MessageSquarePlus size={20} />
                    </button>
                  </div>
                </MagazineCard>
              </motion.div>
            </div>

            {/* Reports Section */}
            <motion.div variants={itemVariants}>
              <MagazineCard padding="none" className="p-8 bg-linear-to-br from-background to-secondary/10">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-6">
                      <FileText size={24} className="text-primary" />
                      <h3 className="text-xl font-black">旅レポート・書き出し</h3>
                    </div>
                    <div className="p-6 rounded-3xl bg-white/80 border border-border backdrop-blur-sm shadow-inner text-xs leading-relaxed text-muted-foreground whitespace-pre-wrap max-h-48 overflow-y-auto no-scrollbar">
                      {reportText}
                    </div>
                  </div>
                  <div className="w-full md:w-64 space-y-3">
                    <button onClick={downloadReport} className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-secondary/40 border border-border text-xs font-black uppercase tracking-widest hover:bg-secondary/60 transition-colors">
                      <Download size={16} /> TXT Export
                    </button>
                    <button onClick={downloadPdf} disabled={isPdfLoading} className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-foreground text-background text-xs font-black uppercase tracking-widest shadow-xl hover:scale-[1.02] active:scale-95 transition-all">
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
        className="rounded-[2.5rem] border border-border/40 bg-secondary/5 p-6 backdrop-blur-md"
      >
        <div className="flex items-center gap-4 text-[10px] font-bold text-muted-foreground leading-relaxed">
          <Smartphone size={16} className="text-primary animate-bounce" />
          <span>ホーム画面に追加すると、オフラインでも緊急カードが快適に動作します。</span>
        </div>
      </motion.section>
    </div>
  );
}
