"use client";

import { Clock, Loader2, MapPin, Plus, Sparkles, Tag, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MagazineCard } from "@/components/ui/MagazineCard";
import { createEventAction } from "@/features/trip/api/tripActions";
import { cn } from "@/lib/utils";

interface Props {
  dayId: string;
}

const EVENT_TYPES = [
  { value: "sightseeing", label: "観光", emoji: "🏛️" },
  { value: "food", label: "食事", emoji: "🍽️" },
  { value: "transport", label: "移動", emoji: "🚃" },
  { value: "shopping", label: "買い物", emoji: "🛍️" },
  { value: "hotel", label: "ホテル", emoji: "🏨" },
  { value: "surprise", label: "サプライズ", emoji: "🎁" },
  { value: "basic", label: "その他", emoji: "📍" },
];

export default function AddPlanButton({ dayId }: Props) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      time: formData.get("time"),
      type: formData.get("type"),
      title: formData.get("title"),
      desc: formData.get("desc"),
      tag: formData.get("type"),
      tagLabel: formData.get("tagLabel") || formData.get("type"),
      foodName: formData.get("foodName"),
      foodDesc: formData.get("foodDesc"),
      highlight: formData.get("highlight"),
      locationUrl: formData.get("locationUrl"),
      isConfirmed: formData.get("isConfirmed") === "true",
    };

    try {
      const result = await createEventAction(dayId, data);
      if (result.success) {
        setIsOpen(false);
        router.refresh();
      } else {
        alert(result.error);
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
        className="flex items-center justify-center gap-3 w-full py-6 rounded-[2rem] bg-secondary/50 border-2 border-dashed border-border text-muted-foreground hover:bg-primary/5 hover:border-primary/50 hover:text-primary transition-all group"
      >
        <div className="h-10 w-10 rounded-full bg-background flex items-center justify-center border border-border group-hover:bg-primary group-hover:text-white transition-all">
          <Plus size={20} />
        </div>
        <span className="font-black uppercase tracking-[0.2em] text-[10px]">Add New Plan</span>
      </button>

      {/* Modal */}
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
                  <h3 className="text-xl font-black tracking-tight">New Adventure</h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    予定を追加する
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                    <Clock size={12} /> Time
                  </label>
                  <input
                    name="time"
                    type="time"
                    required
                    defaultValue="10:00"
                    className="w-full rounded-2xl bg-secondary/30 border border-border px-4 py-4 text-sm font-bold focus:bg-background focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                    <Tag size={12} /> Category
                  </label>
                  <select
                    name="type"
                    className="w-full rounded-2xl bg-secondary/30 border border-border px-4 py-4 text-sm font-bold focus:bg-background focus:ring-4 focus:ring-primary/5 outline-none transition-all appearance-none"
                  >
                    {EVENT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.emoji} {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Title
                  </label>
                  <input
                    name="title"
                    required
                    placeholder="例: 太宰府天満宮でお参り"
                    className="w-full rounded-2xl bg-secondary/30 border border-border px-4 py-4 text-sm font-bold focus:bg-background focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Tag Label
                  </label>
                  <input
                    name="tagLabel"
                    placeholder="例: 絶品ランチ"
                    className="w-full rounded-2xl bg-secondary/30 border border-border px-4 py-4 text-sm font-bold focus:bg-background focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                  Description
                </label>
                <textarea
                  name="desc"
                  placeholder="見どころや注意点など..."
                  rows={2}
                  className="w-full rounded-2xl bg-secondary/30 border border-border px-4 py-4 text-sm font-bold focus:bg-background focus:ring-4 focus:ring-primary/5 outline-none transition-all resize-none"
                />
              </div>

              <div className="p-5 rounded-3xl bg-amber-500/5 border border-amber-500/10 space-y-4">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-600">
                  <Sparkles size={12} /> Pro Advice & Food Info
                </div>
                <input
                  name="highlight"
                  placeholder="✨ Highlight / 泉へのアドバイス"
                  className="w-full rounded-xl bg-background/50 border border-amber-500/20 px-4 py-3 text-xs font-bold focus:bg-background outline-none transition-all"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    name="foodName"
                    placeholder="料理名"
                    className="w-full rounded-xl bg-background/50 border border-amber-500/20 px-4 py-3 text-xs font-bold focus:bg-background outline-none transition-all"
                  />
                  <input
                    name="foodDesc"
                    placeholder="料理の説明"
                    className="w-full rounded-xl bg-background/50 border border-amber-500/20 px-4 py-3 text-xs font-bold focus:bg-background outline-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                  <MapPin size={12} /> Google Maps URL
                </label>
                <input
                  name="locationUrl"
                  type="url"
                  placeholder="https://goo.gl/maps/..."
                  className="w-full rounded-2xl bg-secondary/30 border border-border px-4 py-4 text-sm font-bold focus:bg-background focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                />
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/30 border border-border">
                <input
                  type="checkbox"
                  name="isConfirmed"
                  value="true"
                  id="isConfirmed"
                  className="h-5 w-5 rounded-md border-border text-primary focus:ring-primary"
                />
                <label
                  htmlFor="isConfirmed"
                  className="text-xs font-bold text-muted-foreground uppercase tracking-widest cursor-pointer"
                >
                  予約・確定済み
                </label>
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
                    <Plus size={18} /> Add to Timeline
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
