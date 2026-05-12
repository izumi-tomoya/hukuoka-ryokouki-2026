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
        "group bg-card flex items-center gap-4 rounded-[2.5rem] border px-8 py-5 transition-all hover:shadow-2xl active:scale-95",
        isCompleted
          ? "border-emerald-500/30 text-emerald-600 shadow-emerald-500/5"
          : "border-border text-foreground hover:border-primary/50",
      )}
    >
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-2xl transition-all",
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
        <span className="text-muted-foreground mb-1 block text-[10px] font-black tracking-[0.3em] uppercase">
          Trip Progress
        </span>
        <span className="block text-sm font-bold tracking-tight">
          {isCompleted ? "このチャプターを完了" : "この日を終了済みにする"}
        </span>
      </div>
    </button>
  );
}
