'use client';

import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import { MagazineCard } from '@/components/ui/MagazineCard';
import { MapPin, Navigation2 } from 'lucide-react';
import TripMapSkeleton from '../TripMapSkeleton';
import { TripEvent } from '@/features/trip/types/trip';
import { cleanLocationName } from '@/features/trip/utils/locationCatalog';
import type { Location } from '@prisma/client';
import type Leaflet from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

interface MapMarker {
  name: string;
  coords: [number, number];
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
      return { name: displayName, coords: spot ? [spot.lat, spot.lng] as [number, number] : null };
    })
    .filter((m): m is { name: string, coords: [number, number] } => m.coords !== null);

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
            <Marker key={idx} position={marker.coords} icon={customIcon}>
              <Popup className="custom-popup">
                <span className="font-playfair font-bold text-stone-900">{marker.name}</span>
              </Popup>
            </Marker>
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
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 1rem;
          padding: 4px;
        }
      `}</style>
    </div>
  );
}
