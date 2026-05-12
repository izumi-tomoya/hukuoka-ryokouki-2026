import { cn } from "@/lib/utils";
import type { TripMedia } from "../types/trip";
import PhotoGalleryLightbox from "./client/PhotoGalleryLightbox";

interface PhotoGalleryProps {
  photos: TripMedia[];
  eventId?: string;
  className?: string;
}

export default function PhotoGallery({ photos, eventId, className }: PhotoGalleryProps) {
  return (
    <div className={cn("mt-4", className)}>
      {photos.length > 0 && (
        <>
          <div className="mb-4 flex min-w-0 items-center gap-2">
            <div className="h-1 w-8 shrink-0 rounded-full bg-rose-500" />
            <span className="truncate text-[10px] font-black tracking-[0.16em] text-stone-400 uppercase sm:tracking-[0.3em]">
              Memory Collection
            </span>
          </div>
          <PhotoGalleryLightbox photos={photos} eventId={eventId} />
        </>
      )}
    </div>
  );
}
