"use client";

import { useEffect, useMemo, useState } from "react";
import { MagazineCard } from "@/components/ui/MagazineCard";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  Banknote,
  CheckCircle2,
  Clock,
  CloudRain,
  Coffee,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Hotel,
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
  Umbrella,
} from "lucide-react";

type AssistEvent = {
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
  transitSteps?: {
    time: string;
    station: string;
    mode: string;
    lineName?: string;
    duration?: string;
    fare?: string;
    platform?: string;
    exit?: string;
  }[];
};

type AssistTip = {
  id: string;
  title: string;
  body: string;
  venue?: string;
  imageUrl?: string;
  isWarning?: boolean;
  isConfirmed?: boolean;
  category?: string;
};

type AssistDashboardProps = {
  trip: {
    id: string;
    slug: string;
    title: string;
    location: string;
    startDate: string;
    endDate: string;
  };
  events: AssistEvent[];
  tips: AssistTip[];
  weatherLabel?: string | null;
};

type SharedNote = {
  id: string;
  body: string;
  createdAt: string;
};

const utilityTypes = [
  { label: "コンビニ", query: "convenience store", icon: Coffee },
  { label: "トイレ", query: "public toilet", icon: ShieldAlert },
  { label: "ロッカー", query: "coin locker", icon: Ticket },
  { label: "タクシー", query: "taxi stand", icon: Navigation },
];

