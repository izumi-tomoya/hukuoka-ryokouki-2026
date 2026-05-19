"use client";

import { ArrowRight, Bus, ExternalLink, Map as MapIcon, Train } from "lucide-react";
import { MagazineCard } from "@/components/ui/MagazineCard";
import { cn } from "@/lib/utils";

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
      secret: false,
    },
    {
      title: "福岡空港 ⇄ 街 (地下鉄)",
      desc: "空路と街を繋ぐ、わずか数分のグラデーション。タッチ決済で軽やかに。",
      url: "https://subway.city.fukuoka.lg.jp/schedule/",
      icon: Train,
      color: "bg-orange-50 text-orange-600",
      secret: false,
    },
    {
      title: "ヒルトン ⇄ 市街地 (バス/タクシー)",
      desc: "地上123mの聖域から、活気ある街へ。最適なルートをその手に。",
      url: "https://www.nishitetsu.jp/bus/rosen/paypaydome/",
      icon: MapIcon,
      color: "bg-muted/50 text-stone-700",
      secret: true,
    },
  ];

  const routes = allRoutes.filter((r) => !r.secret || isSecretMode);

  return (
    <div className="space-y-6">
      <div className={cn("grid grid-cols-1 gap-6", routes.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2")}>
        {routes.map((route) => (
          <a key={route.url} href={route.url} target="_blank" rel="noopener noreferrer" className="group block">
            <MagazineCard
              padding="md"
              className="border-border/50 h-full shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-stone-200/50"
            >
              <div className="flex h-full flex-col">
                <div
                  className={`h-12 w-12 rounded-2xl ${route.color} mb-6 flex items-center justify-center transition-transform duration-500 group-hover:scale-110`}
                >
                  <route.icon size={24} />
                </div>
                <h4 className="mb-2 flex items-center justify-between font-bold text-stone-900">
                  {route.title}
                  <ExternalLink
                    size={14}
                    className="text-stone-300 opacity-0 transition-opacity group-hover:opacity-100"
                  />
                </h4>
                <p className="mb-4 text-[11px] leading-relaxed text-stone-500 italic">{route.desc}</p>
                <div className="mt-auto flex items-center gap-2 pt-4 text-[9px] font-black tracking-[0.2em] text-stone-400 uppercase transition-colors group-hover:text-stone-900">
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
