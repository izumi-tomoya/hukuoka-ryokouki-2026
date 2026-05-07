"use client";

import { useEffect, useMemo, useState } from "react";
import { HeartPulse, Sparkles } from "lucide-react";
import { MagazineCard } from "@/components/ui/MagazineCard";
import {
  loadTemperatureLogs,
  TEMPERATURE_MOODS,
  type TemperatureLogEntry,
} from "@/features/trip/utils/clientTripStorage";
import { summarizeTemperature, TEMPERATURE_MOOD_NARRATIVES } from "@/features/trip/utils/tripInsights";

type Props = {
  tripId: string;
};

export default function TemperatureTimeline({ tripId }: Props) {
  const [logs, setLogs] = useState<TemperatureLogEntry[]>(() =>
    typeof window === "undefined" ? [] : loadTemperatureLogs(tripId)
  );

  useEffect(() => {
    const sync = () => setLogs(loadTemperatureLogs(tripId));
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [tripId]);

  const summary = useMemo(() => summarizeTemperature(logs), [logs]);

  if (logs.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 px-0 sm:px-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-500/12 text-rose-500">
          <HeartPulse size={22} />
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground">旅の温度ログ</h2>
          <p className="mt-1 text-[10px] font-black uppercase tracking-[0.18em] text-muted-foreground">
            Emotional Timeline
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <MagazineCard className="border-rose-500/20">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-rose-500">
            <Sparkles size={13} />
            Mood Summary
          </div>

          <div className="space-y-3">
            {Object.entries(summary.counts).map(([mood, count]) => {
              const config = TEMPERATURE_MOODS[mood as keyof typeof TEMPERATURE_MOODS];
              return (
                <div key={mood} className="flex items-center justify-between rounded-2xl bg-secondary/25 p-4">
                  <div className="flex items-center gap-3">
                    <div className={`text-xl ${config.accent}`}>{config.emoji}</div>
                    <div>
                      <div className="text-sm font-black text-foreground">{config.label}</div>
                      <div className="text-xs text-muted-foreground">{TEMPERATURE_MOOD_NARRATIVES[mood as keyof typeof TEMPERATURE_MOOD_NARRATIVES]}</div>
                    </div>
                  </div>
                  <div className="text-lg font-black text-foreground">{count}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-border bg-secondary/20 p-5 text-sm leading-relaxed text-muted-foreground">
            また来たい登録: <span className="font-black text-foreground">{summary.revisitCount}</span> 件
          </div>
        </MagazineCard>

        <MagazineCard>
          <div className="space-y-4">
            {summary.highlightedLogs.map((log) => {
              const mood = TEMPERATURE_MOODS[log.mood];
              return (
                <div key={log.id} className="rounded-[1.5rem] border border-border bg-secondary/20 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-[10px] font-black uppercase tracking-[0.16em] text-muted-foreground">
                        Day {log.dayNumber ?? "-"} / {log.eventTime}
                      </div>
                      <div className="mt-1 break-words text-sm font-black text-foreground">{log.eventTitle}</div>
                    </div>
                    <div className={`text-xl ${mood.accent}`}>{mood.emoji}</div>
                  </div>
                  {log.note && <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{log.note}</p>}
                </div>
              );
            })}
          </div>
        </MagazineCard>
      </div>
    </section>
  );
}
