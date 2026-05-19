"use client";

import { useModalStore } from "@/lib/store/useModalStore";
import type { TripEvent } from "@/features/trip/types/trip";
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handlePress();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handlePress}
      onKeyDown={handleKeyDown}
      className={cn(
        "w-full cursor-pointer text-left transition-transform active:scale-[0.98] outline-hidden",
        className
      )}
    >
      {children}
    </div>
  );
}
