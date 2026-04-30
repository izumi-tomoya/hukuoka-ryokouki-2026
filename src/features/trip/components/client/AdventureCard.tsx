'use client';

import { useState } from 'react';
import { Sparkles, RefreshCcw, Camera, Coffee, Footprints, Wind } from 'lucide-react';
import { MagazineCard } from '@/components/ui/MagazineCard';
import { cn } from '@/lib/utils';

const ADVENTURES = [
  {
    title: "一駅分の呼吸",
    desc: "あえて一駅手前で降りて、街の空気を吸いながら歩く。ふたりの会話が、また一つ増えるかもしれない。",
    icon: Footprints,
    theme: "text-blue-500 bg-blue-50"
  },
  {
    title: "レンズを通さない景色",
    desc: "10分間だけ、スマホを閉じて。目の前に広がる景色と、隣にいる人の声だけを記憶に焼き付ける。",
    icon: Wind,
    theme: "text-stone-500 bg-stone-50"
  },
  {
    title: "偶然の香りに誘われて",
    desc: "予定にない路地裏、ふと気になった香りのするカフェへ。そこが、この旅で一番のお気に入りになるかもしれない。",
    icon: Coffee,
    theme: "text-amber-500 bg-amber-50"
  },
  {
    title: "街の断片を切り取る",
    desc: "観光地ではない、何気ない街角や影、二人の足元を一枚。その「普通」が、数年後に一番懐かしくなる。",
    icon: Camera,
    theme: "text-rose-500 bg-rose-50"
  }
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
      <div className="flex flex-col md:flex-row items-center gap-10">
        <div className={cn(
          "shrink-0 w-24 h-24 rounded-[2.5rem] flex items-center justify-center transition-all duration-500",
          adventure.theme,
          isAnimating ? "scale-75 opacity-0" : "scale-100 opacity-100"
        )}>
          <adventure.icon size={40} />
        </div>

        <div className={cn(
          "grow text-center md:text-left transition-all duration-500",
          isAnimating ? "translate-x-4 opacity-0" : "translate-x-0 opacity-100"
        )}>
          <div className="flex items-center justify-center md:justify-start gap-3 text-rose-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
            <Sparkles size={12} />
            Plan the Margin
          </div>
          <h3 className="font-playfair text-2xl md:text-3xl font-bold text-stone-900 mb-4">
            {adventure.title}
          </h3>
          <p className="text-sm text-stone-500 leading-relaxed italic max-w-lg">
            &ldquo;{adventure.desc}&rdquo;
          </p>
        </div>

        <button 
          onClick={handleNext}
          className="group flex flex-col items-center gap-3 shrink-0 rounded-full v2-focus"
        >
          <div className="w-16 h-16 rounded-full bg-white shadow-lg border border-rose-100 flex items-center justify-center text-rose-400 group-hover:bg-rose-500 group-hover:text-white transition-all group-active:scale-90">
            <RefreshCcw size={24} className={cn("transition-transform duration-700", isAnimating && "rotate-180")} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-stone-400 group-hover:text-rose-500 transition-colors">
            Other Suggestion
          </span>
        </button>
      </div>
    </MagazineCard>
  );
}
