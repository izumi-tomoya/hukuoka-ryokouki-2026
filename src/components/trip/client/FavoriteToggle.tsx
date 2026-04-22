"use client";

import { Star } from "lucide-react";
import { useFavoriteStore } from "@/lib/store/useFavoriteStore";
import { cn } from "@/lib/utils";

export default function FavoriteToggle({ eventId }: { eventId: string }) {
  const { toggleFavorite, isFavorite } = useFavoriteStore();
  const favorite = isFavorite(eventId);

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(eventId);
      }}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full transition-all",
        favorite ? "bg-amber-100" : "bg-stone-100 hover:bg-stone-200"
      )}
    >
      <Star
        size={16}
        className={cn(
          "transition-all",
          favorite ? "fill-amber-400 text-amber-400" : "text-stone-400"
        )}
      />
    </button>
  );
}
