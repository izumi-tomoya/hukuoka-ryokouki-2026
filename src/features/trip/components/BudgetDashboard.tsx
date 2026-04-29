import { BudgetStats } from "../utils/tripUtils";
import { MagazineCard } from "@/components/ui/MagazineCard";
import { cn } from "@/lib/utils";
import { PieChart, TrendingDown, TrendingUp, Wallet } from "lucide-react";

interface Props {
  stats: BudgetStats;
}

export default function BudgetDashboard({ stats }: Props) {
  const { totalPlanned, totalActual, byCategory } = stats;
  const isOverBudget = totalActual > totalPlanned;
  const difference = Math.abs(totalActual - totalPlanned);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
          <Wallet size={22} />
        </div>
        <div>
          <h2 className="text-2xl font-black text-foreground leading-none tracking-tight">Financial Overview</h2>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-1">Trip Budget Tracking</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ─── Total Summary ─── */}
        <MagazineCard padding="lg" className="lg:col-span-1 flex flex-col justify-between relative overflow-hidden group">
          <div className={cn(
            "absolute top-0 right-0 w-32 h-32 blur-[80px] -translate-y-1/2 translate-x-1/2 opacity-20 transition-colors duration-1000",
            isOverBudget ? "bg-rose-500" : "bg-emerald-500"
          )} />
          
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Total Actual Expense</span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-5xl font-playfair font-black text-foreground">¥{totalActual.toLocaleString()}</span>
            </div>
            <div className={cn(
              "mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
              isOverBudget ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"
            )}>
              {isOverBudget ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {isOverBudget ? 'Over Budget' : 'Under Budget'} by ¥{difference.toLocaleString()}
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">
              <span>Planned Budget</span>
              <span>¥{totalPlanned.toLocaleString()}</span>
            </div>
            <div className="w-full h-3 bg-secondary rounded-full overflow-hidden border border-border">
              <div 
                className={cn(
                  "h-full transition-all duration-1000 ease-out",
                  isOverBudget ? "bg-rose-500" : "bg-emerald-500"
                )} 
                style={{ width: `${Math.min((totalActual / totalPlanned) * 100, 100)}%` }} 
              />
            </div>
          </div>
        </MagazineCard>

        {/* ─── Breakdown ─── */}
        <MagazineCard padding="lg" className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-2">
              <PieChart size={14} /> Category Breakdown
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Visual Bars */}
            <div className="space-y-5">
              {byCategory.map((cat, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between text-[11px] font-bold mb-2">
                    <span className="text-foreground">{cat.category}</span>
                    <span className="text-muted-foreground">¥{cat.actual.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-700 group-hover:opacity-80"
                      style={{ 
                        width: `${(cat.actual / totalActual) * 100}%`,
                        backgroundColor: cat.color
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Stats List */}
            <div className="bg-secondary/20 rounded-3xl p-6 border border-border/50">
              <div className="space-y-4">
                {byCategory.map((cat, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-xs font-medium text-muted-foreground">{cat.category}</span>
                    </div>
                    <span className="text-xs font-black text-foreground">
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
