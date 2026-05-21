"use client";

import { ChevronLeft, ChevronRight, Loader2, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { deletePhotoFromEvent } from "@/features/trip/api/tripActions";
import { cn } from "@/lib/utils";
import type { TripMedia } from "../../types/trip";

interface Props {
  photos: TripMedia[];
  eventId?: string;
}

export default function PhotoGalleryLightbox({ photos, eventId }: Props) {
  const [index, setIndex] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [animating, setAnimating] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const thumbsRef = useRef<HTMLDivElement>(null);

  const navigate = useCallback(
    (dir: "left" | "right") => {
      if (index === null || animating) return;
      setDirection(dir);
      setAnimating(true);
      setTimeout(() => {
        setIndex((prev) =>
          prev === null
            ? null
            : dir === "right"
              ? (prev + 1) % photos.length
              : (prev - 1 + photos.length) % photos.length,
        );
        setAnimating(false);
      }, 220);
    },
    [index, animating, photos.length],
  );

  const next = useCallback(() => navigate("right"), [navigate]);
  const prev = useCallback(() => navigate("left"), [navigate]);

  // キーボード
  useEffect(() => {
    if (index === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [index, next, prev]);

  // サムネイルスクロール同期
  useEffect(() => {
    if (index === null || !thumbsRef.current) return;
    const el = thumbsRef.current.children[index] as HTMLElement;
    el?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [index]);

  const handleDelete = async (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    if (!eventId || !confirm("この写真を削除しますか？")) return;
    setIsDeleting(true);
    try {
      const result = await deletePhotoFromEvent(eventId, url);
      if (result.success) setIndex(null);
      else alert(`削除失敗: ${result.error}`);
    } catch {
      alert("エラーが発生しました");
    } finally {
      setIsDeleting(false);
    }
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  return (
    <div className="mt-4">
      {/* Grid */}
      <div className={cn("grid gap-2.5", photos.length === 1 ? "grid-cols-1" : "grid-cols-2 md:grid-cols-3")}>
        {photos.map((photo, i) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => { setDirection("right"); setIndex(i); }}
            className={cn(
              "group border-border bg-muted relative overflow-hidden rounded-[1.75rem] border shadow-sm transition-all duration-500 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.97]",
              photos.length % 3 !== 0 && i === 0 && photos.length > 2
                ? "md:col-span-2 aspect-[21/9]"
                : "aspect-square",
            )}
          >
            <Image
              src={photo.url}
              alt={`Memory ${i + 1}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/15" />
            <div className="absolute inset-0 flex items-end justify-end p-3 opacity-0 transition-opacity group-hover:opacity-100">
              <div className="rounded-full bg-black/30 px-2 py-1 text-[9px] font-black text-white/80 backdrop-blur-sm">
                {i + 1} / {photos.length}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Slideshow Lightbox */}
      {index !== null && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col bg-stone-950"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* Top bar */}
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <div className="text-[10px] font-black tracking-[0.3em] text-white/40 uppercase">
              Memory Collection
            </div>
            <div className="flex items-center gap-4">
              <span className="font-playfair text-sm font-bold text-white/60">
                {index + 1} <span className="text-white/30">/</span> {photos.length}
              </span>
              {eventId && (
                <button
                  type="button"
                  onClick={(e) => handleDelete(e, photos[index].url)}
                  disabled={isDeleting}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-white/40 transition-colors hover:bg-rose-500/20 hover:text-rose-400"
                >
                  {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
              )}
              <button
                type="button"
                onClick={() => setIndex(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Main image */}
          <div className="relative flex flex-1 items-center justify-center overflow-hidden px-16">
            {/* Prev */}
            <button
              type="button"
              onClick={prev}
              className="absolute left-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white/70 transition-all hover:bg-white/15 hover:text-white active:scale-95"
            >
              <ChevronLeft size={28} />
            </button>

            {/* Image with slide animation */}
            <div
              className={cn(
                "relative h-full w-full max-w-4xl transition-all duration-220",
                animating && direction === "right" && "translate-x-[-40px] opacity-0",
                animating && direction === "left" && "translate-x-[40px] opacity-0",
                !animating && "translate-x-0 opacity-100",
              )}
              style={{ transition: "transform 220ms ease, opacity 220ms ease" }}
            >
              <Image
                src={photos[index].url}
                alt={`Memory ${index + 1}`}
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Next */}
            <button
              type="button"
              onClick={next}
              className="absolute right-4 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-white/70 transition-all hover:bg-white/15 hover:text-white active:scale-95"
            >
              <ChevronRight size={28} />
            </button>
          </div>

          {/* Thumbnail strip */}
          <div className="px-6 pt-4 pb-8">
            <div
              ref={thumbsRef}
              className="no-scrollbar flex gap-2 overflow-x-auto"
            >
              {photos.map((photo, i) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => { setDirection(i > index ? "right" : "left"); setIndex(i); }}
                  className={cn(
                    "relative h-14 w-14 shrink-0 overflow-hidden rounded-xl transition-all duration-300",
                    i === index
                      ? "ring-2 ring-rose-500 ring-offset-2 ring-offset-stone-950 opacity-100 scale-110"
                      : "opacity-40 hover:opacity-70",
                  )}
                >
                  <Image src={photo.url} alt={`Thumb ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
