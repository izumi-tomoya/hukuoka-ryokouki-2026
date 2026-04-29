'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause, Maximize2 } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface Photo {
  url: string;
  title?: string;
  time?: string;
}

interface Props {
  photos: Photo[];
  isOpen: boolean;
  onClose: () => void;
}

export default function MemoryReel({ photos, isOpen, onClose }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const next = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const prev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && isPlaying) {
      interval = setInterval(next, 5000);
    }
    return () => clearInterval(interval);
  }, [isOpen, isPlaying, next]);

  // キーボード操作
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'Escape') onClose();
      if (e.key === ' ') setIsPlaying(p => !p);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, next, prev, onClose]);

  if (!isOpen || photos.length === 0) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black text-white flex flex-col items-center justify-center animate-in fade-in duration-500">
      {/* ─── Background Layer (Blurred) ─── */}
      <div className="absolute inset-0 z-0 opacity-40">
        <Image src={photos[currentIndex].url} alt="bg" fill className="object-cover blur-3xl scale-110" />
      </div>

      {/* ─── Header ─── */}
      <div className="absolute top-0 left-0 right-0 z-20 p-6 flex items-center justify-between bg-linear-to-b from-black/60 to-transparent">
        <div className="flex flex-col">
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">Memory Reel</span>
          <h2 className="text-lg font-playfair italic font-bold">
            {photos[currentIndex].title || 'Captured Moment'}
          </h2>
        </div>
        <button onClick={onClose} className="p-3 hover:bg-white/10 rounded-full transition-all active:scale-90">
          <X size={28} />
        </button>
      </div>

      {/* ─── Main Image ─── */}
      <div className="relative z-10 w-full h-[70vh] flex items-center justify-center px-4 md:px-12 group">
        <div className="relative w-full h-full max-w-5xl overflow-hidden rounded-[2rem] shadow-2xl border border-white/5">
          <Image 
            src={photos[currentIndex].url} 
            alt="memory" 
            fill 
            className="object-contain animate-in zoom-in-105 duration-1000"
            priority
          />
        </div>

        {/* Navigation Arrows */}
        <button 
          onClick={prev}
          className="absolute left-6 md:left-16 p-4 rounded-full bg-black/20 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-black/40"
        >
          <ChevronLeft size={32} />
        </button>
        <button 
          onClick={next}
          className="absolute right-6 md:right-16 p-4 rounded-full bg-black/20 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-black/40"
        >
          <ChevronRight size={32} />
        </button>
      </div>

      {/* ─── Footer Controls ─── */}
      <div className="absolute bottom-0 left-0 right-0 z-20 p-8 flex flex-col items-center gap-6 bg-linear-to-t from-black/80 via-black/40 to-transparent">
        <div className="flex items-center gap-8">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="h-16 w-16 rounded-full bg-white text-black flex items-center justify-center shadow-2xl hover:scale-105 active:scale-90 transition-all"
          >
            {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} className="ml-1" fill="currentColor" />}
          </button>
        </div>

        {/* Progress Dots */}
        <div className="flex gap-2 max-w-full overflow-hidden px-10">
          {photos.map((_, i) => (
            <div 
              key={i} 
              className={cn(
                "h-1 transition-all duration-500 rounded-full",
                i === currentIndex ? "w-8 bg-primary" : "w-2 bg-white/20"
              )}
            />
          ))}
        </div>

        <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
          {currentIndex + 1} / {photos.length}
        </div>
      </div>
    </div>
  );
}
