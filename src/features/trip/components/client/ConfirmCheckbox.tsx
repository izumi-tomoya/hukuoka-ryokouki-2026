"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { toggleEventConfirmation } from "@/features/trip/api/tripActions";
import { cn } from "@/lib/utils";

interface ConfirmCheckboxProps {
  eventId: string;
  initialConfirmed: boolean;
}

export default function ConfirmCheckbox({ eventId, initialConfirmed }: ConfirmCheckboxProps) {
  const [isConfirmed, setIsConfirmed] = useState(initialConfirmed);
  const [isPending, setIsPending] = useState(false);

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the detail modal

    const nextState = !isConfirmed;
    setIsConfirmed(nextState); // Optimistic update
    setIsPending(true);

    try {
      const result = await toggleEventConfirmation(eventId, nextState);
      if (!result.success) {
        setIsConfirmed(isConfirmed); // Rollback on error
      }
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "group v2-focus flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all duration-300",
        isConfirmed
          ? "border-emerald-500 bg-emerald-500 shadow-md shadow-emerald-200"
          : "border-stone-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/30",
        isPending && "cursor-not-allowed opacity-50",
      )}
      aria-label={isConfirmed ? "Mark as unconfirmed" : "Mark as confirmed"}
    >
      <Check
        size={14}
        className={cn(
          "transform transition-all duration-300",
          isConfirmed
            ? "scale-100 rotate-0 text-white"
            : "scale-50 -rotate-45 text-transparent group-hover:text-emerald-200",
        )}
        strokeWidth={3}
      />
    </button>
  );
}
