'use client';

import { useState } from 'react';
import { Trophy, UtensilsCrossed, Heart, Star, MapPin } from 'lucide-react';
import { MagazineCard } from '@/components/ui/MagazineCard';
import { cn } from '@/lib/utils';

const NOMINEES = [
  { id: 1, name: "和牛めんたい 神楽", location: "太宰府", category: "Lunch" },
  { id: 2, name: "海鮮屋 はじめの一歩", location: "キャナルシティ", category: "Dinner" },
  { id: 3, name: "水たき 長野", location: "中洲", category: "Lunch" },
  { id: 4, name: "牧のうどん", location: "福岡空港", category: "Dinner" },
  { id: 5, name: "CLOUDS", location: "ヒルトン福岡", category: "Afternoon Tea" },
];

export default function GourmetAward() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <div className="space-y-10">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-50 text-amber-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
          <Trophy size={14} />
          The Memories of Flavors
        </div>
        <h2 className="font-playfair text-3xl md:text-4xl font-bold text-stone-900 mb-4">
          心に残った、至高の一皿。
        </h2>
        <p className="text-sm text-stone-500 italic">
          旅の終わりに、二人が一番幸せを感じた味をひとつだけ選んでみてください。
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {NOMINEES.map((item) => (
          <button 
            key={item.id} 
            onClick={() => setSelectedId(item.id)}
            className="group block text-left"
          >
            <MagazineCard 
              padding="md" 
              className={cn(
                "h-full border-stone-100 transition-all duration-500",
                selectedId === item.id 
                  ? "bg-stone-900 border-stone-900 text-white shadow-2xl scale-[1.02] ring-4 ring-amber-400/20" 
                  : "bg-white hover:border-amber-200"
              )}
            >
              <div className="flex justify-between items-start mb-6">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                  selectedId === item.id ? "bg-white/10" : "bg-stone-50 text-stone-400 group-hover:text-amber-500"
                )}>
                  <UtensilsCrossed size={18} />
                </div>
                {selectedId === item.id && (
                  <div className="flex items-center gap-1 text-amber-400 animate-in zoom-in duration-300">
                    <Star size={14} fill="currentColor" />
                    <span className="text-[10px] font-black uppercase tracking-tighter">Grand Prix</span>
                  </div>
                )}
              </div>

              <h3 className={cn(
                "text-lg font-bold mb-2",
                selectedId === item.id ? "text-white" : "text-stone-900"
              )}>
                {item.name}
              </h3>
              
              <div className="flex items-center gap-3 text-[10px] font-bold opacity-60">
                <div className="flex items-center gap-1">
                  <MapPin size={10} />
                  {item.location}
                </div>
                <div className="h-1 w-1 rounded-full bg-current opacity-30" />
                {item.category}
              </div>

              {selectedId === item.id && (
                <div className="mt-8 pt-6 border-t border-white/10 flex items-center gap-3 text-amber-400 animate-in fade-in slide-in-from-top-2 duration-500">
                  <Heart size={16} fill="currentColor" />
                  <span className="text-xs font-medium italic">ふたりの記憶に刻まれました。</span>
                </div>
              )}
            </MagazineCard>
          </button>
        ))}
      </div>
    </div>
  );
}
