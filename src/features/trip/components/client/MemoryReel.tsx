"use client";

import { AnimatePresence, m } from "framer-motion";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileText,
  MapPin,
  Pause,
  Play,
  Sparkles,
  X,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

export interface MemoryReelPhoto {
  url: string;
  title?: string;
  time?: string;
  dateLabel?: string;
  location?: string;
  description?: string;
  dayLabel?: string;
}

interface Props {
  photos: MemoryReelPhoto[];
  isOpen: boolean;
  onClose: () => void;
}

export default function MemoryReel({ photos, isOpen, onClose }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [direction, setDirection] = useState(0);

  const next = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (isOpen && isPlaying) {
      interval = setInterval(next, 5500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, isPlaying, next]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "Escape") onClose();
      if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((playing) => !playing);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, next, onClose, prev]);

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];
  const progress = ((currentIndex + 1) / photos.length) * 100;

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden bg-[#120e0c] text-white">
      <AnimatePresence mode="wait">
        <m.div
          key={`bg-${currentIndex}`}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 0.45, scale: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={currentPhoto.url}
            alt="background memory"
            fill
            className="scale-125 object-cover blur-[110px] saturate-[1.15]"
          />
        </m.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#f59e0b33,transparent_32%),linear-gradient(180deg,rgba(15,10,8,0.25),rgba(15,10,8,0.94))]" />
      <div className="absolute inset-0 [background-image:linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.35)_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.06]" />

      <m.div
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-0 right-0 left-0 z-30 flex items-center justify-between px-5 py-5 md:px-10 md:py-8"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-md">
            <Sparkles size={16} className="text-amber-300" />
          </div>
          <div>
            <p className="text-[10px] font-black tracking-[0.38em] text-white/45 uppercase">Memory Reel</p>
            <p className="mt-1 text-sm font-semibold text-white/80">旅のハイライトを全画面で再生</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/10 backdrop-blur-md transition-all hover:bg-white/15 active:scale-95"
        >
          <X size={22} />
        </button>
      </m.div>

      <div className="group relative z-10 flex h-full w-full flex-col items-center justify-center px-4 pt-24 pb-40 md:px-12 md:pt-28 md:pb-44">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <m.div
            key={currentIndex}
            custom={direction}
            initial={{ opacity: 0, scale: 1.06, x: direction * 60 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.94, x: direction * -60 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="grid w-full max-w-7xl items-stretch gap-6 lg:grid-cols-[minmax(0,1.25fr)_380px]"
          >
            <div className="relative min-h-[52vh] overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
              <m.div
                animate={{ scale: [1, 1.08] }}
                transition={{ duration: 5.5, ease: "linear" }}
                className="h-full w-full"
              >
                <Image
                  src={currentPhoto.url}
                  alt={currentPhoto.title || "Memory"}
                  fill
                  priority
                  className="object-cover"
                />
              </m.div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

              <div className="absolute right-0 bottom-0 left-0 p-6 md:p-10">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-[10px] font-black tracking-[0.25em] text-amber-200 uppercase backdrop-blur-md">
                  <Sparkles size={12} />
                  Highlight Frame
                </div>
                <h3 className="font-playfair max-w-3xl text-4xl leading-[0.95] font-black tracking-tight text-white italic md:text-6xl">
                  {currentPhoto.title || "Untitled Moment"}
                </h3>
              </div>
            </div>

            <div className="flex flex-col justify-between rounded-[2rem] border border-white/10 bg-black/30 p-5 backdrop-blur-xl md:p-7">
              <div>
                <div className="mb-6 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black tracking-[0.3em] text-white/40 uppercase">Frame Data</p>
                    <p className="font-playfair mt-2 text-3xl font-black text-white italic">
                      {String(currentIndex + 1).padStart(2, "0")}
                    </p>
                  </div>
                  <p className="text-right text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">
                    of {String(photos.length).padStart(2, "0")}
                  </p>
                </div>

                <div className="space-y-4">
                  <MetaRow
                    icon={<CalendarDays size={14} />}
                    label="When"
                    value={[currentPhoto.dayLabel, currentPhoto.dateLabel].filter(Boolean).join(" / ") || "日付未設定"}
                  />
                  <MetaRow icon={<Clock3 size={14} />} label="Time" value={currentPhoto.time || "時刻未設定"} />
                  <MetaRow icon={<MapPin size={14} />} label="Where" value={currentPhoto.location || "場所情報なし"} />
                  <MetaRow
                    icon={<FileText size={14} />}
                    label="What"
                    value={currentPhoto.description || currentPhoto.title || "メモなし"}
                    multiline
                  />
                </div>
              </div>

              <div className="mt-8">
                <div className="mb-3 flex items-center justify-between text-[10px] font-black tracking-[0.2em] text-white/35 uppercase">
                  <span>Sequence Progress</span>
                  <span>
                    {currentIndex + 1} / {photos.length}
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <m.div
                    className="h-full rounded-full bg-gradient-to-r from-amber-300 via-rose-300 to-orange-400"
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>
          </m.div>
        </AnimatePresence>

        <div className="pointer-events-none absolute inset-x-0 top-1/2 z-20 flex -translate-y-1/2 justify-between px-4 md:px-10">
          <button
            onClick={prev}
            className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white opacity-0 backdrop-blur-md transition-all group-hover:opacity-100 hover:bg-black/45 active:scale-95"
          >
            <ChevronLeft size={28} />
          </button>
          <button
            onClick={next}
            className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white opacity-0 backdrop-blur-md transition-all group-hover:opacity-100 hover:bg-black/45 active:scale-95"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      </div>

      <div className="absolute right-0 bottom-0 left-0 z-30 px-5 pb-6 md:px-10 md:pb-10">
        <div className="mx-auto max-w-7xl rounded-[1.75rem] border border-white/10 bg-black/35 p-4 backdrop-blur-xl md:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying((playing) => !playing)}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black shadow-[0_0_24px_rgba(255,255,255,0.25)] transition-all hover:scale-105 active:scale-95"
              >
                {isPlaying ? (
                  <Pause size={24} fill="currentColor" />
                ) : (
                  <Play size={24} className="ml-0.5" fill="currentColor" />
                )}
              </button>
              <div>
                <p className="text-[10px] font-black tracking-[0.25em] text-white/40 uppercase">Playback</p>
                <p className="mt-1 text-sm font-medium text-white/80">{isPlaying ? "自動再生中" : "一時停止中"}</p>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2 md:flex md:max-w-[420px] md:flex-1 md:justify-end">
              {photos.slice(Math.max(0, currentIndex - 2), Math.min(photos.length, currentIndex + 3)).map((photo) => {
                const photoIndex = photos.findIndex((item) => item.url === photo.url);
                const active = photoIndex === currentIndex;
                return (
                  <button
                    key={`${photo.url}-${photoIndex}`}
                    onClick={() => {
                      setDirection(photoIndex > currentIndex ? 1 : -1);
                      setCurrentIndex(photoIndex);
                    }}
                    className={`relative h-14 overflow-hidden rounded-2xl border transition-all ${
                      active ? "scale-[1.02] border-amber-300" : "border-white/10 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <Image src={photo.url} alt={photo.title || "thumbnail"} fill className="object-cover" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .font-playfair {
          font-family: "Playfair Display", serif;
        }
      `}</style>
    </div>
  );
}

function MetaRow({
  icon,
  label,
  value,
  multiline = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  multiline?: boolean;
}) {
  return (
    <div className="rounded-3xl border border-white/8 bg-white/[0.04] px-4 py-3">
      <div className="mb-2 flex items-center gap-2 text-[10px] font-black tracking-[0.25em] text-white/38 uppercase">
        {icon}
        <span>{label}</span>
      </div>
      <p className={`text-sm text-white/85 ${multiline ? "leading-6" : ""}`}>{value}</p>
    </div>
  );
}
