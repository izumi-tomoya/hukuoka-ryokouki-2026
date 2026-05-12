import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import authConfig from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isAdmin = !!req.auth?.user?.isAdmin;

  const isAuthPage = nextUrl.pathname.startsWith("/auth/signin");
  const isPublicAsset =
    nextUrl.pathname.startsWith("/_next") ||
    nextUrl.pathname.startsWith("/api") || // APIは一旦通すが、必要に応じて中身でチェック
    nextUrl.pathname.includes(".") || // 画像、favicon等
    nextUrl.pathname === "/manifest.json" ||
    nextUrl.pathname === "/sw.js";

  // ログインしていない場合、サインインページ以外へのアクセスをリダイレクト
  if (!isLoggedIn && !isAuthPage && !isPublicAsset) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }
    const encodedCallbackUrl = encodeURIComponent(callbackUrl);
    return NextResponse.redirect(new URL(`/auth/signin?callbackUrl=${encodedCallbackUrl}`, nextUrl));
  }

  // ログイン済みでサインインページにアクセスした場合、トップページへ
  if (isLoggedIn && isAuthPage) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  // 管理者専用ページへのアクセス制限
  const isTipsPage = nextUrl.pathname.includes("/tips");
  if (isTipsPage && !isAdmin) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
