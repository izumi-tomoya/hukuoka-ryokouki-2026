"use client";

import {
  Accessibility,
  Clock,
  CreditCard,
  Dog,
  DoorOpen,
  ExternalLink,
  JapaneseYen,
  MapPin,
  Moon,
  Navigation,
  ParkingSquare,
  Store,
  Ticket,
  Train,
  UtensilsCrossed,
  Wifi,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { MagazineCard } from "@/components/ui/MagazineCard";
import { cn } from "@/lib/utils";

interface NearbySpot {
  name: string;
  address?: string;
  category?: string;
  lat?: string;
  lng?: string;
}

interface SpotInfo {
  source: "hotpepper" | "yahoo" | "memoir";
  name: string;
  address: string;
  description: string;
  image: string;
  open: string;
  url: string;
  budget: string;
  category: string;
  tags: string[];
  couponUrl: string;
  lunch?: string;
  midnight?: string;
  stationName?: string;
  nearby?: NearbySpot[];
}

interface ExternalSpotInfoProps {
  name: string;
  lat?: number;
  lng?: number;
  category?: string;
  address?: string;
  description?: string;
  locationUrl?: string;
  compact?: boolean;
}

const sourceLabel: Record<SpotInfo["source"], string> = {
  hotpepper: "HotPepper Gourmet",
  yahoo: "Yahoo Local",
  memoir: "Memoir Note",
};

export function ExternalSpotInfo({
  name,
  lat,
  lng,
  category,
  address,
  description,
  locationUrl,
  compact = false,
}: ExternalSpotInfoProps) {
  const [info, setInfo] = useState<SpotInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchInfo() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ name });
        if (typeof lat === "number") params.set("lat", String(lat));
        if (typeof lng === "number") params.set("lng", String(lng));
        if (category) params.set("category", category);
        if (address) params.set("address", address);
        if (description) params.set("description", description);
        if (locationUrl) params.set("locationUrl", locationUrl);

        const res = await fetch(`/api/external/spot?${params.toString()}`);
        if (!res.ok) return;

        const data = await res.json();
        setInfo(data);
      } finally {
        setLoading(false);
      }
    }

    if (name) fetchInfo();
  }, [address, category, description, lat, lng, locationUrl, name]);

  const fallback = useMemo<SpotInfo | null>(() => {
    if (!name) return null;
    return {
      source: "memoir",
      name,
      address: address || "",
      description: description || "",
      image: "",
      open: "",
      url: locationUrl || "",
      budget: "",
      category: category || "",
      tags: [category || ""].filter(Boolean),
      couponUrl: "",
      nearby: [],
    };
  }, [address, category, description, locationUrl, name]);

  const display = info || fallback;

  if (loading && !display) {
    return <div className={cn("bg-secondary/50 w-full animate-pulse rounded-2xl", compact ? "h-32" : "h-24")} />;
  }

  if (!display) return null;

  const source = sourceLabel[display.source];
  const tags = display.tags.filter(Boolean).slice(0, compact ? 2 : 4);

  return (
    <MagazineCard
      padding={compact ? "sm" : "sm"}
      className={cn("overflow-hidden border-rose-500/10 bg-rose-500/5", compact && "rounded-3xl")}
    >
      <div className="flex flex-col gap-4">
        {display.image && !compact && (
          <div className="relative -mx-4 -mt-4 mb-2 h-40">
            <Image src={display.image} alt={display.name} fill className="object-cover" />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
            <div className="absolute right-4 bottom-4 left-4">
              <div className="mb-1 text-[10px] font-black tracking-widest text-rose-300 uppercase">{source}</div>
              <div className="text-sm leading-tight font-bold text-white">{display.description || display.name}</div>
            </div>
          </div>
        )}

        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="mb-1 text-[10px] font-black tracking-widest text-rose-400 uppercase">{source}</div>
            <h3 className={cn("text-foreground font-bold", compact ? "text-sm" : "text-base")}>{display.name}</h3>
            {!display.image && display.description && (
              <p className="text-muted-foreground mt-2 text-[11px] leading-relaxed">{display.description}</p>
            )}
          </div>
          <Store size={compact ? 14 : 16} className="shrink-0 text-rose-500" />
        </div>

        <div className="space-y-3">
          {display.open && (
            <div className="flex items-start gap-3">
              <Clock size={14} className="mt-0.5 shrink-0 text-rose-500" />
              <div className="text-muted-foreground text-[11px] leading-relaxed">{display.open}</div>
            </div>
          )}
          {display.budget && (
            <div className="flex items-center gap-3">
              <JapaneseYen size={14} className="shrink-0 text-rose-500" />
              <div className="text-foreground text-[11px] font-bold">{display.budget}</div>
            </div>
          )}
          {(display.address || address) && (
            <div className="flex items-start gap-3">
              <MapPin size={14} className="mt-0.5 shrink-0 text-rose-500" />
              <div className="text-muted-foreground text-[11px]">{display.address || address}</div>
            </div>
          )}
          {display.stationName && (
            <div className="flex items-center gap-3">
              <Train size={14} className="shrink-0 text-rose-500" />
              <div className="text-muted-foreground text-[11px]">{display.stationName}駅近</div>
            </div>
          )}
        </div>

        {(tags.length > 0 || display.category || display.lunch || display.midnight) && (
          <div className="flex flex-wrap gap-2 pt-1">
            {(display.category && !tags.includes(display.category) ? [display.category, ...tags] : tags)
              .slice(0, compact ? 3 : 5)
              .map((tag) => (
                <div key={tag} className="rounded-full bg-white/80 px-2 py-0.5 text-[9px] font-bold text-rose-500">
                  {tag}
                </div>
              ))}
            {display.lunch?.includes("あり") && (
              <div className="flex items-center gap-1 rounded-full bg-orange-50 px-2 py-0.5 text-[9px] font-bold text-orange-600">
                <UtensilsCrossed size={10} /> ランチ
              </div>
            )}
            {display.midnight?.includes("あり") && (
              <div className="flex items-center gap-1 rounded-full bg-violet-50 px-2 py-0.5 text-[9px] font-bold text-violet-600">
                <Moon size={10} /> 深夜
              </div>
            )}
            {display.tags.some((tag) => tag.includes("Wi-Fi")) && (
              <div className="flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[9px] font-bold text-sky-600">
                <Wifi size={10} /> Wi-Fi
              </div>
            )}
            {display.tags.some((tag) => tag.includes("カード")) && (
              <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-600">
                <CreditCard size={10} /> Card
              </div>
            )}
            {display.tags.some((tag) => tag.includes("バリア")) && (
              <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-bold text-amber-600">
                <Accessibility size={10} /> Accessible
              </div>
            )}
            {display.tags.some((tag) => tag.includes("ペット")) && (
              <div className="flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 text-[9px] font-bold text-indigo-600">
                <Dog size={10} /> Pet OK
              </div>
            )}
            {display.tags.some((tag) => tag.includes("駐車場")) && (
              <div className="flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 text-[9px] font-bold text-slate-600">
                <ParkingSquare size={10} /> 駐車場
              </div>
            )}
            {display.tags.some((tag) => tag.includes("個室")) && (
              <div className="flex items-center gap-1 rounded-full bg-pink-50 px-2 py-0.5 text-[9px] font-bold text-pink-600">
                <DoorOpen size={10} /> 個室
              </div>
            )}
          </div>
        )}

        {display.nearby && display.nearby.length > 0 && !compact && (
          <div className="border-border bg-background/70 rounded-2xl border p-3">
            <div className="text-muted-foreground mb-2 text-[10px] font-black tracking-widest uppercase">Nearby</div>
            <div className="space-y-2">
              {display.nearby.slice(0, 2).map((spot) => (
                <div
                  key={`${spot.name}-${spot.address || ""}`}
                  className="text-muted-foreground text-[11px] leading-relaxed"
                >
                  <span className="text-foreground font-bold">{spot.name}</span>
                  {spot.category ? ` / ${spot.category}` : ""}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className={cn("grid gap-2", compact ? "grid-cols-1" : "grid-cols-2")}>
          {(display.url || locationUrl) && (
            <a
              href={display.url || locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              suppressHydrationWarning
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-2 rounded-xl border border-rose-100 bg-white py-3 text-[10px] font-black tracking-widest text-rose-500 uppercase transition-all hover:bg-rose-50"
            >
              {display.source === "hotpepper" ? "詳細を見る" : "外部リンク"}
              <ExternalLink size={12} />
            </a>
          )}
          {locationUrl && (
            <a
              href={locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              suppressHydrationWarning
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-2 rounded-xl bg-rose-500 py-3 text-[10px] font-black tracking-widest text-white uppercase transition-all hover:bg-rose-600"
            >
              地図で開く
              <Navigation size={12} />
            </a>
          )}
          {!compact && display.couponUrl && (
            <a
              href={display.couponUrl}
              target="_blank"
              rel="noopener noreferrer"
              suppressHydrationWarning
              onClick={(e) => e.stopPropagation()}
              className="flex items-center justify-center gap-2 rounded-xl bg-rose-500 py-3 text-[10px] font-black tracking-widest text-white uppercase transition-all hover:bg-rose-600"
            >
              クーポン
              <Ticket size={12} />
            </a>
          )}
        </div>
      </div>
    </MagazineCard>
  );
}
