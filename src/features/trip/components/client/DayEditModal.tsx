"use client";

import { Edit3, Loader2, Save, Sparkles, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MagazineCard } from "@/components/ui/MagazineCard";
import { updateDayAction } from "@/features/trip/api/tripActions";

interface DayEditModalProps {
  dayId: string;
  initialTitle?: string;
  initialHighlight?: string;
  isAdmin?: boolean;
}

export default function DayEditModal({ dayId, initialTitle = "", initialHighlight = "", isAdmin }: DayEditModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [title, setTitle] = useState(initialTitle);
  const [highlight, setHighlight] = useState(initialHighlight);

  if (!isAdmin) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);

    try {
      const result = await updateDayAction(dayId, { title, highlight });
      if (result.success) {
        setIsOpen(false);
        router.refresh();
      } else {
        alert("更新に失敗しました");
      }
    } catch (err) {
      console.error(err);
      alert("エラーが発生しました");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="border-border bg-background text-muted-foreground hover:text-primary hover:border-primary/30 flex h-10 w-10 items-center justify-center rounded-full border shadow-sm transition-all"
      >
        <Edit3 size={18} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close modal"
            className="bg-background/80 animate-in fade-in absolute inset-0 cursor-default backdrop-blur-xl duration-300"
            onClick={() => setIsOpen(false)}
          />

          <MagazineCard
            padding="lg"
            className="shadow-3xl animate-in zoom-in-95 relative z-10 w-full max-w-lg duration-300"
          >
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-2xl text-white">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">Edit Day Info</h3>
                  <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
                    一日のタイトルとハイライトを編集
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="day-title"
                  className="text-muted-foreground ml-1 text-[10px] font-black tracking-widest uppercase"
                >
                  Title
                </label>
                <input
                  id="day-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Day Title"
                  className="bg-secondary/30 border-border focus:bg-background focus:ring-primary/5 w-full rounded-2xl border px-4 py-4 text-sm font-bold transition-all outline-none focus:ring-4"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="day-highlight"
                  className="text-muted-foreground ml-1 text-[10px] font-black tracking-widest uppercase"
                >
                  Highlight
                </label>
                <textarea
                  id="day-highlight"
                  value={highlight}
                  onChange={(e) => setHighlight(e.target.value)}
                  placeholder="一日のキャッチコピー・意気込み..."
                  rows={3}
                  className="bg-secondary/30 border-border focus:bg-background focus:ring-primary/5 w-full resize-none rounded-2xl border px-4 py-4 text-sm font-bold italic transition-all outline-none focus:ring-4"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="bg-foreground text-background flex w-full items-center justify-center gap-3 rounded-2xl py-5 text-xs font-black tracking-[0.2em] uppercase shadow-xl transition-all hover:opacity-90 active:scale-95 disabled:opacity-50"
              >
                {isPending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <>
                    <Save size={18} /> Save Changes
                  </>
                )}
              </button>
            </form>
          </MagazineCard>
        </div>
      )}
    </>
  );
}
