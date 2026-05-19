"use client";

import type { GourmetAward } from "@prisma/client";
import { Download, FileText, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { MagazineCard } from "@/components/ui/MagazineCard";
import type { TripEvent } from "@/features/trip/types/trip";
import {
  loadExpensePayers,
  loadTemperatureLogs,
  type TemperatureLogEntry,
} from "@/features/trip/utils/clientTripStorage";
import {
  computeSettlement,
  summarizeTemperature,
  TEMPERATURE_MOOD_NARRATIVES,
} from "@/features/trip/utils/tripInsights";
import type { BudgetStats } from "@/features/trip/utils/tripUtils";
import { maskSecretText } from "@/features/trip/utils/tripUtils";

interface Props {
  tripId: string;
  tripSlug: string;
  awards: GourmetAward[];
  budgetStats: BudgetStats;
  allEvents: TripEvent[];
  photoCount: number;
}

function yen(value: number) {
  return `¥${value.toLocaleString()}`;
}

export default function TravelReportPanel({ tripId, tripSlug, awards, budgetStats, allEvents, photoCount }: Props) {
  const [logs, setLogs] = useState<TemperatureLogEntry[]>(() =>
    typeof window === "undefined" ? [] : loadTemperatureLogs(tripId),
  );
  const [payers, setPayers] = useState<Record<string, "shared" | "you" | "partner">>(() =>
    typeof window === "undefined" ? {} : loadExpensePayers(tripId),
  );
  const [isPdfLoading, setIsPdfLoading] = useState(false);

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
    const topFoodRaw = awards[0]?.title || allEvents.find((event) => event.type === "food")?.title || "未選定";
    const topFood = maskSecretText(topFoodRaw, false);

    const memoLines = allEvents
      .filter((event) => event.notes)
      .slice(0, 4)
      .map((event) => `- ${event.time} ${event.notes}`);
    const settlement = computeSettlement(
      allEvents.map((event) => ({
        id: event.id || "",
        dayNumber: 0,
        date: new Date().toISOString(),
        time: event.time,
        type: event.type,
        title: maskSecretText(event.title || event.foodName || "Untitled", false),
        desc: maskSecretText(event.desc || event.foodDesc || "", false),
        actualExpense: event.actualExpense || 0,
      })),
      payers,
    );
    const temperature = summarizeTemperature(logs);
    const moodLine =
      logs.length > 0
        ? `旅の温度: ${TEMPERATURE_MOOD_NARRATIVES[temperature.topMood]}が多く、また来たい登録は${temperature.revisitCount}件。`
        : "";
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
    ]
      .filter(Boolean)
      .join("\n");
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

  const downloadPdf = async () => {
    setIsPdfLoading(true);
    try {
      let response = await fetch(`/api/trip/${tripSlug}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ temperatureLogs: logs }),
      });

      if (!response.ok) {
        response = await fetch(`/api/trip/${tripSlug}/report`);
      }

      if (!response.ok) {
        const detail = await response
          .clone()
          .json()
          .then((data) => JSON.stringify(data))
          .catch(async () => await response.text().catch(() => ""));
        console.error("PDF album generation failed", { status: response.status, detail });
        alert(`PDF アルバムの生成に失敗しました。${detail || `status: ${response.status}`}`);
        return;
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${tripSlug}-report.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF album download failed", error);
      alert("PDF アルバムの生成に失敗しました。");
    } finally {
      setIsPdfLoading(false);
    }
  };

  return (
    <MagazineCard className="border-primary/20">
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
        <div>
          <div className="border-primary/20 bg-primary/10 text-primary mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[10px] font-black tracking-[0.25em] uppercase">
            <Sparkles size={13} />
            Auto Summary
          </div>
          <h2 className="font-playfair text-foreground text-3xl font-black">旅の自動レポート</h2>
          <p className="text-muted-foreground mt-3 max-w-xl text-sm leading-relaxed font-medium">
            写真、支出、チェック済み予定、グルメアワードから旅後に見返せる要約を作成します。
          </p>
        </div>
        <button
          onClick={download}
          className="bg-foreground text-background inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-[10px] font-black tracking-widest uppercase transition-transform active:scale-[0.98]"
        >
          <Download size={14} />
          Download
        </button>
        <button
          onClick={downloadPdf}
          disabled={isPdfLoading}
          className="border-border text-foreground inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-[10px] font-black tracking-widest uppercase transition-transform active:scale-[0.98] disabled:opacity-50"
        >
          <FileText size={14} />
          {isPdfLoading ? "Building PDF" : "PDF Album"}
        </button>
      </div>
      <div className="border-border bg-secondary/30 mt-8 rounded-3xl border p-5">
        <div className="text-muted-foreground mb-4 flex items-center gap-2 text-[10px] font-black tracking-widest uppercase">
          <FileText size={14} />
          Preview
        </div>
        <pre className="text-foreground font-sans text-sm leading-relaxed font-medium whitespace-pre-wrap">
          {report}
        </pre>
      </div>
    </MagazineCard>
  );
}
