"use client";
import { signOut } from "next-auth/react";
import { SECRET_MODE_COOKIE_NAME } from "@/config/constants";

export function LogoutButton({ children }: { children: React.ReactNode }) {
  const handleLogout = async () => {
    // クッキーを手動で削除（ブラウザ側）
    document.cookie = `${SECRET_MODE_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

    // NextAuth のサインアウトを実行
    await signOut({ callbackUrl: "/" });
  };

  return (
    <button onClick={handleLogout} className="w-full text-left rounded-lg v2-focus">
      {children}
    </button>
  );
}
