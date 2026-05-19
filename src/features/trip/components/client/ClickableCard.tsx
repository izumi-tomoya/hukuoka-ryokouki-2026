"use client";

import type { TripEvent } from "@/features/trip/types/trip";
import { useModalStore } from "@/lib/store/useModalStore";
import { cn } from "@/lib/utils";

interface ClickableCardProps {
  event: TripEvent;
  children: React.ReactNode;
  className?: string;
  previousLocation?: string;
}

export default function ClickableCard({ event, children, className, previousLocation }: ClickableCardProps) {
  const openModal = useModalStore((s) => s.openModal);

  const handlePress = () => {
    openModal(event, previousLocation);
  };

  return (
    <button
      type="button"
      onClick={handlePress}
      className={cn("w-full text-left outline-hidden transition-transform active:scale-[0.98]", className)}
    >
      {children}
    </button>
  );
}
