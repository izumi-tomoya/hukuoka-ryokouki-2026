"use client";

import { useTransition } from "react";
import { toggleSecretModeAction } from "@/features/trip/api/secretMode";
import { ShieldCheck } from "lucide-react";

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
      className={`mb-3 inline-flex items-center gap-2 rounded-md border px-4 py-1.5 text-[11px] font-medium tracking-[0.1em] transition-all duration-300 disabled:opacity-50 v2-focus
        ${isSecretMode 
          ? "border-primary bg-primary text-white shadow-sm" 
          : "border-border bg-white text-foreground hover:bg-muted"}`}
    >
      <ShieldCheck size={14} className={isSecretMode ? "text-white" : "text-primary"} />
      ADMIN MODE {isSecretMode ? "ENABLED" : "DISABLED"}
    </button>
  );
}
