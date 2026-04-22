"use client";

import { useModalStore } from "@/lib/store/useModalStore";
import type { TripEvent } from "@/types/trip";
import { cn } from "@/lib/utils";

interface ClickableCardProps {
  event: TripEvent;
  children: React.ReactNode;
  className?: string;
}

export default function ClickableCard({
  event,
  children,
  className,
}: ClickableCardProps) {
  const openModal = useModalStore((state) => state.openModal);

  return (
    <div
      onClick={() => openModal(event)}
      className={cn("cursor-pointer transition-transform active:scale-[0.98]", className)}
    >
      {children}
    </div>
  );
}
