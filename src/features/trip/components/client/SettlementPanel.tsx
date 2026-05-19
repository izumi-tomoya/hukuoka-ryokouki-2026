"use client";

import { Banknote, Coins, HandCoins, ReceiptText } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { MagazineCard } from "@/components/ui/MagazineCard";
import { type ExpensePayer, loadExpensePayers, saveExpensePayers } from "@/features/trip/utils/clientTripStorage";
import { computeSettlement, currency, type InsightEvent } from "@/features/trip/utils/tripInsights";
import { cn } from "@/lib/utils";

type Props = {
  tripId: string;
  events: InsightEvent[];
};

const payerLabels: Array<{ value: ExpensePayer; label: string }> = [
  { value: "you", label: "自分" },
  { value: "partner", label: "相手" },
  { value: "shared", label: "折半" },
];

export default function SettlementPanel({ tripId, events }: Props) {
  const [payers, setPayers] = useState<Record<string, ExpensePayer>>(() =>
    typeof window === "undefined" ? {} : loadExpensePayers(tripId),
  );

  useEffect(() => {
    const sync = () => setPayers(loadExpensePayers(tripId));
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, [tripId]);

  const settlement = useMemo(() => computeSettlement(events, payers), [events, payers]);

  const updatePayer = (eventId: string, payer: ExpensePayer) => {
    const next = { ...payers, [eventId]: payer };
    setPayers(next);
    saveExpensePayers(tripId, next);
  };

  if (settlement.expenseEvents.length === 0) return null;

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3 px-0 sm:px-2">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/12 text-emerald-600">
          <HandCoins size={22} />
        </div>
        <div>
          <h2 className="text-foreground text-2xl font-black tracking-tight">Settlement Mode</h2>
          <p className="text-muted-foreground mt-1 text-[10px] font-black tracking-[0.18em] uppercase">Who Paid What</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
        <MagazineCard className="border-emerald-500/20">
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="bg-secondary/30 rounded-2xl p-4">
              <div className="text-muted-foreground text-[10px] font-black tracking-[0.16em] uppercase">Total</div>
              <div className="text-foreground mt-2 text-2xl font-black">{currency(settlement.total)}</div>
            </div>
            <div className="bg-secondary/30 rounded-2xl p-4">
              <div className="text-muted-foreground text-[10px] font-black tracking-[0.16em] uppercase">You Paid</div>
              <div className="text-foreground mt-2 text-2xl font-black">{currency(settlement.youPaid)}</div>
            </div>
            <div className="bg-secondary/30 rounded-2xl p-4">
              <div className="text-muted-foreground text-[10px] font-black tracking-[0.16em] uppercase">
                Partner Paid
              </div>
              <div className="text-foreground mt-2 text-2xl font-black">{currency(settlement.partnerPaid)}</div>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border border-emerald-500/20 bg-emerald-500/8 p-5">
            <div className="flex items-center gap-2 text-[10px] font-black tracking-[0.18em] text-emerald-600 uppercase">
              <Coins size={14} />
              Balance
            </div>
            <p className="text-foreground mt-3 text-sm leading-relaxed font-medium">{settlement.instruction}</p>
          </div>
        </MagazineCard>

        <MagazineCard>
          <div className="text-muted-foreground mb-5 flex items-center gap-2 text-[10px] font-black tracking-[0.18em] uppercase">
            <ReceiptText size={14} />
            Expense Assignment
          </div>

          <div className="space-y-4">
            {settlement.expenseEvents.map((event) => {
              const payer = payers[event.id] || "shared";

              return (
                <div key={event.id} className="border-border bg-secondary/20 rounded-3xl border p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="text-muted-foreground text-[10px] font-black tracking-[0.16em] uppercase">
                        {event.time} / Day {event.dayNumber}
                      </div>
                      <div className="text-foreground mt-1 text-sm font-black wrap-break-word">{event.title}</div>
                    </div>
                    <div className="bg-background text-foreground inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black">
                      <Banknote size={14} className="text-emerald-600" />
                      {currency(event.actualExpense || 0)}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {payerLabels.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => updatePayer(event.id, option.value)}
                        className={cn(
                          "min-h-11 rounded-full border px-3 py-2 text-xs font-black transition-colors",
                          payer === option.value
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-muted-foreground",
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </MagazineCard>
      </div>
    </section>
  );
}
