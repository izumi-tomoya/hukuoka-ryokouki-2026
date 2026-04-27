"use client";

import { useSession } from "next-auth/react";

/**
 * クライアントサイドおよびサーバーサイドのツリーで安全に動作する AdminGuard。
 * auth() を直接インポートせず、クライアントサイドでは useSession を使用する。
 */
export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  
  if (status === "loading") return null;

  if (!session?.user?.isAdmin) {
    return null;
  }

  return <>{children}</>;
}
