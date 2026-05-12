"use client";

import { ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toggleSecretModeAction } from "@/features/trip/api/secretMode";

interface SecretToggleProps {
  isSecretMode: boolean;
}

export default function SecretToggle({ isSecretMode }: SecretToggleProps) {
  const [isPending, setIsPending] = useState(false);

  const handleToggle = async () => {
    setIsPending(true);
    try {
      await toggleSecretModeAction();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={`v2-focus mb-3 inline-flex items-center gap-2 rounded-md border px-4 py-1.5 text-[11px] font-medium tracking-[0.1em] transition-all duration-300 disabled:opacity-50 ${
        isSecretMode
          ? "border-primary bg-primary text-white shadow-sm"
          : "border-border text-foreground hover:bg-muted bg-white"
      }`}
    >
      <ShieldCheck size={14} className={isSecretMode ? "text-white" : "text-primary"} />
      ADMIN MODE {isSecretMode ? "ENABLED" : "DISABLED"}
    </button>
  );
}
