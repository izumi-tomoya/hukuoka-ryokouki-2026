'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PhotoGalleryLightboxProps {
  photos: string[];
}

export default function PhotoGalleryLightbox({ photos }: PhotoGalleryLightboxProps) {
  const [index, setIndex] = useState<number | null>(null);

  // ESCキーで閉じる
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIndex(null);
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [index]);

  const next = () => setIndex((prev) => (prev === null ? null : (prev + 1) % photos.length));
  const prev = () => setIndex((prev) => (prev === null ? null : (prev - 1 + photos.length) % photos.length));

  return (
    <div className="mt-4">
      {/* Grid Display */}
      <div className={cn(
        "grid gap-3",
        photos.length === 1 ? "grid-cols-1" : "grid-cols-2 md:grid-cols-3"
      )}>
        {photos.map((photo, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={cn(
              "group relative overflow-hidden rounded-[2rem] border border-white shadow-sm transition-all hover:shadow-xl active:scale-[0.98]",
              photos.length % 3 !== 0 && i === 0 && photos.length > 2 ? "md:col-span-2 md:aspect-[21/9]" : "aspect-square"
            )}
          >
            <Image
              src={photo}
              alt={`Travel moment ${i + 1}`}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white">
                <Maximize2 size={20} />
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Overlay */}
      {index !== null && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-stone-950/95 backdrop-blur-xl animate-in fade-in duration-300">
          <button 
            onClick={() => setIndex(null)}
            className="absolute top-8 right-8 z-10 h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all"
          >
            <X size={24} />
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-4 md:left-8 z-10 h-14 w-14 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all"
          >
            <ChevronLeft size={32} />
          </button>

          <button 
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-4 md:right-8 z-10 h-14 w-14 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all"
          >
            <ChevronRight size={32} />
          </button>

          <div className="relative h-[80vh] w-[90vw] md:w-[70vw]">
            <Image
              src={photos[index]}
              alt="Gallery Preview"
              fill
              className="object-contain animate-in zoom-in-95 duration-500"
              priority
            />
          </div>

          {/* Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
            {photos.map((_, i) => (
              <div 
                key={i} 
                className={cn(
                  "h-1.5 transition-all rounded-full",
                  i === index ? "w-8 bg-rose-500" : "w-1.5 bg-white/20"
                )}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
