import { cn } from "@/lib/utils";
import PhotoGalleryLightbox from "./client/PhotoGalleryLightbox";

interface PhotoGalleryProps {
  photos: string[];
  className?: string;
}

export default function PhotoGallery({ photos, className }: PhotoGalleryProps) {
  if (!photos || photos.length === 0) return null;

  return (
    <div className={cn("mt-4", className)}>
      <div className="flex items-center gap-2 mb-4">
        <div className="h-1 w-8 bg-rose-500 rounded-full" />
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">Memory Collection</span>
      </div>

      <PhotoGalleryLightbox photos={photos} />
    </div>
  );
}
