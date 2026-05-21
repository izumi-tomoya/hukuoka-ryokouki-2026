"use client";

import { Check, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useState } from "react";
import { updateEventBudgetAction } from "@/features/trip/api/tripActions";
import { cn } from "@/lib/utils";

type EventRow = {
  id?: string;
  title?: string;
  foodName?: string;
  type: string;
  time: string;
  plannedBudget?: number | null;
  actualExpense?: number | null;
  dayNumber?: number;
  dayTitle?: string | null;
};

const CATEGORY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  food:        { label: "食事",     color: "text-rose-500",    bg: "bg-rose-50" },
  transport:   { label: "交通",     color: "text-blue-500",    bg: "bg-blue-50" },
  hotel:       { label: "宿泊",     color: "text-emerald-500", bg: "bg-emerald-50" },
  sightseeing: { label: "観光",     color: "text-sky-500",     bg: "bg-sky-50" },
  basic:       { label: "その他",   color: "text-zinc-500",    bg: "bg-zinc-50" },
  shopping:    { label: "お土産",   color: "text-pink-500",    bg: "bg-pink-50" },
};

function BudgetRow({ event }: { event: EventRow }) {
  const [planned, setPlanned] = useState(String(event.plannedBudget ?? ""));
  const [actual, setActual] = useState(String(event.actualExpense ?? ""));
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!event.id) return null;

  const save = async () => {
    setSaving(true);
    await updateEventBudgetAction(
      event.id!,
      planned !== "" ? Number(planned) : null,
      actual !== "" ? Number(actual) : null,
      null,
    );
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const name = event.foodName?.replace(/^[^\s]+ /, "") || event.title || "Untitled";
  const catConfig = CATEGORY_CONFIG[event.type] ?? CATEGORY_CONFIG.basic;

  return (
    <div className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 border-b border-zinc-100 py-3 last:border-0">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn("rounded-full px-2 py-0.5 text-[9px] font-black tracking-widest uppercase", catConfig.bg, catConfig.color)}>
            {catConfig.label}
          </span>
          <span className="text-zinc-400 text-[10px]">Day {event.dayNumber} · {event.time}</span>
        </div>
        <p className="mt-0.5 truncate text-sm font-bold text-zinc-800">{name}</p>
      </div>

      <div className="flex flex-col items-end gap-0.5">
        <label className="text-[9px] font-black tracking-widest text-zinc-400 uppercase">予算</label>
        <input
          type="number"
          value={planned}
          onChange={(e) => { setPlanned(e.target.value); setSaved(false); }}
          placeholder="—"
          className="w-24 rounded-xl border border-zinc-200 px-3 py-1.5 text-right text-sm font-bold outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20"
        />
      </div>

      <div className="flex flex-col items-end gap-0.5">
        <label className="text-[9px] font-black tracking-widest text-zinc-400 uppercase">実費</label>
        <input
          type="number"
          value={actual}
          onChange={(e) => { setActual(e.target.value); setSaved(false); }}
          placeholder="—"
          className="w-24 rounded-xl border border-zinc-200 px-3 py-1.5 text-right text-sm font-bold outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20"
        />
      </div>

      <button
        type="button"
        onClick={save}
        disabled={saving}
        className={cn(
          "flex h-9 w-9 items-center justify-center rounded-xl transition-all",
          saved
            ? "bg-emerald-500 text-white"
            : "border border-zinc-200 bg-white text-zinc-400 hover:border-primary/40 hover:text-primary",
        )}
      >
        <Check size={15} strokeWidth={saved ? 3 : 2} />
      </button>
    </div>
  );
}

export default function BudgetManager({ events }: { events: EventRow[] }) {
  const billable = events.filter((e) => e.id);
  const totalPlanned = billable.reduce((s, e) => s + (e.plannedBudget ?? 0), 0);
  const totalActual = billable.reduce((s, e) => s + (e.actualExpense ?? 0), 0);
  const diff = totalActual - totalPlanned;
  const isOver = diff > 0;

  const byType = Object.entries(
    billable.reduce<Record<string, EventRow[]>>((acc, e) => {
      const key = e.type;
      if (!acc[key]) acc[key] = [];
      acc[key].push(e);
      return acc;
    }, {})
  ).sort(([a], [b]) => {
    const order = ["food", "hotel", "transport", "sightseeing", "shopping", "basic"];
    return order.indexOf(a) - order.indexOf(b);
  });

  return (
    <div className="space-y-8 pt-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-3xl border border-zinc-100 bg-white p-5 shadow-sm">
          <p className="mb-1 text-[10px] font-black tracking-widest text-zinc-400 uppercase">総予算</p>
          <div className="flex items-baseline gap-1">
            <span className="font-playfair text-2xl font-black text-zinc-900">¥{totalPlanned.toLocaleString()}</span>
          </div>
        </div>
        <div className="rounded-3xl border border-zinc-100 bg-white p-5 shadow-sm">
          <p className="mb-1 text-[10px] font-black tracking-widest text-zinc-400 uppercase">実費合計</p>
          <div className="flex items-baseline gap-1">
            <span className={cn("font-playfair text-2xl font-black", totalActual > 0 ? "text-emerald-600" : "text-zinc-400")}>
              ¥{totalActual.toLocaleString()}
            </span>
          </div>
        </div>
        <div className={cn("rounded-3xl border p-5 shadow-sm", isOver ? "border-rose-100 bg-rose-50" : "border-emerald-100 bg-emerald-50")}>
          <p className={cn("mb-1 text-[10px] font-black tracking-widest uppercase", isOver ? "text-rose-400" : "text-emerald-400")}>
            {isOver ? "超過" : "残り"}
          </p>
          <div className="flex items-center gap-2">
            {isOver ? <TrendingUp size={16} className="text-rose-500" /> : <TrendingDown size={16} className="text-emerald-500" />}
            <span className={cn("font-playfair text-2xl font-black", isOver ? "text-rose-600" : "text-emerald-600")}>
              ¥{Math.abs(diff).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Per-category tables */}
      {byType.map(([type, rows]) => {
        const catConfig = CATEGORY_CONFIG[type] ?? CATEGORY_CONFIG.basic;
        const catPlanned = rows.reduce((s, e) => s + (e.plannedBudget ?? 0), 0);
        const catActual = rows.reduce((s, e) => s + (e.actualExpense ?? 0), 0);

        return (
          <div key={type} className="rounded-3xl border border-zinc-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet size={14} className={catConfig.color} />
                <span className={cn("text-sm font-black", catConfig.color)}>{catConfig.label}</span>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold text-zinc-400">
                {catPlanned > 0 && <span>予算 ¥{catPlanned.toLocaleString()}</span>}
                {catActual > 0 && <span className="text-emerald-500">実費 ¥{catActual.toLocaleString()}</span>}
              </div>
            </div>
            <div>
              {rows.map((event) => (
                <BudgetRow key={event.id} event={event} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
