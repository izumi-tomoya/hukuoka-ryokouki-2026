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
        className="bg-secondary/50 border-border text-muted-foreground hover:bg-primary/5 hover:border-primary/50 hover:text-primary group flex w-full items-center justify-center gap-3 rounded-[2rem] border-2 border-dashed py-6 transition-all"
      >
        <div className="bg-background border-border group-hover:bg-primary flex h-10 w-10 items-center justify-center rounded-full border transition-all group-hover:text-white">
          <Plus size={20} />
        </div>
        <span className="text-[10px] font-black tracking-[0.2em] uppercase">Add New Plan</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="bg-background/80 animate-in fade-in absolute inset-0 backdrop-blur-xl duration-300"
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
                  <h3 className="text-xl font-black tracking-tight">New Adventure</h3>
                  <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
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
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-muted-foreground ml-1 flex items-center gap-2 text-[10px] font-black tracking-widest uppercase">
                    <Clock size={12} /> Time
                  </label>
                  <input
                    name="time"
                    type="time"
                    required
                    defaultValue="10:00"
                    className="bg-secondary/30 border-border focus:bg-background focus:ring-primary/5 w-full rounded-2xl border px-4 py-4 text-sm font-bold transition-all outline-none focus:ring-4"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-muted-foreground ml-1 flex items-center gap-2 text-[10px] font-black tracking-widest uppercase">
                    <Tag size={12} /> Category
                  </label>
                  <select
                    name="type"
                    className="bg-secondary/30 border-border focus:bg-background focus:ring-primary/5 w-full appearance-none rounded-2xl border px-4 py-4 text-sm font-bold transition-all outline-none focus:ring-4"
                  >
                    {EVENT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.emoji} {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-muted-foreground ml-1 text-[10px] font-black tracking-widest uppercase">
                    Title
                  </label>
                  <input
                    name="title"
                    required
                    placeholder="例: 太宰府天満宮でお参り"
                    className="bg-secondary/30 border-border focus:bg-background focus:ring-primary/5 w-full rounded-2xl border px-4 py-4 text-sm font-bold transition-all outline-none focus:ring-4"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-muted-foreground ml-1 text-[10px] font-black tracking-widest uppercase">
                    Tag Label
                  </label>
                  <input
                    name="tagLabel"
                    placeholder="例: 絶品ランチ"
                    className="bg-secondary/30 border-border focus:bg-background focus:ring-primary/5 w-full rounded-2xl border px-4 py-4 text-sm font-bold transition-all outline-none focus:ring-4"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-muted-foreground ml-1 text-[10px] font-black tracking-widest uppercase">
                  Description
                </label>
                <textarea
                  name="desc"
                  placeholder="見どころや注意点など..."
                  rows={2}
                  className="bg-secondary/30 border-border focus:bg-background focus:ring-primary/5 w-full resize-none rounded-2xl border px-4 py-4 text-sm font-bold transition-all outline-none focus:ring-4"
                />
              </div>

              <div className="space-y-4 rounded-3xl border border-amber-500/10 bg-amber-500/5 p-5">
                <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-amber-600 uppercase">
                  <Sparkles size={12} /> Pro Advice & Food Info
                </div>
                <input
                  name="highlight"
                  placeholder="✨ Highlight / 泉へのアドバイス"
                  className="bg-background/50 focus:bg-background w-full rounded-xl border border-amber-500/20 px-4 py-3 text-xs font-bold transition-all outline-none"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    name="foodName"
                    placeholder="料理名"
                    className="bg-background/50 focus:bg-background w-full rounded-xl border border-amber-500/20 px-4 py-3 text-xs font-bold transition-all outline-none"
                  />
                  <input
                    name="foodDesc"
                    placeholder="料理の説明"
                    className="bg-background/50 focus:bg-background w-full rounded-xl border border-amber-500/20 px-4 py-3 text-xs font-bold transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-muted-foreground ml-1 flex items-center gap-2 text-[10px] font-black tracking-widest uppercase">
                  <MapPin size={12} /> Google Maps URL
                </label>
                <input
                  name="locationUrl"
                  type="url"
                  placeholder="https://goo.gl/maps/..."
                  className="bg-secondary/30 border-border focus:bg-background focus:ring-primary/5 w-full rounded-2xl border px-4 py-4 text-sm font-bold transition-all outline-none focus:ring-4"
                />
              </div>

              <div className="bg-secondary/30 border-border flex items-center gap-3 rounded-2xl border p-4">
                <input
                  type="checkbox"
                  name="isConfirmed"
                  value="true"
                  id="isConfirmed"
                  className="border-border text-primary focus:ring-primary h-5 w-5 rounded-md"
                />
                <label
                  htmlFor="isConfirmed"
                  className="text-muted-foreground cursor-pointer text-xs font-bold tracking-widest uppercase"
                >
                  予約・確定済み
                </label>
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
