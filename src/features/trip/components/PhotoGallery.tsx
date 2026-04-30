import { cn } from "@/lib/utils";
import { TripMedia } from "../types/trip";
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
          <div className="flex min-w-0 items-center gap-2 mb-4">
            <div className="h-1 w-8 shrink-0 bg-rose-500 rounded-full" />
            <span className="truncate text-[10px] font-black uppercase tracking-[0.16em] sm:tracking-[0.3em] text-stone-400">Memory Collection</span>
          </div>
          <PhotoGalleryLightbox photos={photos} eventId={eventId} />
        </>
      )}
    </div>
  );
}
