'use client';

import { useState, useTransition } from 'react';
import { toggleEventConfirmation } from '@/app/actions/tripActions';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConfirmCheckboxProps {
  eventId: string;
  initialConfirmed: boolean;
}

export default function ConfirmCheckbox({ eventId, initialConfirmed }: ConfirmCheckboxProps) {
  const [isConfirmed, setIsConfirmed] = useState(initialConfirmed);
  const [isPending, startTransition] = useTransition();

  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the detail modal
    
    const nextState = !isConfirmed;
    setIsConfirmed(nextState); // Optimistic update

    startTransition(async () => {
      const result = await toggleEventConfirmation(eventId, nextState);
      if (!result.success) {
        setIsConfirmed(isConfirmed); // Rollback on error
      }
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "group flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all duration-300",
        isConfirmed 
          ? "border-emerald-500 bg-emerald-500 shadow-md shadow-emerald-200" 
          : "border-stone-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/30",
        isPending && "opacity-50 cursor-not-allowed"
      )}
      aria-label={isConfirmed ? "Mark as unconfirmed" : "Mark as confirmed"}
    >
      <Check 
        size={14} 
        className={cn(
          "transition-all duration-300 transform",
          isConfirmed ? "text-white scale-100 rotate-0" : "text-transparent scale-50 -rotate-45 group-hover:text-emerald-200"
        )} 
        strokeWidth={3}
      />
    </button>
  );
}
