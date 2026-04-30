'use client';

import { useEffect, useState } from 'react';
import { ExternalLink, Clock, MapPin, JapaneseYen, Wifi, CreditCard, Accessibility, Dog, Ticket } from 'lucide-react';
import { MagazineCard } from '@/components/ui/MagazineCard';
import Image from 'next/image';

interface GourmetInfo {
  name: string;
  address: string;
  logo: string;
  photo: string;
  open: string;
  catch: string;
  url: string;
  budget: string;
  barrier_free: string;
  pet: string;
  card: string;
  wifi: string;
  coupon: string;
}

export function ExternalSpotInfo({ name }: { name: string }) {
  const [info, setInfo] = useState<GourmetInfo | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchInfo() {
      setLoading(true);
      try {
        const res = await fetch(`/api/external/gourmet?name=${encodeURIComponent(name)}`);
        if (res.ok) {
          const data = await res.json();
          setInfo(data);
        }
      } finally {
        setLoading(false);
      }
    }
    if (name) fetchInfo();
  }, [name]);

  if (loading) return <div className="h-24 w-full animate-pulse bg-secondary/50 rounded-2xl" />;
  if (!info) return null;

  return (
    <MagazineCard padding="sm" className="bg-rose-500/5 border-rose-500/10 overflow-hidden">
      <div className="flex flex-col gap-4">
        <div className="relative h-40 -mx-4 -mt-4 mb-2">
          <Image src={info.photo} alt={info.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
             <div className="text-[10px] font-black uppercase tracking-widest text-rose-300 mb-1">HotPepper Gourmet</div>
             <div className="text-white font-bold text-sm leading-tight">{info.catch}</div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Clock size={14} className="text-rose-500 shrink-0 mt-0.5" />
            <div className="text-[11px] text-muted-foreground leading-relaxed">{info.open}</div>
          </div>
          <div className="flex items-center gap-3">
            <JapaneseYen size={14} className="text-rose-500 shrink-0" />
            <div className="text-[11px] font-bold text-foreground">{info.budget}</div>
          </div>
          <div className="flex items-start gap-3">
            <MapPin size={14} className="text-rose-500 shrink-0 mt-0.5" />
            <div className="text-[11px] text-muted-foreground">{info.address}</div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          {info.wifi.includes('あり') && <div className="flex items-center gap-1 px-2 py-0.5 bg-sky-50 text-sky-600 rounded-full text-[9px] font-bold"><Wifi size={10} /> Wi-Fi</div>}
          {info.card.includes('可') && <div className="flex items-center gap-1 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-bold"><CreditCard size={10} /> Card</div>}
          {info.barrier_free.includes('あり') && <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full text-[9px] font-bold"><Accessibility size={10} /> Accessible</div>}
          {info.pet.includes('可') && <div className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 rounded-full text-[9px] font-bold"><Dog size={10} /> Pet OK</div>}
        </div>

        <div className="grid grid-cols-2 gap-2 mt-4">
          <a 
            href={info.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-3 bg-white border border-rose-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 transition-all"
          >
            詳細を見る <ExternalLink size={12} />
          </a>
          {info.coupon && (
            <a 
              href={info.coupon} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 bg-rose-500 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-rose-600 transition-all shadow-md shadow-rose-200"
            >
              クーポン <Ticket size={12} />
            </a>
          )}
        </div>
      </div>
    </MagazineCard>
  );
}
