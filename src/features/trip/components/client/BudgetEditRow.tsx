"use client";

import { Check, Pencil, X } from "lucide-react";
import { useState } from "react";
import { updateEventBudgetAction } from "@/features/trip/api/tripActions";

interface Props {
  eventId: string;
  plannedBudget?: number | null;
  actualExpense?: number | null;
}

export default function BudgetEditRow({ eventId, plannedBudget, actualExpense }: Props) {
  const [editing, setEditing] = useState(false);
  const [planned, setPlanned] = useState(String(plannedBudget ?? ""));
  const [actual, setActual] = useState(String(actualExpense ?? ""));
  const [saving, setSaving] = useState(false);

  const hasValues = (plannedBudget ?? 0) > 0 || (actualExpense ?? 0) > 0;

  const save = async () => {
    setSaving(true);
    await updateEventBudgetAction(
      eventId,
      planned !== "" ? Number(planned) : null,
      actual !== "" ? Number(actual) : null,
      null,
    );
    setSaving(false);
    setEditing(false);
  };

  const cancel = () => {
    setPlanned(String(plannedBudget ?? ""));
    setActual(String(actualExpense ?? ""));
    setEditing(false);
  };

  if (!editing) {
    return (
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="flex w-full items-center justify-between rounded-2xl border border-dashed border-zinc-200 px-4 py-2.5 transition-colors hover:border-primary/40 hover:bg-primary/5"
      >
        <div className="flex items-center gap-4 text-[10px] font-black tracking-widest text-zinc-400 uppercase">
          {hasValues ? (
            <>
              {(plannedBudget ?? 0) > 0 && (
                <span>予算 ¥{plannedBudget?.toLocaleString()}</span>
              )}
              {(actualExpense ?? 0) > 0 && (
                <span className="text-emerald-500">実費 ¥{actualExpense?.toLocaleString()}</span>
              )}
            </>
          ) : (
            <span>予算・実費を入力</span>
          )}
        </div>
        <Pencil size={12} className="text-zinc-400" />
      </button>
    );
  }

  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
      <div className="mb-3 text-[10px] font-black tracking-widest text-primary uppercase">Budget Edit</div>
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="mb-1 block text-[9px] font-black tracking-widest text-zinc-400 uppercase">
            予算 (¥)
          </label>
          <input
            type="number"
            value={planned}
            onChange={(e) => setPlanned(e.target.value)}
            placeholder="0"
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20"
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-[9px] font-black tracking-widest text-zinc-400 uppercase">
            実費 (¥)
          </label>
          <input
            type="number"
            value={actual}
            onChange={(e) => setActual(e.target.value)}
            placeholder="0"
            className="w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-bold outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/20"
          />
        </div>
        <div className="flex flex-col justify-end gap-1.5">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white shadow-sm transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
          >
            <Check size={15} />
          </button>
          <button
            type="button"
            onClick={cancel}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-400 transition-all hover:bg-zinc-50"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
