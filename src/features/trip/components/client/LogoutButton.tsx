"use client";
import { signOut } from "next-auth/react";

export function LogoutButton({ children }: { children: React.ReactNode }) {
  return (
    <button 
      onClick={() => signOut({ callbackUrl: "/" })}
      className="w-full text-left rounded-lg v2-focus"
    >
      {children}
    </button>
  );
}
