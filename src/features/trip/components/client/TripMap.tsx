'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { MagazineCard } from '@/components/ui/MagazineCard';
import { MapPin } from 'lucide-react';
import TripMapSkeleton from '../TripMapSkeleton';

// SSR を無効化して MapContainer をロード
const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

// 福岡の主要スポットの簡易座標データベース
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
};

function cleanLocationName(name: string): string {
  // 絵文字を除去
  const noEmoji = name.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E6}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F3FB}-\u{1F3FF}\u{1F400}-\u{1F4FF}\u{1F500}-\u{1F5FF}\u{1F900}-\u{1F9FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F300}-\u{1F5FF}]/gu, '');
  // (KAGURA) などの括弧内を除去したり、前後の空白を削除
  return noEmoji.replace(/\(.*\)/g, '').trim();
}

export default function TripMap({ locations }: { locations: string[] }) {
  const [L, setL] = useState<typeof import('leaflet') | null>(null);

  useEffect(() => {
    // Leaflet のアイコン設定（デフォルトだと Next.js でパスが壊れるため）
    import('leaflet').then((leaflet) => {
      const DefaultIcon = leaflet.Icon.Default.prototype as any;
      delete DefaultIcon._getIconUrl;
      leaflet.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      });
      setL(leaflet);
    });
  }, []);

  const markers = locations
    .map(name => {
      const cleaned = cleanLocationName(name);
      const isSecret = cleaned.includes('Secret Spot') || cleaned.includes('サプライズ');
      
      // 完全一致または部分一致（スポット名が含まれているか）で検索
      const spotKey = Object.keys(FUKUOKA_SPOTS).find(key => 
        cleaned.includes(key) || key.includes(cleaned)
      );
      
      const displayName = isSecret ? '🎁 Surprise Spot' : name;
      return { name: displayName, coords: spotKey ? FUKUOKA_SPOTS[spotKey] : null };
    })
    .filter((m): m is { name: string, coords: [number, number] } => m.coords !== null);

  if (!L) {
    return <TripMapSkeleton />;
  }

  if (markers.length === 0) {
    return (
      <MagazineCard className="h-80 flex flex-col items-center justify-center text-stone-400 bg-stone-50 border-stone-100 rounded-[2.5rem] shadow-xl shadow-rose-100/10">
        <div className="flex flex-col items-center gap-2 opacity-30">
          <MapPin size={48} className="text-rose-300" />
          <p className="text-xs font-bold uppercase tracking-[0.2em]">No locations tracked</p>
        </div>
      </MagazineCard>
    );
  }

  const center = markers.length > 0 ? markers[0].coords : [33.5902, 130.4017] as [number, number];

  return (
    <div className="relative h-80 w-full rounded-[2.5rem] overflow-hidden border border-rose-100 shadow-xl shadow-rose-100/10">
      <MapContainer 
        center={center} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markers.map((marker, idx) => (
          <Marker key={idx} position={marker.coords}>
            <Popup>
              <span className="font-bold">{marker.name}</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Overlay info */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-rose-100 shadow-sm">
        <p className="text-[10px] font-black uppercase tracking-widest text-rose-400">Route Overview</p>
        <p className="text-xs font-bold text-stone-800">{markers.length} points tracked</p>
      </div>
    </div>
  );
}
