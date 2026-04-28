'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { MagazineCard } from '@/components/ui/MagazineCard';
import { MapPin, Navigation2 } from 'lucide-react';
import TripMapSkeleton from '../TripMapSkeleton';

// SSR を無効化
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

// 福岡の主要スポットデータベース
const FUKUOKA_SPOTS: Record<string, [number, number]> = {
  '博多駅': [33.5897, 130.4206],
  '福岡空港': [33.5859, 130.4507],
  '天神': [33.5902, 130.4017],
  '中洲': [33.5932, 130.4085],
  '大濠公園': [33.5859, 130.3764],
  '福岡タワー': [33.5932, 130.3515],
  'ヒルトン福岡シーホーク': [33.5932, 130.3515],
  'バー＆ダイニング CLOUDS': [33.5932, 130.3515],
  'Afternoon Tea (Secret Spot)': [33.5932, 130.3515],
  'サプライズ・ティータイム': [33.5932, 130.3515],
  '太宰府天満宮': [33.5215, 130.5348],
  '太宰府': [33.5215, 130.5348],
  '糸島': [33.5517, 130.1847],
  'キャナルシティ博多': [33.5898, 130.4109],
  'マリンメッセ福岡': [33.6044, 130.4042],
  'ホテルオークラ福岡': [33.5946, 130.4063],
  '和牛めんたい 神楽': [33.5218, 130.5332],
  '九州国立博物館': [33.5186, 130.5385],
  '水たき 長野': [33.5982, 130.4035],
  '牧のうどん': [33.5859, 130.4507],
  '海鮮屋 はじめの一歩': [33.5898, 130.4109],
  '中洲川端': [33.5941, 130.4072],
  '西鉄福岡': [33.5902, 130.4017],
  '志賀島': [33.6667, 130.3],
  '能古島': [33.6167, 130.3],
  '門司港': [33.9455, 130.9622],
  '天神エリア': [33.5902, 130.4017],
  '中洲エリア': [33.5932, 130.4085],
};

function cleanLocationName(name: string): string {
  const noEmoji = name.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F3FB}-\u{1F3FF}\u{1F400}-\u{1F4FF}\u{1F500}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F300}-\u{1F5FF}]/gu, '');
  return noEmoji.replace(/\(.*\)/g, '').trim();
}

export default function TripMap({ locations }: { locations: string[] }) {
  const [L, setL] = useState<any>(null);
  const [customIcon, setCustomIcon] = useState<any>(null);

  useEffect(() => {
    import('leaflet').then((leaflet) => {
      setL(leaflet);
      // 洗練されたカスタム・ドットマーカーを作成
      const icon = leaflet.divIcon({
        className: 'custom-div-icon',
        html: `<div class="w-4 h-4 bg-rose-500 rounded-full border-2 border-white shadow-lg ring-4 ring-rose-500/20"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8],
      });
      setCustomIcon(icon);
    });
  }, []);

  const markers = locations
    .map(name => {
      const cleaned = cleanLocationName(name);
      const isSecret = cleaned.includes('Secret Spot') || cleaned.includes('サプライズ');
      const spotKey = Object.keys(FUKUOKA_SPOTS).find(key => 
        cleaned.includes(key) || key.includes(cleaned)
      );
      
      const displayName = isSecret ? '🎁 Surprise Spot' : name;
      return { name: displayName, coords: spotKey ? FUKUOKA_SPOTS[spotKey] : null };
    })
    .filter((m): m is { name: string, coords: [number, number] } => m.coords !== null);

  if (!L || !customIcon) return <TripMapSkeleton />;

  if (markers.length === 0) {
    return (
      <MagazineCard className="h-80 flex flex-col items-center justify-center text-stone-400 bg-stone-50 border-stone-100 rounded-[3rem] shadow-sm">
        <MapPin size={32} className="mb-2 opacity-20" />
        <p className="text-[10px] font-black uppercase tracking-widest">No locations to display</p>
      </MagazineCard>
    );
  }

  const center = markers.length > 0 ? markers[0].coords : [33.5902, 130.4017] as [number, number];

  return (
    <div className="group relative">
      {/* Map Container with Magazine styling */}
      <div className="relative h-80 w-full rounded-[3.5rem] overflow-hidden border border-rose-100 shadow-2xl shadow-rose-100/20 bg-stone-50 ring-1 ring-rose-100/50">
        <div className="absolute inset-0 z-10 pointer-events-none ring-[12px] ring-inset ring-white/10" />
        
        <MapContainer 
          center={center} 
          zoom={13} 
          style={{ height: '100%', width: '100%', filter: 'sepia(0.2) contrast(0.9) brightness(1.05)' }}
          scrollWheelZoom={false}
          zoomControl={false} // 標準のズームコントロールを隠す
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" // より清潔感のあるタイル
          />
          {markers.map((marker, idx) => (
            <Marker key={idx} position={marker.coords} icon={customIcon}>
              <Popup className="custom-popup">
                <span className="font-playfair font-bold text-stone-900">{marker.name}</span>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        {/* Floating Label - Like a magazine caption */}
        <div className="absolute top-6 left-6 z-[400] flex flex-col gap-1 pointer-events-none">
          <div className="bg-stone-900/90 backdrop-blur-md px-4 py-1.5 rounded-full border border-stone-800 shadow-xl flex items-center gap-2 max-w-fit">
            <div className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-white">Cartography</span>
          </div>
        </div>
      </div>

      {/* Decorative caption below - Integrated info */}
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
          <p className="text-[10px] font-medium text-stone-300 italic">Scale: 1:13,000 — Fukuoka Central</p>
        </div>
      </div>

      <style jsx global>{`
        .leaflet-container {
          background: #f5f5f4 !important;
        }
        .custom-popup .leaflet-popup-content-wrapper {
          border-radius: 1rem;
          padding: 4px;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        }
        .custom-popup .leaflet-popup-tip {
          background: white;
        }
        .leaflet-bar {
          border: none !important;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
        }
        .leaflet-bar a {
          background-color: rgba(255, 255, 255, 0.8) !important;
          backdrop-filter: blur(8px);
          color: #444 !important;
          border-bottom: 1px solid #f1f1f1 !important;
        }
      `}</style>
    </div>
  );
}
