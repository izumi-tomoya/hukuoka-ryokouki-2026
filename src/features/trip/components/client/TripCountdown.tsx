'use client';

import { useState, useEffect } from 'react';

type Props = {
  startDate: Date | string;
};

export const TripCountdown = ({ startDate }: Props) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date(startDate);
    const calculateTimeLeft = () => {
      const difference = +targetDate - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [startDate]);

  return (
    <div className="flex gap-6">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="flex flex-col items-center">
          <span className="font-playfair text-2xl md:text-3xl font-bold text-stone-900 tracking-tighter">
            {value.toString().padStart(2, '0')}
          </span>
          <span className="text-[9px] font-black uppercase text-stone-400 tracking-[0.2em] mt-2">
            {unit}
          </span>
        </div>
      ))}
    </div>
  );
};
