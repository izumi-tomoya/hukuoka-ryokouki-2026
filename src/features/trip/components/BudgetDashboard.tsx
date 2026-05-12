import { PieChart, TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { MagazineCard } from "@/components/ui/MagazineCard";
import { cn } from "@/lib/utils";
import type { BudgetStats } from "../utils/tripUtils";

interface Props {
  stats: BudgetStats;
}

export default function BudgetDashboard({ stats }: Props) {
  const { totalPlanned, totalActual, byCategory } = stats;
  const isOverBudget = totalActual > totalPlanned;
  const difference = Math.abs(totalActual - totalPlanned);

  return (
    <div className="space-y-6">
      <div className="mb-6 flex items-center gap-3 px-0 sm:px-2 md:mb-8">
        <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl">
          <Wallet size={22} />
        </div>
        <div className="min-w-0">
          <h2 className="text-foreground text-2xl leading-none font-black tracking-tight break-words">
            Financial Overview
          </h2>
          <p className="text-muted-foreground mt-1 text-[10px] font-black tracking-[0.14em] uppercase sm:tracking-[0.2em]">
            Trip Budget Tracking
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* ─── Total Summary ─── */}
        <MagazineCard
          padding="lg"
          className="group relative flex min-w-0 flex-col justify-between overflow-hidden lg:col-span-1"
        >
          <div
            className={cn(
              "absolute top-0 right-0 h-32 w-32 translate-x-1/2 -translate-y-1/2 opacity-20 blur-[80px] transition-colors duration-1000",
              isOverBudget ? "bg-rose-500" : "bg-emerald-500",
            )}
          />

          <div>
            <span className="text-muted-foreground text-[10px] font-black tracking-[0.14em] uppercase sm:tracking-widest">
              Total Actual Expense
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="font-playfair text-foreground text-4xl font-black break-words sm:text-5xl">
                ¥{totalActual.toLocaleString()}
              </span>
            </div>
            <div
              className={cn(
                "mt-4 inline-flex max-w-full items-center gap-2 rounded-full px-3 py-1 text-[10px] font-black tracking-[0.12em] uppercase sm:tracking-widest",
                isOverBudget ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500",
              )}
            >
              {isOverBudget ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {isOverBudget ? "Over Budget" : "Under Budget"} by ¥{difference.toLocaleString()}
            </div>
          </div>

          <div className="border-border mt-8 border-t pt-6 md:mt-12 md:pt-8">
            <div className="text-muted-foreground mb-2 flex justify-between gap-3 text-[10px] font-black tracking-[0.12em] uppercase sm:tracking-widest">
              <span>Planned Budget</span>
              <span>¥{totalPlanned.toLocaleString()}</span>
            </div>
            <div className="bg-secondary border-border h-3 w-full overflow-hidden rounded-full border">
              <div
                className={cn(
                  "h-full transition-all duration-1000 ease-out",
                  isOverBudget ? "bg-rose-500" : "bg-emerald-500",
                )}
                style={{ width: `${Math.min((totalActual / totalPlanned) * 100, 100)}%` }}
              />
            </div>
          </div>
        </MagazineCard>

        {/* ─── Breakdown ─── */}
        <MagazineCard padding="lg" className="min-w-0 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between md:mb-8">
            <h3 className="text-muted-foreground flex items-center gap-2 text-xs font-black tracking-[0.14em] uppercase sm:tracking-[0.2em]">
              <PieChart size={14} /> Category Breakdown
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Visual Bars */}
            <div className="space-y-5">
              {byCategory.map((cat, i) => (
                <div key={i} className="group">
                  <div className="mb-2 flex justify-between text-[11px] font-bold">
                    <span className="text-foreground break-words">{cat.category}</span>
                    <span className="text-muted-foreground">¥{cat.actual.toLocaleString()}</span>
                  </div>
                  <div className="bg-secondary h-2 w-full overflow-hidden rounded-full">
                    <div
                      className="h-full transition-all duration-700 group-hover:opacity-80"
                      style={{
                        width: `${(cat.actual / totalActual) * 100}%`,
                        backgroundColor: cat.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Stats List */}
            <div className="bg-secondary/20 border-border/50 rounded-3xl border p-4 sm:p-6">
              <div className="space-y-4">
                {byCategory.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-muted-foreground truncate text-xs font-medium">{cat.category}</span>
                    </div>
                    <span className="text-foreground text-xs font-black">
                      {Math.round((cat.actual / totalActual) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </MagazineCard>
      </div>
    </div>
  );
}
