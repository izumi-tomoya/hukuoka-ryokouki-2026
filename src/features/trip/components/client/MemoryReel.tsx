'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Play, Pause, Sparkles, MapPin, Clock } from 'lucide-react';
import Image from 'next/image';
import { AnimatePresence, m } from 'framer-motion';

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
  const [direction, setDirection] = useState(0); // -1 for prev, 1 for next

  const next = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isOpen && isPlaying) {
      interval = setInterval(next, 6000); // 6秒ごとに切り替え
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

  const currentPhoto = photos[currentIndex];

  return (
    <div className="fixed inset-0 z-[200] bg-zinc-950 text-white flex flex-col items-center justify-center overflow-hidden">
      {/* ─── Background Layer (Elegant Blur) ─── */}
      <AnimatePresence mode="wait">
        <m.div 
          key={`bg-${currentIndex}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="absolute inset-0 z-0"
        >
          <Image 
            src={currentPhoto.url} 
            alt="bg" 
            fill 
            className="object-cover blur-[100px] scale-125" 
          />
        </m.div>
      </AnimatePresence>

      {/* ─── Grain Effect Overlay ─── */}
      <div className="absolute inset-0 z-1 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      {/* ─── Header ─── */}
      <m.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute top-0 left-0 right-0 z-50 p-6 md:p-10 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md">
            <Sparkles size={16} className="text-primary" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.5em] text-white/40">Memory Reel</span>
            <span className="text-[9px] font-bold text-primary tracking-widest uppercase">Fukuoka 2026 Edition</span>
          </div>
        </div>
        <button 
          onClick={onClose} 
          className="h-12 w-12 flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-full transition-all active:scale-90"
        >
          <X size={24} />
        </button>
      </m.div>

      {/* ─── Main Content ─── */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4 md:px-12 group">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <m.div
            key={currentIndex}
            custom={direction}
            initial={{ opacity: 0, scale: 1.1, x: direction * 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, x: -direction * 50 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full h-[60vh] md:h-[75vh] max-w-6xl"
          >
            {/* Image Container with Ken Burns Effect */}
            <div className="relative w-full h-full overflow-hidden rounded-[2.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] border border-white/10">
              <m.div
                animate={{ scale: [1, 1.08] }}
                transition={{ duration: 6, ease: "linear" }}
                className="w-full h-full"
              >
                <Image 
                  src={currentPhoto.url} 
                  alt={currentPhoto.title || "Memory"} 
                  fill 
                  className="object-cover"
                  priority
                />
              </m.div>
              
              {/* Overlay Gradient */}
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent" />

              {/* Magazine Style Caption Over Image */}
              <div className="absolute bottom-10 left-10 right-10">
                <m.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="space-y-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-px w-8 bg-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Location Insight</span>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="max-w-2xl">
                      <h3 className="font-playfair text-4xl md:text-6xl font-black italic text-white tracking-tight leading-none mb-4">
                        {currentPhoto.title || 'Untitled Moment'}
                      </h3>
                      <div className="flex flex-wrap items-center gap-6 opacity-60">
                        <div className="flex items-center gap-2">
                          <MapPin size={12} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Fukuoka, Japan</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={12} />
                          <span className="text-[10px] font-bold uppercase tracking-widest">{currentPhoto.time || 'Record Time Unknown'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="hidden md:block">
                      <div className="text-right">
                        <span className="block text-[40px] font-playfair font-black text-white/10 leading-none">
                          {String(currentIndex + 1).padStart(2, '0')}
                        </span>
                        <span className="block text-[10px] font-black uppercase tracking-widest text-white/30">
                          of {photos.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </m.div>
              </div>
            </div>
          </m.div>
        </AnimatePresence>

        {/* Navigation Arrows (Magazine Style) */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 flex justify-between px-6 md:px-12 pointer-events-none">
          <button 
            onClick={prev}
            className="h-16 w-16 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/5 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all pointer-events-auto active:scale-90"
          >
            <ChevronLeft size={32} />
          </button>
          <button 
            onClick={next}
            className="h-16 w-16 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/5 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all pointer-events-auto active:scale-90"
          >
            <ChevronRight size={32} />
          </button>
        </div>
      </div>

      {/* ─── Footer Controls ─── */}
      <div className="absolute bottom-0 left-0 right-0 z-50 p-8 md:p-12 flex flex-col items-center gap-8">
        <div className="flex items-center gap-12">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="relative group h-20 w-20 flex items-center justify-center transition-all"
          >
            <div className="absolute inset-0 rounded-full border border-white/10 group-hover:scale-110 transition-transform" />
            <div className="h-16 w-16 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-90 transition-all">
              {isPlaying ? <Pause size={28} fill="currentColor" /> : <Play size={28} className="ml-1" fill="currentColor" />}
            </div>
          </button>
        </div>

        {/* Progress Bar (Elegant) */}
        <div className="w-full max-w-2xl px-10">
          <div className="relative h-px w-full bg-white/10">
            <m.div 
              className="absolute h-px bg-primary shadow-[0_0_10px_rgba(var(--primary),0.8)]"
              initial={{ width: "0%" }}
              animate={{ width: `${((currentIndex + 1) / photos.length) * 100}%` }}
              transition={{ duration: 0.8, ease: "circOut" }}
            />
          </div>
          <div className="mt-4 flex justify-between items-center text-[8px] font-black uppercase tracking-[0.3em] text-white/30">
            <span>Archive Sequence</span>
            <span className="text-white/60">Vol. 01 — Fukuoka Memories</span>
            <span>{currentIndex + 1} / {photos.length}</span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .font-playfair { font-family: 'Playfair Display', serif; }
      `}</style>
    </div>
  );
}
