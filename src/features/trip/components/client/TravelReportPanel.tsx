"use client";

import { useEffect, useMemo, useState } from "react";
import type { GourmetAward } from "@prisma/client";
import { Download, FileText, Sparkles } from "lucide-react";
import { MagazineCard } from "@/components/ui/MagazineCard";
import type { BudgetStats } from "@/features/trip/utils/tripUtils";
import type { TripEvent } from "@/features/trip/types/trip";
import { loadExpensePayers, loadTemperatureLogs, type TemperatureLogEntry } from "@/features/trip/utils/clientTripStorage";
import { computeSettlement, summarizeTemperature, TEMPERATURE_MOOD_NARRATIVES } from "@/features/trip/utils/tripInsights";

interface Props {
  tripId: string;
  awards: GourmetAward[];
  budgetStats: BudgetStats;
  allEvents: TripEvent[];
  photoCount: number;
}

function yen(value: number) {
  return `¥${value.toLocaleString()}`;
}

export default function TravelReportPanel({ tripId, awards, budgetStats, allEvents, photoCount }: Props) {
  const [logs, setLogs] = useState<TemperatureLogEntry[]>(() =>
    typeof window === "undefined" ? [] : loadTemperatureLogs(tripId)
  );
  const [payers, setPayers] = useState<Record<string, "shared" | "you" | "partner">>(() =>
    typeof window === "undefined" ? {} : loadExpensePayers(tripId)
  );

  useEffect(() => {
    const sync = () => {
      setLogs(loadTemperatureLogs(tripId));
      setPayers(loadExpensePayers(tripId));
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [tripId]);

  const report = useMemo(() => {
    const visited = allEvents.filter((event) => event.isConfirmed).length;
    const topFood = awards[0]?.title || allEvents.find((event) => event.type === "food")?.title || "未選定";
    const memoLines = allEvents.filter((event) => event.notes).slice(0, 4).map((event) => `- ${event.time} ${event.notes}`);
    const settlement = computeSettlement(
      allEvents.map((event) => ({
        id: event.id || "",
        dayNumber: 0,
        date: new Date().toISOString(),
        time: event.time,
        type: event.type,
        title: event.title || event.foodName || "Untitled",
        desc: event.desc || event.foodDesc || undefined,
        actualExpense: event.actualExpense || 0,
      })),
      payers
    );
    const temperature = summarizeTemperature(logs);
    const moodLine =
      logs.length > 0 ? `旅の温度: ${TEMPERATURE_MOOD_NARRATIVES[temperature.topMood]}が多く、また来たい登録は${temperature.revisitCount}件。` : "";
    const energyNotes = logs
      .filter((log) => log.note)
      .slice(0, 3)
      .map((log) => `- ${log.eventTime} ${log.note}`);

    return [
      "Travel Report",
      `予定数: ${allEvents.length}`,
      `チェック済み: ${visited}`,
      `写真: ${photoCount}`,
      `実績支出: ${yen(budgetStats.totalActual)}`,
      `精算: ${settlement.instruction}`,
      `ベストグルメ: ${topFood}`,
      moodLine,
      memoLines.length > 0 ? "メモ:" : "",
      ...memoLines,
      energyNotes.length > 0 ? "温度ログ:" : "",
      ...energyNotes,
    ].filter(Boolean).join("\n");
  }, [allEvents, awards, budgetStats.totalActual, logs, payers, photoCount]);

  const download = () => {
    const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "travel-report.txt";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <MagazineCard className="border-primary/20">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.25em] text-primary">
            <Sparkles size={13} />
            Auto Summary
          </div>
          <h2 className="font-playfair text-3xl font-black text-foreground">旅の自動レポート</h2>
          <p className="mt-3 max-w-xl text-sm font-medium leading-relaxed text-muted-foreground">
            写真、支出、チェック済み予定、グルメアワードから旅後に見返せる要約を作成します。
          </p>
        </div>
        <button
          onClick={download}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-foreground px-5 py-3 text-[10px] font-black uppercase tracking-widest text-background transition-transform active:scale-[0.98]"
        >
          <Download size={14} />
          Download
        </button>
      </div>
      <div className="mt-8 rounded-[1.5rem] border border-border bg-secondary/30 p-5">
        <div className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
          <FileText size={14} />
          Preview
        </div>
        <pre className="whitespace-pre-wrap font-sans text-sm font-medium leading-relaxed text-foreground">{report}</pre>
      </div>
    </MagazineCard>
  );
}
