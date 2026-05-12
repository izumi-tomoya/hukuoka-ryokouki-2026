"use client";

import { useParams, useRouter } from "next/navigation";
import type { TripEvent } from "@/features/trip/types/trip";
import { cn } from "@/lib/utils";
import { generateEventSlug } from "../../api/getExtendedTripData";

interface ClickableCardProps {
  event: TripEvent;
  children: React.ReactNode;
  className?: string;
}

export default function ClickableCard({ event, children, className }: ClickableCardProps) {
  const router = useRouter();
  const params = useParams();
  const slug = params?.slug as string;

  const handlePress = () => {
    if (slug) {
      const spotId = generateEventSlug(event);
      router.push(`/trip/${slug}/spot/${spotId}`);
    }
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
