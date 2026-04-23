"use client";

import { useTransition } from "react";
import { toggleSecretModeAction } from "@/features/trip/api/secretMode";
import { Lock } from "lucide-react";

interface SecretToggleProps {
  isSecretMode: boolean;
}

export default function SecretToggle({ isSecretMode }: SecretToggleProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleSecretModeAction();
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className="mb-3 inline-flex items-center gap-2 rounded-full border border-rose-200/60 bg-white/70 px-4 py-1 text-[11px] font-bold tracking-[3px] text-rose-500 transition-all hover:bg-white/90 hover:shadow-md active:scale-95 disabled:opacity-50 backdrop-blur-sm shadow-sm"
    >
      {isSecretMode ? <Lock size={12} className="text-rose-500" /> : null}
      TRAVEL GUIDE 2026
      {isSecretMode ? <span className="ml-1 text-[8px] text-rose-400">SECURE</span> : null}
    </button>
  );
}
