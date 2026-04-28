'use client';

import { Bus, Train, ExternalLink, Map, ArrowRight } from 'lucide-react';
import { MagazineCard } from '@/components/ui/MagazineCard';
import { cn } from '@/lib/utils';

interface TransitDashboardProps {
  isSecretMode: boolean;
}

export default function TransitDashboard({ isSecretMode }: TransitDashboardProps) {
  const allRoutes = [
    {
      title: "天神 ⇄ 博多 (西鉄バス)",
      desc: "街の動線を繋ぐ、福岡の日常。W1/W2など主要系統の運行状況を確認。",
      url: "https://www.nishitetsu.jp/bus/rosen/tenjin_hakata/",
      icon: Bus,
      color: "bg-blue-50 text-blue-600",
      secret: false
    },
    {
      title: "福岡空港 ⇄ 街 (地下鉄)",
      desc: "空路と街を繋ぐ、わずか数分のグラデーション。タッチ決済で軽やかに。",
      url: "https://subway.city.fukuoka.lg.jp/schedule/",
      icon: Train,
      color: "bg-orange-50 text-orange-600",
      secret: false
    },
    {
      title: "ヒルトン ⇄ 市街地 (バス/タクシー)",
      desc: "地上123mの聖域から、活気ある街へ。最適なルートをその手に。",
      url: "https://www.nishitetsu.jp/bus/rosen/paypaydome/",
      icon: Map,
      color: "bg-stone-100 text-stone-700",
      secret: true
    }
  ];

  const routes = allRoutes.filter(r => !r.secret || isSecretMode);

  return (
    <div className="space-y-6">
      <div className={cn(
        "grid grid-cols-1 gap-6",
        routes.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"
      )}>
        {routes.map((route, i) => (
          <a 
            key={i} 
            href={route.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="group block"
          >
            <MagazineCard padding="md" className="h-full border-stone-100 shadow-sm transition-all duration-500 hover:shadow-xl hover:shadow-stone-200/50 hover:-translate-y-1">
              <div className="flex flex-col h-full">
                <div className={`w-12 h-12 rounded-2xl ${route.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                  <route.icon size={24} />
                </div>
                <h4 className="font-bold text-stone-900 mb-2 flex items-center justify-between">
                  {route.title}
                  <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-stone-300" />
                </h4>
                <p className="text-[11px] text-stone-500 leading-relaxed italic mb-4">
                  {route.desc}
                </p>
                <div className="mt-auto pt-4 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-stone-400 group-hover:text-stone-900 transition-colors">
                  Check Schedule <ArrowRight size={10} />
                </div>
              </div>
            </MagazineCard>
          </a>
        ))}
      </div>
    </div>
  );
}
