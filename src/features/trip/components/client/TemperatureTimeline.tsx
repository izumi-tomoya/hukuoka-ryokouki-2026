"use client";

import { HeartPulse, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
    typeof window === "undefined" ? [] : loadTemperatureLogs(tripId),
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
          <h2 className="text-foreground text-2xl font-black tracking-tight">旅の温度ログ</h2>
          <p className="text-muted-foreground mt-1 text-[10px] font-black tracking-[0.18em] uppercase">
            Emotional Timeline
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <MagazineCard className="border-rose-500/20">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-rose-500/20 bg-rose-500/10 px-4 py-1.5 text-[10px] font-black tracking-[0.18em] text-rose-500 uppercase">
            <Sparkles size={13} />
            Mood Summary
          </div>

          <div className="space-y-3">
            {Object.entries(summary.counts).map(([mood, count]) => {
              const config = TEMPERATURE_MOODS[mood as keyof typeof TEMPERATURE_MOODS];
              return (
                <div key={mood} className="bg-secondary/25 flex items-center justify-between rounded-2xl p-4">
                  <div className="flex items-center gap-3">
                    <div className={`text-xl ${config.accent}`}>{config.emoji}</div>
                    <div>
                      <div className="text-foreground text-sm font-black">{config.label}</div>
                      <div className="text-muted-foreground text-xs">
                        {TEMPERATURE_MOOD_NARRATIVES[mood as keyof typeof TEMPERATURE_MOOD_NARRATIVES]}
                      </div>
                    </div>
                  </div>
                  <div className="text-foreground text-lg font-black">{count}</div>
                </div>
              );
            })}
          </div>

          <div className="border-border bg-secondary/20 text-muted-foreground mt-6 rounded-[1.5rem] border p-5 text-sm leading-relaxed">
            また来たい登録: <span className="text-foreground font-black">{summary.revisitCount}</span> 件
          </div>
        </MagazineCard>

        <MagazineCard>
          <div className="space-y-4">
            {summary.highlightedLogs.map((log) => {
              const mood = TEMPERATURE_MOODS[log.mood];
              return (
                <div key={log.id} className="border-border bg-secondary/20 rounded-[1.5rem] border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <div className="text-muted-foreground text-[10px] font-black tracking-[0.16em] uppercase">
                        Day {log.dayNumber ?? "-"} / {log.eventTime}
                      </div>
                      <div className="text-foreground mt-1 text-sm font-black break-words">{log.eventTitle}</div>
                    </div>
                    <div className={`text-xl ${mood.accent}`}>{mood.emoji}</div>
                  </div>
                  {log.note && <p className="text-muted-foreground mt-3 text-sm leading-relaxed">{log.note}</p>}
                </div>
              );
            })}
          </div>
        </MagazineCard>
      </div>
    </section>
  );
}
