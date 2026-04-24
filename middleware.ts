import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isAdmin = req.auth?.user?.isAdmin;
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
