"use client";

import { MessageSquareQuote, Save } from "lucide-react";
import { useState } from "react";
import { MagazineCard } from "@/components/ui/MagazineCard";
import { updateDayAction } from "@/features/trip/api/tripActions";
import { cn } from "@/lib/utils";

interface DayNotesProps {
  dayId: string;
  initialNotes?: string;
  isAdmin?: boolean;
}

export default function DayNotes({ dayId, initialNotes = "", isAdmin }: DayNotesProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateDayAction(dayId, { notes });
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save notes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (!isAdmin && !initialNotes) return null;

  return (
    <MagazineCard padding="lg" className="border-border bg-background/50 backdrop-blur-sm">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-2xl">
            <MessageSquareQuote size={20} />
          </div>
          <div>
            <h3 className="font-playfair text-foreground text-xl font-black">Daily Reflections</h3>
            <p className="text-muted-foreground text-[10px] font-black tracking-widest uppercase">
              Memories of the Day
            </p>
          </div>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            disabled={isSaving}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] font-black tracking-widest uppercase transition-all active:scale-95",
              isEditing
                ? "bg-primary text-primary-foreground shadow-primary/20 shadow-lg"
                : "bg-secondary text-foreground hover:bg-secondary/80",
            )}
          >
            {isSaving ? (
              <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : isEditing ? (
              <Save size={14} />
            ) : (
              "Edit Reflections"
            )}
          </button>
        )}
      </div>

      {isEditing ? (
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="今日の出来事や感じたことを自由に書き留めてください..."
          className="rounded-article bg-secondary/30 border-border focus:border-primary/50 focus:ring-primary/20 text-foreground min-h-[200px] w-full border p-6 leading-relaxed font-medium italic outline-hidden transition-all focus:ring-1"
        />
      ) : notes ? (
        <div className="relative">
          <div className="text-primary/10 absolute top-0 left-0 -translate-x-4 -translate-y-4">
            <MessageSquareQuote size={64} />
          </div>
          <p className="font-playfair text-foreground relative z-10 px-4 py-8 text-center text-xl leading-relaxed italic md:text-3xl">
            &ldquo;{notes}&rdquo;
          </p>
        </div>
      ) : (
        <div className="rounded-article border-border/50 border-2 border-dashed py-12 text-center">
          <p className="text-muted-foreground text-sm font-medium italic">まだリフレクションがありません。</p>
        </div>
      )}
    </MagazineCard>
  );
}
