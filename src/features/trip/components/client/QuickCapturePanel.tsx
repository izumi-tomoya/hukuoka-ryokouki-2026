"use client";

import { Camera, Image as ImageIcon, Loader2, MessageSquare, Send, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { MagazineCard } from "@/components/ui/MagazineCard";
import { addPhotoToEvent } from "@/features/trip/api/tripActions";
import type { TripEvent } from "@/features/trip/types/trip";
import { appendTemperatureLog, TEMPERATURE_MOODS, type TemperatureMood } from "@/features/trip/utils/clientTripStorage";
import { maskSecretText } from "@/features/trip/utils/tripUtils";
import { cn } from "@/lib/utils";

interface Props {
  tripId: string;
  events: TripEvent[];
}

export default function QuickCapturePanel({ tripId, events }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string>(events[0]?.id || "");
  const [note, setNote] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [mood, setMood] = useState<TemperatureMood>("calm");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventId || (!note && !imageUrl) || isPending) return;

    setIsPending(true);
    try {
      const targetEvent = events.find((event) => event.id === selectedEventId);

      if (targetEvent && note.trim()) {
        appendTemperatureLog(tripId, {
          eventId: selectedEventId,
          eventTitle: targetEvent.title || targetEvent.foodName || "Untitled",
          eventTime: targetEvent.time,
          mood,
          energy: mood === "tired" ? 2 : mood === "joy" ? 5 : 3,
          revisit: mood === "again",
          note: note.trim(),
        });
      }

      // 本来は画像アップロード後にURLを取得しますが、ここではデモ的にURLを直接入れるか、
      // 既存のActionを呼び出します
      if (imageUrl) {
        await addPhotoToEvent(selectedEventId, imageUrl);
      }
      setNote("");
      setImageUrl("");
      setMood("calm");
      setIsOpen(false);
    } catch (err) {
      console.error("Failed to capture quick memoir:", err);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <>
      {/* ─── Floating Action Button ─── */}
      <button
        onClick={() => setIsOpen(true)}
        className="group fixed right-8 bottom-8 z-[500] flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-white shadow-2xl transition-all hover:scale-110 active:scale-95"
      >
        <div className="bg-primary absolute inset-0 animate-ping rounded-full opacity-0 transition-opacity group-hover:opacity-20" />
        <PlusIcon className={cn("transition-transform duration-500", isOpen ? "rotate-45" : "rotate-0")} />
      </button>

      {/* ─── Backdrop ─── */}
      {isOpen && (
        <div
          className="animate-in fade-in fixed inset-0 z-[1100] bg-black/60 backdrop-blur-sm duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* ─── Panel ─── */}
      <div
        className={cn(
          "fixed inset-x-4 bottom-8 z-[1200] transition-all duration-500 ease-out md:inset-x-auto md:right-8 md:w-[400px]",
          isOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-20 opacity-0",
        )}
      >
        <MagazineCard padding="lg" className="shadow-3xl overflow-hidden border-white/10 bg-zinc-900 text-white">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-primary" />
              <span className="text-[10px] font-black tracking-[0.3em] text-white/60 uppercase">Quick Memoir</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/40 transition-colors hover:text-white">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Event Selector */}
            <div className="space-y-2">
              <label className="text-[9px] font-black tracking-widest text-white/40 uppercase">Which moment?</label>
              <select
                value={selectedEventId}
                onChange={(e) => setSelectedEventId(e.target.value)}
                className="focus:ring-primary w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition-all focus:ring-1 focus:outline-hidden"
              >
                {events.map((event) => (
                  <option key={event.id} value={event.id} className="bg-zinc-900">
                    {event.time} - {maskSecretText(event.title || event.foodName || "", false)}
                  </option>
                ))}
              </select>
            </div>

            {/* Note Input */}
            <div className="space-y-2">
              <label className="text-[9px] font-black tracking-widest text-white/40 uppercase">What happened?</label>
              <div className="relative">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="今の気持ちを一言で..."
                  rows={3}
                  className="focus:ring-primary w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-sm transition-all placeholder:text-white/20 focus:ring-1 focus:outline-hidden"
                />
                <MessageSquare size={14} className="absolute right-4 bottom-4 text-white/20" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black tracking-widest text-white/40 uppercase">Temperature</label>
              <div className="grid grid-cols-5 gap-2">
                {Object.entries(TEMPERATURE_MOODS).map(([value, config]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setMood(value as TemperatureMood)}
                    className={cn(
                      "min-h-11 rounded-2xl border px-2 text-[10px] font-black tracking-[0.14em] uppercase transition-colors",
                      mood === value
                        ? "border-primary bg-primary text-black"
                        : "border-white/10 bg-white/5 text-white/70",
                    )}
                  >
                    <span className="block text-sm">{config.emoji}</span>
                    <span>{config.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Photo Preview (Placeholder) */}
            <div className="space-y-2">
              <label className="text-[9px] font-black tracking-widest text-white/40 uppercase">Add Photo</label>
              <input
                type="url"
                value={imageUrl}
                onChange={(event) => setImageUrl(event.target.value)}
                placeholder="画像URLを貼ると、そのまま保存できます"
                className="focus:ring-primary w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm placeholder:text-white/20 focus:ring-1 focus:outline-hidden"
              />
              <div className="flex gap-3">
                <button
                  type="button"
                  className="hover:border-primary/50 flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/10 bg-white/5 py-6 text-white/60 transition-all hover:bg-white/10"
                >
                  <Camera size={24} />
                  <span className="text-[10px] font-bold tracking-widest uppercase">Camera</span>
                </button>
                <button
                  type="button"
                  className="hover:border-primary/50 flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-white/10 bg-white/5 py-6 text-white/60 transition-all hover:bg-white/10"
                >
                  <ImageIcon size={24} />
                  <span className="text-[10px] font-bold tracking-widest uppercase">Gallery</span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending || (!note && !imageUrl)}
              className="bg-primary shadow-primary/20 flex h-14 w-full items-center justify-center gap-3 rounded-2xl text-xs font-black tracking-[0.2em] text-black uppercase shadow-lg transition-all hover:scale-[1.02] active:scale-98 disabled:scale-100 disabled:opacity-30"
            >
              {isPending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <Send size={16} /> Record Memory
                </>
              )}
            </button>
          </form>
        </MagazineCard>
      </div>
    </>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}
