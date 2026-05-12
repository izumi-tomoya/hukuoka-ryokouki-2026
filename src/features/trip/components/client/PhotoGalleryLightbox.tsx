"use client";

import { ChevronLeft, ChevronRight, Loader2, Maximize2, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { deletePhotoFromEvent } from "@/features/trip/api/tripActions";
import { cn } from "@/lib/utils";
import type { TripMedia } from "../../types/trip";

interface PhotoGalleryLightboxProps {
  photos: TripMedia[];
  eventId?: string;
}

export default function PhotoGalleryLightbox({ photos, eventId }: PhotoGalleryLightboxProps) {
  const [index, setIndex] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const next = useCallback(
    () => setIndex((prev) => (prev === null ? null : (prev + 1) % photos.length)),
    [photos.length],
  );
  const prev = useCallback(
    () => setIndex((prev) => (prev === null ? null : (prev - 1 + photos.length) % photos.length)),
    [photos.length],
  );

  // ESCキーで閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [next, prev]);

  const handleDelete = async (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    if (!eventId || !confirm("この写真を削除してもよろしいですか？")) return;

    setIsDeleting(true);
    try {
      const result = await deletePhotoFromEvent(eventId, url);
      if (result.success) {
        setIndex(null);
      } else {
        alert(`削除に失敗しました: ${result.error}`);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("エラーが発生しました");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mt-4">
      {/* Grid Display */}
      <div className={cn("grid gap-3", photos.length === 1 ? "grid-cols-1" : "grid-cols-2 md:grid-cols-3")}>
        {photos.map((photo, i) => (
          <div
            key={photo.id}
            className={cn(
              "group border-border bg-muted relative overflow-hidden rounded-[2rem] border shadow-sm transition-all hover:shadow-xl active:scale-[0.98]",
              photos.length % 3 !== 0 && i === 0 && photos.length > 2
                ? "md:col-span-2 md:aspect-21/9"
                : "aspect-square",
            )}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIndex(i);
              }}
              className="relative h-full w-full"
            >
              <Image
                src={photo.url}
                alt={`Travel moment ${i + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-colors group-hover:bg-black/20 group-hover:opacity-100">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-md">
                  <Maximize2 size={20} />
                </div>
              </div>
            </button>

            {/* Grid Delete Button (Hover) */}
            {eventId && (
              <button
                type="button"
                onClick={(e) => handleDelete(e, photo.url)}
                disabled={isDeleting}
                className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 hover:bg-rose-500"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox Overlay */}
      {index !== null && (
        <div className="animate-in fade-in fixed inset-0 z-9999 flex items-center justify-center bg-stone-950/95 backdrop-blur-xl duration-300">
          <button
            type="button"
            onClick={() => setIndex(null)}
            className="absolute top-8 right-8 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20"
          >
            <X size={24} />
          </button>

          {/* Lightbox Delete Button */}
          {eventId && (
            <button
              type="button"
              onClick={(e) => handleDelete(e, photos[index].url)}
              disabled={isDeleting}
              className="absolute top-8 left-8 z-10 flex items-center gap-2 rounded-full border border-rose-500/20 bg-white/5 px-4 py-2.5 text-rose-400 transition-all hover:bg-rose-500/20"
            >
              {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              <span className="text-xs font-bold tracking-widest uppercase">Delete Photo</span>
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            className="absolute left-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-white transition-all hover:bg-white/10 md:left-8"
          >
            <ChevronLeft size={32} />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            className="absolute right-4 z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-white transition-all hover:bg-white/10 md:right-8"
          >
            <ChevronRight size={32} />
          </button>

          <div className="relative h-[80vh] w-[90vw] md:w-[70vw]">
            <Image
              src={photos[index].url}
              alt="Gallery Preview"
              fill
              className="animate-in zoom-in-95 object-contain duration-500"
              priority
            />
          </div>

          {/* Indicator */}
          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-2">
            {photos.map((photo, i) => (
              <div
                key={photo.id}
                className={cn(
                  "h-1.5 rounded-full transition-all",
                  i === index ? "w-8 bg-rose-500" : "w-1.5 bg-white/20",
                )}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
