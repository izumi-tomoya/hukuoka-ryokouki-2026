"use client";

import { MapPin } from "lucide-react";
import { getMapLink } from "@/lib/mapUtils";

export default function MapLink({ url, label = "Google Map で見る" }: { url: string; label?: string }) {
  const handleClick = () => {
    // 試行する。アプリが開かなければブラウザで開く
    window.open(getMapLink(url), "_blank");
  };

  return (
    <button
      onClick={handleClick}
      className="v2-focus mt-4 inline-flex items-center gap-2 rounded-lg text-[10px] font-bold whitespace-nowrap text-rose-500 transition-all hover:gap-3"
    >
      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-50">
        <MapPin size={11} />
      </div>
      {label}
    </button>
  );
}
