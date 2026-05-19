"use client";

import type { Location } from "@prisma/client";
import { Info, MapPin, Navigation2, Star, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Polyline, TileLayer, useMap, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { MagazineCard } from "@/components/ui/MagazineCard";
import type { TripEvent } from "@/features/trip/types/trip";
import { cleanLocationName } from "@/features/trip/utils/locationCatalog";
import { isSecretEvent, maskSecretText } from "@/features/trip/utils/tripUtils";
import { useModalStore } from "@/lib/store/useModalStore";
import { cn } from "@/lib/utils";
import { getWeatherData } from "@/lib/weather";
import TripMapSkeleton from "../TripMapSkeleton";

// --- Leaflet Fix for Marker Icons ---
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Helper to auto-fit bounds
function MapController({ markers }: { markers: any[] }) {
  const map = useMap();
  useEffect(() => {
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map((m) => [m.coords.lat, m.coords.lng]));
      map.fitBounds(bounds, { padding: [60, 60] });
    }
  }, [markers, map]);
  return null;
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
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [envStats, setEnvStats] = useState<any>(null);

  // Markers processing - Wrapped in useMemo to prevent unnecessary zoom resets
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

        return {
          name: isSecret ? "🎁 Surprise Spot" : title,
          coords: isSecret ? null : spot ? { lat: spot.lat, lng: spot.lng } : null,
          description: isSecret ? "当日までのお楽しみ" : event.foodDesc || event.desc || event.highlight,
        };
      })
      .filter((m): m is any => m.coords !== null);
  }, [events, locationMaster, isAdmin]);

  useEffect(() => {
    setIsLoaded(true);
    const fetchWeather = async () => {
      const data = await getWeatherData("福岡市");
      if (data) setEnvStats({ temp: data.current?.temp });
    };
    fetchWeather();
  }, []);

  const customMarkerIcon = L.divIcon({
    className: "custom-div-icon",
    html: `<div class="relative flex items-center justify-center">
             <div class="absolute w-10 h-10 bg-rose-500/25 rounded-full animate-ping"></div>
             <div class="w-5 h-5 bg-rose-500 rounded-full border-[3px] border-white shadow-xl shadow-rose-200/50"></div>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });

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
          "relative h-[420px] w-full overflow-hidden rounded-[3.5rem] border border-rose-100 bg-slate-200 shadow-2xl transition-all duration-700",
          isModalOpen && "scale-[0.98] opacity-40 blur-[2px]",
        )}
      >
        <MapContainer
          center={[33.5902, 130.4017]}
          zoom={13}
          zoomControl={false}
          style={{ height: "100%", width: "100%" }}
        >
          <MapController markers={markersData} />

          {/* --- The "Magic" Tile Layer: Direct Google Maps Tiles --- */}
          {/* lyrs=m: Standard Roadmap */}
          <TileLayer
            attribution="&copy; Google Maps"
            url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            subdomains={["mt0", "mt1", "mt2", "mt3"]}
            maxZoom={20}
          />

          {markersData.map((m, i) => (
            <Marker
              key={i}
              position={[m.coords.lat, m.coords.lng]}
              icon={customMarkerIcon}
              eventHandlers={{ click: () => setSelectedMarker(m) }}
            />
          ))}

          {markersData.length >= 2 && (
            <Polyline
              positions={markersData.map((m) => [m.coords.lat, m.coords.lng])}
              color="#f43f5e"
              weight={5}
              opacity={0.5}
              lineCap="round"
              lineJoin="round"
            />
          )}

          {/* Reposition controls to match Google Maps (bottom right) */}
          <ZoomControl position="bottomright" />
        </MapContainer>

        {/* UI Overlays */}
        {!isModalOpen && (
          <div className="animate-in fade-in pointer-events-none absolute top-6 left-6 z-[1000] flex items-center gap-2 rounded-full border border-stone-800 bg-stone-900/90 px-4 py-2 shadow-xl backdrop-blur-md">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-500" />
            <span className="text-[9px] font-black tracking-[0.3em] text-white uppercase italic">
              Geospatial Intelligence
            </span>
            {envStats && (
              <span className="ml-2 border-l border-white/20 pl-2 text-[9px] font-black text-rose-300">
                {envStats.temp}°C
              </span>
            )}
          </div>
        )}

        {/* Bottom Logo Attribution (Google Style) */}
        <div className="pointer-events-none absolute bottom-5 left-8 z-[1000] flex items-baseline gap-1 opacity-40">
          <span className="text-[10px] font-black tracking-tighter text-stone-600">Google</span>
        </div>
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
                onClick={() => setSelectedMarker(null)}
                className="rounded-full p-2 transition-colors hover:bg-rose-50"
              >
                <X size={16} />
              </button>
            </div>
            <p className="text-muted-foreground mt-3 text-sm leading-relaxed italic">{selectedMarker.description}</p>
          </MagazineCard>
        </div>
      )}

      <style jsx global>{`
        .leaflet-container {
          background: #e5e7eb !important;
          cursor: crosshair !important;
        }
        /* Custom Zoom Control Styling to match Google */
        .leaflet-bar {
          border: none !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
          border-radius: 12px !important;
          overflow: hidden;
        }
        .leaflet-bar a {
          background-color: white !important;
          color: #666 !important;
          border-bottom: 1px solid #f0f0f0 !important;
        }
      `}</style>
    </div>
  );
}