function parseMinutes(time: string) {
  const match = time.match(/(\d{1,2}):(\d{2})/);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

function formatMinutes(value: number) {
  const abs = Math.abs(value);
  const hours = Math.floor(abs / 60);
  const minutes = abs % 60;
  const text = hours > 0 ? `${hours}時間${minutes}分` : `${minutes}分`;
  return value >= 0 ? `あと${text}` : `${text}超過`;
}

function eventDateTime(event: AssistEvent) {
  const minutes = parseMinutes(event.time);
  if (minutes === null) return null;
  const date = new Date(event.date);
  date.setHours(Math.floor(minutes / 60), minutes % 60, 0, 0);
  return date;
}

function mapsSearchUrl(query: string, base: string) {
  return `https://www.google.com/maps/search/${encodeURIComponent(`${query} near ${base}`)}`;
}

function currency(value?: number) {
  return `¥${(value || 0).toLocaleString()}`;
}

export default function AssistDashboard({ trip, events, tips, weatherLabel }: AssistDashboardProps) {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(() => new Date());
  const [delayMinutes, setDelayMinutes] = useState(0);
  const [skippedIds, setSkippedIds] = useState<string[]>([]);
  const [noteBody, setNoteBody] = useState("");
  const notesKey = `memoir:shared-notes:${trip.id}`;
  const checkinsKey = `memoir:event-checkins:${trip.id}`;
  const [notes, setNotes] = useState<SharedNote[]>([]);
  const [checkedEventIds, setCheckedEventIds] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
    
    // Load data from localStorage after mounting
    try {
      const savedNotes = localStorage.getItem(notesKey);
      if (savedNotes) setNotes(JSON.parse(savedNotes));
      
      const savedCheckins = localStorage.getItem(checkinsKey);
      if (savedCheckins) setCheckedEventIds(JSON.parse(savedCheckins));
    } catch (e) {
      console.error("Failed to load from localStorage", e);
    }

    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, [notesKey, checkinsKey]);

  const sortedEvents = useMemo(
    () => [...events].sort((a, b) => (eventDateTime(a)?.getTime() || 0) - (eventDateTime(b)?.getTime() || 0)),
    [events]
  );

  const activeEvents = sortedEvents.filter((event) => !skippedIds.includes(event.id));
  const nextEvent = activeEvents.find((event) => {
    const date = eventDateTime(event);
    return date ? date.getTime() + 30 * 60 * 1000 >= now.getTime() : false;
  }) || activeEvents[0];

  const nextIndex = nextEvent ? activeEvents.findIndex((event) => event.id === nextEvent.id) : -1;
  const followingEvent = nextIndex >= 0 ? activeEvents[nextIndex + 1] : undefined;
  const nextTime = nextEvent ? eventDateTime(nextEvent) : null;
  const minutesToNext = nextTime ? Math.round((nextTime.getTime() - now.getTime()) / 60_000) - delayMinutes : null;
  const currentBase = nextEvent?.transitSteps?.[0]?.station || nextEvent?.title || trip.location;

  const warningTips = tips.filter((tip) => tip.isWarning || tip.category === "Warning");
  const reservationTips = tips.filter((tip) => tip.category === "Reservation" || tip.imageUrl || tip.title.includes("予約"));
  const alternativeTips = tips.filter((tip) =>
    ["Hidden Gem", "General", "Gourmet"].includes(tip.category || "") && !tip.isWarning
  );
  const hotelEvents = sortedEvents.filter((event) => event.type === "hotel");
  const actualTotal = sortedEvents.reduce((sum, event) => sum + (event.actualExpense || 0), 0);
  const plannedTotal = sortedEvents.reduce((sum, event) => sum + (event.plannedBudget || 0), 0);
  const splitAmount = Math.ceil(actualTotal / 2);

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

  const copyQuickInfo = async () => {
    const lines = [
      trip.title,
      `場所: ${trip.location}`,
      nextEvent ? `次の予定: ${nextEvent.time} ${nextEvent.title}` : "",
      hotelEvents[0] ? `ホテル: ${hotelEvents[0].title}` : "",
      reservationTips.map((tip) => `${tip.title}: ${tip.body}`).join("\n"),
    ].filter(Boolean);
    await navigator.clipboard?.writeText(lines.join("\n"));
  };

  const reportText = [
    `${trip.title} 旅メモ`,
    `場所: ${trip.location}`,
    `予定数: ${sortedEvents.length}`,
    `実績支出: ${currency(actualTotal)}`,
    `ひとり目安: ${currency(splitAmount)}`,
    ...notes.slice(0, 6).map((note) => `- ${note.body}`),
  ].join("\n");

  const downloadReport = () => {
    const blob = new Blob([reportText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${trip.slug}-travel-report.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!mounted) {
    return (
      <div className="space-y-6 pb-24">
        <MagazineCard className="h-64 animate-pulse bg-secondary/20" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <span className="truncate">Next Move</span>
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
              <div className={cn(
                "text-2xl font-black tracking-tight sm:text-3xl",
                minutesToNext !== null && minutesToNext < 0 ? "text-rose-500" : "text-foreground"
              )}>
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
              <h3 className="text-lg font-black text-foreground">Quick Access</h3>
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground sm:tracking-widest">重要情報</p>
            </div>
          </div>
          <div className="space-y-3">
            {hotelEvents.slice(0, 2).map((event) => (
              <a key={event.id} href={event.locationUrl || "#"} target="_blank" rel="noreferrer" className="flex min-h-14 items-center gap-3 rounded-2xl border border-border p-4 transition-colors hover:border-primary/40">
                <Hotel size={17} className="shrink-0 text-primary" />
                <span className="min-w-0 flex-1 truncate text-sm font-bold">{event.title}</span>
                {event.locationUrl && <ExternalLink size={14} className="shrink-0 text-muted-foreground" />}
              </a>
            ))}
            {reservationTips.slice(0, 3).map((tip) => (
              <a key={tip.id} href={tip.imageUrl || "#"} target="_blank" rel="noreferrer" className="flex min-h-14 items-center gap-3 rounded-2xl border border-border p-4 transition-colors hover:border-primary/40">
                <Ticket size={17} className="shrink-0 text-primary" />
                <span className="min-w-0 flex-1 truncate text-sm font-bold">{tip.title}</span>
                {tip.imageUrl && <ExternalLink size={14} className="shrink-0 text-muted-foreground" />}
              </a>
            ))}
            <button onClick={copyQuickInfo} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-foreground px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-background transition-transform active:scale-[0.98] sm:tracking-widest">
              <Copy size={14} />
              Copy Essentials
            </button>
          </div>
        </MagazineCard>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <MagazineCard className="min-w-0">
          <div className="mb-6 flex items-center gap-3">
            <TimerReset className="shrink-0 text-primary" />
            <h3 className="text-lg font-black">遅れたとき</h3>
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
          {followingEvent && (
            <div className="mt-6 rounded-2xl border border-border bg-secondary/30 p-4 text-sm">
              <div className="font-bold text-foreground">次の固定予定</div>
              <div className="mt-1 break-words text-muted-foreground">{followingEvent.time} {followingEvent.title}</div>
            </div>
          )}
          {nextEvent && (
            <button
              onClick={() => setSkippedIds((ids) => ids.includes(nextEvent.id) ? ids : [...ids, nextEvent.id])}
              className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full px-1 text-xs font-black uppercase tracking-[0.12em] text-rose-500 sm:tracking-widest"
            >
              <RotateCcw size={14} />
              この予定をスキップ
            </button>
          )}
        </MagazineCard>

        <MagazineCard className="min-w-0">
          <div className="mb-6 flex items-center gap-3">
            <Umbrella className="shrink-0 text-sky-500" />
            <h3 className="text-lg font-black">雨・混雑プラン</h3>
          </div>
          <div className="mb-4 rounded-2xl border border-sky-500/20 bg-sky-500/10 p-4 text-sm font-bold text-foreground">
            {weatherLabel || "天気情報を取得できない場合も、屋内候補を確認できます。"}
          </div>
          <div className="space-y-3">
            {alternativeTips.slice(0, 4).map((tip) => (
              <div key={tip.id} className="min-w-0 rounded-2xl border border-border p-4">
                <div className="break-words text-sm font-black text-foreground">{tip.venue || tip.title}</div>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{tip.body}</p>
              </div>
            ))}
          </div>
        </MagazineCard>

        <MagazineCard className="min-w-0">
          <div className="mb-6 flex items-center gap-3">
            <Banknote className="shrink-0 text-emerald-500" />
            <h3 className="text-lg font-black">割り勘</h3>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="min-w-0 rounded-2xl bg-secondary/40 p-4">
              <div className="text-[10px] font-black uppercase tracking-[0.14em] text-muted-foreground sm:tracking-widest">Planned</div>
              <div className="mt-2 break-words text-xl font-black">{currency(plannedTotal)}</div>
            </div>
            <div className="min-w-0 rounded-2xl bg-emerald-500/10 p-4 text-emerald-600">
              <div className="text-[10px] font-black uppercase tracking-[0.14em] sm:tracking-widest">Each</div>
              <div className="mt-2 break-words text-xl font-black">{currency(splitAmount)}</div>
            </div>
          </div>
          <p className="mt-4 text-xs font-medium leading-relaxed text-muted-foreground">
            実績支出 {currency(actualTotal)} を2人で割った目安です。イベントの実績金額を更新すると反映されます。
          </p>
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
          <button onClick={downloadReport} className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-foreground px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-background sm:tracking-widest">
            <Download size={14} />
            Download
          </button>
        </MagazineCard>
      </section>

      <section className="rounded-[1.5rem] border border-border bg-secondary/20 p-4 sm:rounded-[2rem] sm:p-5">
        <div className="flex flex-col gap-2 text-xs font-bold leading-relaxed text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
          <Smartphone size={16} className="shrink-0 text-primary" />
          <span>このサイトはホーム画面追加とオフラインキャッシュに対応しました。</span>
          <Sparkles size={14} className="hidden shrink-0 text-primary sm:block" />
          <span>旅行中に開いたページは通信が弱い場所でも再表示しやすくなります。</span>
          <Train size={14} className="hidden shrink-0 text-primary sm:block" />
        </div>
      </section>
    </div>
  );
}
