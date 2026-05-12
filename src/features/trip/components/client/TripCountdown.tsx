"use client";

import { useEffect, useState } from "react";

type Props = {
  startDate: Date | string;
};

export const TripCountdown = ({ startDate }: Props) => {
  const [mounted, setIsMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const mountId = setTimeout(() => setIsMounted(true), 0);
    const targetDate = new Date(startDate);

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => {
      clearTimeout(mountId);
      clearInterval(timer);
    };
  }, [startDate]);

  // ハイドレーションエラーを防ぐため、マウントされるまでは何も表示しないかスケルトンを出す
  if (!mounted) {
    return <div className="bg-muted/25 h-10 w-40 animate-pulse rounded-lg" />;
  }

  return (
    <div className="flex gap-3 md:gap-6">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="flex flex-col items-center">
          <span className="font-playfair text-xl font-bold tracking-tighter text-stone-900 md:text-3xl">
            {value.toString().padStart(2, "0")}
          </span>
          <span className="mt-2 text-[9px] font-black tracking-[0.2em] text-stone-400 uppercase">{unit}</span>
        </div>
      ))}
    </div>
  );
};
