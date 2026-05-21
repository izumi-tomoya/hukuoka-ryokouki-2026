/// <reference types="@types/google.maps" />
"use client";

import { importLibrary, setOptions } from "@googlemaps/js-api-loader";
import type { Location } from "@prisma/client";
import { MapPin, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { MagazineCard } from "@/components/ui/MagazineCard";
import type { TripEvent } from "@/features/trip/types/trip";
import { cleanLocationName } from "@/features/trip/utils/locationCatalog";
import { isSecretEvent } from "@/features/trip/utils/tripUtils";
import { useModalStore } from "@/lib/store/useModalStore";
import { cn } from "@/lib/utils";
import { getWeatherData } from "@/lib/weather";
import TripMapSkeleton from "../TripMapSkeleton";

// モジュールレベルで一度だけ設定
setOptions({ key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "", v: "weekly" });

interface MapMarker {
  id: string;
  name: string;
  coords: { lat: number; lng: number };
  description?: string;
}

export default function TripMap({
  events,
  isAdmin = false,
  locationMaster = [],
}: {
  events: TripEvent[];
  isAdmin?: boolean;
  locationMaster?: Location[];
}) {
  const { isOpen: isModalOpen } = useModalStore();
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [envStats, setEnvStats] = useState<{ temp?: number } | null>(null);

  const markersData = useMemo(() => {
    return events
      .map((event) => {
        const title = event.title || event.foodName || "";
        const isSecret = isSecretEvent(event, isAdmin);
        const spot = locationMaster.find((loc) => {
          const cleanedMaster = cleanLocationName(loc.name);
          const searchName = event.formalName ? cleanLocationName(event.formalName) : cleanLocationName(title);
          return searchName.includes(cleanedMaster) || cleanedMaster.includes(searchName);
        });
        if (isSecret || !spot) return null;
        return {
          id: event.id || `${spot.lat}-${spot.lng}`,
          name: title,
          coords: { lat: spot.lat, lng: spot.lng },
          description: event.foodDesc || event.desc || event.highlight,
        } as MapMarker;
      })
      .filter((m): m is MapMarker => m !== null);
  }, [events, locationMaster, isAdmin]);

  useEffect(() => {
    const fetchWeather = async () => {
      const data = await getWeatherData("福岡市");
      if (data) setEnvStats({ temp: data.current?.temp });
    };
    fetchWeather();
  }, []);

  useEffect(() => {
    if (!mapRef.current || markersData.length === 0) {
      setIsLoaded(true);
      return;
    }

    let map: google.maps.Map;
    const advMarkers: google.maps.marker.AdvancedMarkerElement[] = [];
    let polyline: google.maps.Polyline | null = null;

    Promise.all([importLibrary("maps"), importLibrary("marker")]).then(([{ Map: GMap }, { AdvancedMarkerElement }]) => {
      if (!mapRef.current) return;

      map = new GMap(mapRef.current, {
        center: markersData[0].coords,
        zoom: 13,
        mapId: "DEMO_MAP_ID",
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_BOTTOM },
        gestureHandling: "cooperative",
      });

      // Fit bounds
      if (markersData.length > 1) {
        const bounds = new google.maps.LatLngBounds();
        for (const m of markersData) bounds.extend(m.coords);
        map.fitBounds(bounds, 80);
      }

      // Custom dot marker HTML
      const makePin = (idx: number) => {
        const el = document.createElement("div");
        el.style.cssText = `
          width:32px;height:32px;border-radius:50%;
          background:#f43f5e;border:3px solid white;
          box-shadow:0 2px 8px rgba(244,63,94,0.4);
          display:flex;align-items:center;justify-content:center;
          color:white;font-size:11px;font-weight:900;
          cursor:pointer;
        `;
        el.textContent = String(idx + 1);
        return el;
      };

      markersData.forEach((m, idx) => {
        const marker = new AdvancedMarkerElement({
          position: m.coords,
          map,
          content: makePin(idx),
          title: m.name,
        });
        marker.addListener("click", () => setSelectedMarker(m));
        advMarkers.push(marker);
      });

      // Route polyline
      if (markersData.length >= 2) {
        polyline = new google.maps.Polyline({
          path: markersData.map((m) => m.coords),
          geodesic: true,
          strokeColor: "#f43f5e",
          strokeOpacity: 0.5,
          strokeWeight: 4,
          map,
        });
      }

      setIsLoaded(true);
    });

    return () => {
      advMarkers.forEach((m) => {
        m.map = null;
      });
      polyline?.setMap(null);
    };
  }, [markersData]);

  if (!isLoaded) return <TripMapSkeleton />;

  if (markersData.length === 0) {
    return (
      <MagazineCard className="bg-secondary/30 border-border/50 flex h-80 flex-col items-center justify-center rounded-[3rem] text-stone-400 shadow-sm">
        <MapPin size={32} className="mb-2 opacity-20" />
        <p className="text-[10px] font-black tracking-widest uppercase">No locations found</p>
      </MagazineCard>
    );
  }

  return (
    <div className="group relative w-full">
      <div
        className={cn(
          "relative h-105 w-full overflow-hidden rounded-[3.5rem] border border-rose-100 bg-slate-200 shadow-2xl transition-all duration-700",
          isModalOpen && "scale-[0.98] opacity-40 blur-[2px]",
        )}
      >
        <div ref={mapRef} className="h-full w-full" />

        {/* Geospatial badge */}
        {!isModalOpen && (
          <div className="animate-in fade-in pointer-events-none absolute top-6 left-6 z-10 flex items-center gap-2 rounded-full border border-stone-800 bg-stone-900/90 px-4 py-2 shadow-xl backdrop-blur-md">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500" />
            <span className="text-[9px] font-black tracking-[0.3em] text-white uppercase italic">Geospatial Path</span>
            {envStats && (
              <span className="ml-2 border-l border-white/20 pl-2 text-[9px] font-black text-rose-300">
                {envStats.temp}°C
              </span>
            )}
          </div>
        )}
      </div>

      {selectedMarker && !isModalOpen && (
        <div className="animate-in fade-in slide-in-from-bottom-2 mt-4 px-2">
          <MagazineCard className="bg-card border-rose-200 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <div className="mb-1 text-[9px] font-black tracking-widest text-rose-400 uppercase">Route Point</div>
                <h3 className="font-playfair text-xl font-bold">{selectedMarker.name}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedMarker(null)}
                className="rounded-full p-2 transition-colors hover:bg-rose-50"
              >
                <X size={16} />
              </button>
            </div>
            {selectedMarker.description && (
              <p className="text-muted-foreground mt-3 text-sm leading-relaxed italic">{selectedMarker.description}</p>
            )}
          </MagazineCard>
        </div>
      )}
    </div>
  );
}
