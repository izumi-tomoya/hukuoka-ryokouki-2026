"use client";

import { Camera, Coffee, Footprints, RefreshCcw, Sparkles, Wind } from "lucide-react";
import { useState } from "react";
import { MagazineCard } from "@/components/ui/MagazineCard";
import { cn } from "@/lib/utils";

const ADVENTURES = [
  {
    title: "一駅分の呼吸",
    desc: "あえて一駅手前で降りて、街の空気を吸いながら歩く。ふたりの会話が、また一つ増えるかもしれない。",
    icon: Footprints,
    theme: "text-blue-500 bg-blue-50",
  },
  {
    title: "レンズを通さない景色",
    desc: "10分間だけ、スマホを閉じて。目の前に広がる景色と、隣にいる人の声だけを記憶に焼き付ける。",
    icon: Wind,
    theme: "text-stone-500 bg-secondary/30",
  },
  {
    title: "偶然の香りに誘われて",
    desc: "予定にない路地裏、ふと気になった香りのするカフェへ。そこが、この旅で一番のお気に入りになるかもしれない。",
    icon: Coffee,
    theme: "text-amber-500 bg-amber-50",
  },
  {
    title: "街の断片を切り取る",
    desc: "観光地ではない、何気ない街角や影、二人の足元を一枚。その「普通」が、数年後に一番懐かしくなる。",
    icon: Camera,
    theme: "text-rose-500 bg-rose-50",
  },
];

export default function AdventureCard() {
  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNext = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIndex((prev) => (prev + 1) % ADVENTURES.length);
      setIsAnimating(false);
    }, 300);
  };

  const adventure = ADVENTURES[index];

  return (
    <MagazineCard
      padding="lg"
      className="relative overflow-hidden border-rose-100 bg-linear-to-br from-white to-rose-50/30"
    >
      <div className="flex flex-col items-center gap-10 md:flex-row">
        <div
          className={cn(
            "flex h-24 w-24 shrink-0 items-center justify-center rounded-[2.5rem] transition-all duration-500",
            adventure.theme,
            isAnimating ? "scale-75 opacity-0" : "scale-100 opacity-100",
          )}
        >
          <adventure.icon size={40} />
        </div>

        <div
          className={cn(
            "grow text-center transition-all duration-500 md:text-left",
            isAnimating ? "translate-x-4 opacity-0" : "translate-x-0 opacity-100",
          )}
        >
          <div className="mb-4 flex items-center justify-center gap-3 text-[10px] font-black tracking-[0.4em] text-rose-400 uppercase md:justify-start">
            <Sparkles size={12} />
            Plan the Margin
          </div>
          <h3 className="font-playfair mb-4 text-2xl font-bold text-stone-900 md:text-3xl">{adventure.title}</h3>
          <p className="max-w-lg text-sm leading-relaxed text-stone-500 italic">&ldquo;{adventure.desc}&rdquo;</p>
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="group v2-focus flex shrink-0 flex-col items-center gap-3 rounded-full"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-rose-100 bg-white text-rose-400 shadow-lg transition-all group-hover:bg-rose-500 group-hover:text-white group-active:scale-90">
            <RefreshCcw size={24} className={cn("transition-transform duration-700", isAnimating && "rotate-180")} />
          </div>
          <span className="text-[9px] font-black tracking-widest text-stone-400 uppercase transition-colors group-hover:text-rose-500">
            Other Suggestion
          </span>
        </button>
      </div>
    </MagazineCard>
  );
}
