'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, Maximize2, Trash2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { deletePhotoFromEvent } from '@/features/trip/api/tripActions';
import { TripMedia } from '../../types/trip';

interface PhotoGalleryLightboxProps {
  photos: TripMedia[];
  eventId?: string;
}

export default function PhotoGalleryLightbox({ photos, eventId }: PhotoGalleryLightboxProps) {
  const [index, setIndex] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = async (e: React.MouseEvent, url: string) => {
    e.stopPropagation();
    if (!eventId || !confirm('この写真を削除してもよろしいですか？')) return;

    setIsDeleting(true);
    try {
      const result = await deletePhotoFromEvent(eventId, url);
      if (result.success) {
        setIndex(null);
      } else {
        alert('削除に失敗しました: ' + result.error);
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('エラーが発生しました');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mt-4">
      {/* Grid Display */}
      <div className={cn(
        "grid gap-3",
        photos.length === 1 ? "grid-cols-1" : "grid-cols-2 md:grid-cols-3"
      )}>
        {photos.map((photo, i) => (
          <div
            key={photo.id}
            className={cn(
              "group relative overflow-hidden rounded-[2rem] border border-border bg-muted shadow-sm transition-all hover:shadow-xl active:scale-[0.98]",
              photos.length % 3 !== 0 && i === 0 && photos.length > 2 ? "md:col-span-2 md:aspect-[21/9]" : "aspect-square"
            )}
          >
            <button
              onClick={() => setIndex(i)}
              className="w-full h-full relative"
            >
              <Image
                src={photo.url}
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

            {/* Grid Delete Button (Hover) */}
            {eventId && (
              <button 
                onClick={(e) => handleDelete(e, photo.url)}
                disabled={isDeleting}
                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-rose-500 backdrop-blur-sm"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
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

          {/* Lightbox Delete Button */}
          {eventId && (
            <button 
              onClick={(e) => handleDelete(e, photos[index].url)}
              disabled={isDeleting}
              className="absolute top-8 left-8 z-10 flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 text-rose-400 hover:bg-rose-500/20 transition-all border border-rose-500/20"
            >
              {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
              <span className="text-xs font-bold uppercase tracking-widest">Delete Photo</span>
            </button>
          )}

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
              src={photos[index].url}
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
