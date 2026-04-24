import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isAdmin = !!req.auth?.user?.isAdmin;
  const isTipsPage = nextUrl.pathname.includes("/tips");

  // 管理者専用ページへのアクセス制限
  if (isTipsPage && !isAdmin) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/trip/:slug/tips/:path*"],
};
