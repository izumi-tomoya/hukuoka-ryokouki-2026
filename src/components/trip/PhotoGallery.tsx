import Image from "next/image";
import { cn } from "@/lib/utils";
import { AdminGuard } from "./AdminGuard";

interface PhotoGalleryProps {
  photos: string[];
  className?: string;
}

export default function PhotoGallery({ photos, className }: PhotoGalleryProps) {
  if (!photos.length) return null;

  return (
    <div className={cn("mt-3 grid gap-2", photos.length === 1 ? "grid-cols-1" : "grid-cols-2", className)}>
      {photos.map((photo, i) => (
        <div 
          key={i} 
          className={cn(
            "relative aspect-square overflow-hidden rounded-xl border border-white/10 shadow-sm",
            photos.length % 2 !== 0 && i === 0 ? "col-span-2 aspect-video" : ""
          )}
        >
          <Image
            src={photo}
            alt={`Photo ${i + 1}`}
            fill
            className="object-cover transition-transform duration-500 hover:scale-110"
          />
          {/* AdminGuard はサーバーコンポーネントとしてここで使う */}
          <AdminGuard>
            <button className="absolute bottom-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm transition-opacity hover:bg-black/60">
              📸
            </button>
          </AdminGuard>
        </div>
      ))}
      <AdminGuard>
        <button className="col-span-full mt-1 flex items-center justify-center gap-2 rounded-lg border border-dashed border-stone-300 py-3 text-[10px] font-bold text-stone-400 transition-colors hover:border-orange-300 hover:bg-orange-50 hover:text-orange-600">
          <span>＋ 写真を追加してカスタマイズ</span>
        </button>
      </AdminGuard>
    </div>
  );
}
