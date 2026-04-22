"use client";

import { useTransition } from "react";
import { toggleSecretModeAction } from "@/app/actions/secretMode";
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
      className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-4 py-1 text-[11px] font-bold tracking-[3px] text-white transition-all hover:bg-white/30 active:scale-95 disabled:opacity-50"
    >
      {isSecretMode ? <Lock size={12} className="text-amber-300" /> : null}
      TRAVEL GUIDE 2026
      {isSecretMode ? <span className="ml-1 text-[8px] text-amber-300">SECURE</span> : null}
    </button>
  );
}
