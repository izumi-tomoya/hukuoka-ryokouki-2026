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
        onClick={() => setIsOpen(true)}
        className="h-10 w-10 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/30 transition-all shadow-sm"
      >
        <Edit3 size={18} />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-xl animate-in fade-in duration-300"
            onClick={() => setIsOpen(false)}
          />

          <MagazineCard
            padding="lg"
            className="relative w-full max-w-lg z-10 shadow-3xl animate-in zoom-in-95 duration-300"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center text-white">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-black tracking-tight">Edit Day Info</h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    一日のタイトルとハイライトを編集
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                  Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Day Title"
                  className="w-full rounded-2xl bg-secondary/30 border border-border px-4 py-4 text-sm font-bold focus:bg-background focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                  Highlight
                </label>
                <textarea
                  value={highlight}
                  onChange={(e) => setHighlight(e.target.value)}
                  placeholder="一日のキャッチコピー・意気込み..."
                  rows={3}
                  className="w-full rounded-2xl bg-secondary/30 border border-border px-4 py-4 text-sm font-bold focus:bg-background focus:ring-4 focus:ring-primary/5 outline-none transition-all resize-none italic"
                />
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="w-full py-5 rounded-2xl bg-foreground text-background text-xs font-black uppercase tracking-[0.2em] shadow-xl hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3"
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
