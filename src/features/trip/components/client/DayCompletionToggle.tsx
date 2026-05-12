"use client";

import { CheckCircle2, Circle } from "lucide-react";
import { useState } from "react";
import { toggleDayCompletionAction } from "@/features/trip/api/tripActions";
import { cn } from "@/lib/utils";

interface DayCompletionToggleProps {
  dayId: string;
  initialCompleted?: boolean;
}

export default function DayCompletionToggle({ dayId, initialCompleted = false }: DayCompletionToggleProps) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const nextStatus = !isCompleted;
      await toggleDayCompletionAction(dayId, nextStatus);
      setIsCompleted(nextStatus);
    } catch (error) {
      console.error("Failed to toggle completion:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={cn(
        "group flex items-center gap-4 px-8 py-5 rounded-[2.5rem] bg-card border transition-all hover:shadow-2xl active:scale-95",
        isCompleted
          ? "border-emerald-500/30 text-emerald-600 shadow-emerald-500/5"
          : "border-border text-foreground hover:border-primary/50",
      )}
    >
      <div
        className={cn(
          "h-12 w-12 rounded-2xl flex items-center justify-center transition-all",
          isCompleted
            ? "bg-emerald-500 text-white"
            : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground",
        )}
      >
        {isLoading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : isCompleted ? (
          <CheckCircle2 size={24} />
        ) : (
          <Circle size={24} />
        )}
      </div>
      <div className="text-left">
        <span className="block text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-1">
          Trip Progress
        </span>
        <span className="block text-sm font-bold tracking-tight">
          {isCompleted ? "このチャプターを完了" : "この日を終了済みにする"}
        </span>
      </div>
    </button>
  );
}
