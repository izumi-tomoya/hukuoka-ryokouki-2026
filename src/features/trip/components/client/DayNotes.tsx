"use client";

import { MessageSquareQuote, Save, Trash2 } from "lucide-react";
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
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <MessageSquareQuote size={20} />
          </div>
          <div>
            <h3 className="font-playfair text-xl font-black text-foreground">Daily Reflections</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Memories of the Day
            </p>
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
            disabled={isSaving}
            className={cn(
              "inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all active:scale-95",
              isEditing
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
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
          className="w-full min-h-[200px] p-6 rounded-article bg-secondary/30 border border-border focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all outline-hidden font-medium text-foreground leading-relaxed italic"
        />
      ) : notes ? (
        <div className="relative">
          <div className="absolute top-0 left-0 text-primary/10 -translate-x-4 -translate-y-4">
            <MessageSquareQuote size={64} />
          </div>
          <p className="relative z-10 font-playfair text-xl md:text-3xl italic text-foreground leading-relaxed text-center px-4 py-8">
            &ldquo;{notes}&rdquo;
          </p>
        </div>
      ) : (
        <div className="text-center py-12 rounded-article border-2 border-dashed border-border/50">
          <p className="text-sm font-medium text-muted-foreground italic">まだリフレクションがありません。</p>
        </div>
      )}
    </MagazineCard>
  );
}
