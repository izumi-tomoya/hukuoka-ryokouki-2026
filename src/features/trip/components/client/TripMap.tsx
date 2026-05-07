'use client';

import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MagazineCard } from '@/components/ui/MagazineCard';
import { MapPin, Navigation2, X } from 'lucide-react';
import TripMapSkeleton from '../TripMapSkeleton';
import { TripEvent } from '@/features/trip/types/trip';
import { cleanLocationName } from '@/features/trip/utils/locationCatalog';
import type { Location } from '@prisma/client';
import type Leaflet from 'leaflet';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { ExternalSpotInfo } from './ExternalSpotInfo';

interface MapMarker {
  name: string;
  coords: [number, number];
  address?: string | null;
  category?: string | null;
  locationUrl?: string;
  description?: string;
  events: Array<{
    title: string;
    time: string;
    description?: string;
    locationUrl?: string;
  }>;
}

function MapController({ markers, L }: { markers: MapMarker[], L: typeof Leaflet }) {
  const map = useMap();
  
  useEffect(() => {
    if (markers.length > 0 && L && map) {
      const bounds = L.latLngBounds(markers.map((m) => m.coords));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [markers, L, map]);

  return null;
}

export default function TripMap({ 
  events, 
  isAdmin = false,
  locationMaster = [] 
}: { 
  events: TripEvent[], 
  isAdmin?: boolean,
  locationMaster?: Location[]
}) {
  const [L, setL] = useState<typeof Leaflet | null>(null);
  const [customIcon, setCustomIcon] = useState<Leaflet.DivIcon | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  useEffect(() => {
    import('leaflet').then((leaflet) => {
      setL(leaflet);
      const icon = leaflet.divIcon({
        className: 'custom-div-icon',
        html: `<div class="w-4 h-4 bg-rose-500 rounded-full border-2 border-white shadow-lg ring-4 ring-rose-500/20"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
      setCustomIcon(icon as Leaflet.DivIcon);
    });
  }, []);

  const markers = events
    .map(event => {
      const title = event.title || event.foodName || "";
      const cleaned = cleanLocationName(title);
      
      // シークレット判定
      const isSecret = !isAdmin && (cleaned.includes('ヒルトン') || cleaned.includes('CLOUDS') || cleaned.includes('サプライズ') || (event.tag === 'surprise'));
      
      // データベースから取得したマスタから座標を検索
      const spot = locationMaster.find(loc => {
        const cleanedMaster = cleanLocationName(loc.name);
        return cleaned.includes(cleanedMaster) || cleanedMaster.includes(cleaned);
      });
      
      const displayName = isSecret ? '🎁 Surprise Spot' : title;
      return {
        name: displayName,
        coords: spot ? [spot.lat, spot.lng] as [number, number] : null,
        address: spot?.address,
        category: spot?.category,
        locationUrl: event.locationUrl,
        description: event.foodDesc || event.desc || event.highlight,
        rawTitle: title,
        time: event.time,
      };
    })
    .filter((m): m is {
      name: string;
      coords: [number, number];
      address: string | null | undefined;
      category: string | null | undefined;
      locationUrl: string | undefined;
      description: string | undefined;
      rawTitle: string;
      time: string;
    } => m.coords !== null)
    .reduce<MapMarker[]>((acc, marker) => {
      const existing = acc.find((item) => item.name === marker.name && item.coords[0] === marker.coords[0] && item.coords[1] === marker.coords[1]);

      if (existing) {
        existing.events.push({
          title: marker.rawTitle,
          time: marker.time,
          description: marker.description,
          locationUrl: marker.locationUrl,
        });
        if (!existing.locationUrl && marker.locationUrl) existing.locationUrl = marker.locationUrl;
        if (!existing.description && marker.description) existing.description = marker.description;
        if (!existing.address && marker.address) existing.address = marker.address;
        if (!existing.category && marker.category) existing.category = marker.category;
        return acc;
      }

      acc.push({
        name: marker.name,
        coords: marker.coords,
        address: marker.address,
        category: marker.category,
        locationUrl: marker.locationUrl,
        description: marker.description,
        events: [{
          title: marker.rawTitle,
          time: marker.time,
          description: marker.description,
          locationUrl: marker.locationUrl,
        }],
      });
      return acc;
    }, []);

  if (!L || !customIcon) return <TripMapSkeleton />;

  if (markers.length === 0) {
    return (
      <MagazineCard className="h-80 flex flex-col items-center justify-center text-stone-400 bg-stone-50 border-stone-100 rounded-[3rem] shadow-sm">
        <MapPin size={32} className="mb-2 opacity-20" />
        <p className="text-[10px] font-black uppercase tracking-widest">No matching locations for map</p>
      </MagazineCard>
    );
  }

  const center = markers.length > 0 ? markers[0].coords : [33.5902, 130.4017] as [number, number];

  return (
    <div className="group relative">
      <div className="relative h-80 w-full rounded-[3.5rem] overflow-hidden border border-rose-100 shadow-2xl shadow-rose-100/20 bg-stone-50 ring-1 ring-rose-100/50">
        <MapContainer 
          center={center} 
          zoom={13} 
          style={{ height: '100%', width: '100%', minHeight: '320px' }}
          scrollWheelZoom={true}
          zoomControl={true}
        >
          <MapController markers={markers} L={L} />
          <TileLayer
            attribution='&copy; Google'
            url="https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          />
          {markers.map((marker, idx) => (
            <Marker
              key={idx}
              position={marker.coords}
              icon={customIcon}
              eventHandlers={{
                click: () => setSelectedMarker(marker),
              }}
            />
          ))}
        </MapContainer>
        
        {/* Floating Label */}
        <div className="absolute top-6 left-6 z-[400] flex flex-col gap-1 pointer-events-none">
          <div className="bg-stone-900/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-stone-800 shadow-xl flex items-center gap-2 max-w-fit">
            <div className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white">Cartography</span>
          </div>
        </div>
      </div>

      <div className="mt-5 px-2">
        {selectedMarker ? (
          <MagazineCard className="border-rose-200/80 bg-card shadow-xl shadow-rose-100/20">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400">Selected Pin</div>
                <h3 className="mt-2 break-words font-playfair text-2xl font-bold text-foreground">{selectedMarker.name}</h3>
                {selectedMarker.category && (
                  <div className="mt-3 inline-flex rounded-full bg-rose-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-rose-500">
                    {selectedMarker.category}
                  </div>
                )}
              </div>
              <button
                onClick={() => setSelectedMarker(null)}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:text-foreground"
                aria-label="選択中のピン情報を閉じる"
              >
                <X size={16} />
              </button>
            </div>

            {selectedMarker.events.length > 0 && (
              <div className="mt-6">
                <div className="mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Moments Here</div>
                <div className="flex flex-wrap gap-2">
                  {selectedMarker.events.map((event, eventIndex) => (
                    <div key={`${event.time}-${eventIndex}`} className="rounded-full border border-border bg-secondary/30 px-3 py-1.5 text-[11px] font-bold text-foreground">
                      {event.time} {event.title}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(selectedMarker.description || selectedMarker.address || selectedMarker.events[0]?.description) && (
              <div className="mt-6 rounded-[1.5rem] border border-border bg-secondary/15 px-4 py-4 text-sm leading-relaxed text-muted-foreground">
                <p className="text-foreground">
                  {selectedMarker.description || selectedMarker.events[0]?.description}
                </p>
                {selectedMarker.address && (
                  <p className="mt-3 text-xs text-muted-foreground">{selectedMarker.address}</p>
                )}
              </div>
            )}

            <div className="mt-6 max-h-[28rem] overflow-y-auto pr-1 overscroll-contain">
              <ExternalSpotInfo
                name={selectedMarker.events[0]?.title || selectedMarker.name}
                lat={selectedMarker.coords[0]}
                lng={selectedMarker.coords[1]}
                category={selectedMarker.category || undefined}
                address={selectedMarker.address || undefined}
                description={selectedMarker.description || selectedMarker.events[0]?.description}
                locationUrl={selectedMarker.locationUrl}
              />
            </div>
          </MagazineCard>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-rose-200 bg-rose-50/40 px-5 py-4 text-sm text-muted-foreground">
            ピンをタップすると、この場所の予定とスポット情報を下に表示します。
          </div>
        )}
      </div>

      {/* Caption */}
      <div className="mt-5 px-4 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-rose-200" />
            <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] italic">
              Fig. 04 — Itinerary Mapping
            </p>
          </div>
          <div className="flex items-baseline gap-2 pl-16">
            <span className="font-playfair text-3xl font-bold text-stone-900 leading-none">{markers.length}</span>
            <span className="text-[10px] font-black uppercase tracking-widest text-rose-400 border-l border-rose-100 pl-2 py-0.5">Verified Stops</span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 pr-4">
          <div className="flex items-center gap-2 text-[9px] font-black text-rose-300 uppercase tracking-[0.2em]">
            <Navigation2 size={10} className="fill-rose-300" />
            Coordinates Synchronized
          </div>
          <p className="text-[10px] font-medium text-stone-300 italic">Scale: Auto — Fukuoka Central</p>
        </div>
      </div>

      <style jsx global>{`
        .leaflet-container {
          background: #f5f5f4 !important;
          height: 100% !important;
          width: 100% !important;
        }
      `}</style>
    </div>
  );
}
