import { LogIn, Map, Sparkles } from "lucide-react";
import Image from "next/image";
import { signIn } from "@/lib/auth";

const signInErrorMessages: Record<string, string> = {
  OAuthSignin: "Google 認証の開始に失敗しました。承認済みリダイレクト URI を確認してください。",
  OAuthCallbackError:
    "Google からの戻り処理に失敗しました。OAuth 設定か callback URL が一致していない可能性があります。",
  OAuthCreateAccount:
    "アカウント作成に失敗しました。データベース接続と Prisma の Account/User テーブルを確認してください。",
  OAuthAccountNotLinked: "同じメールアドレスの別ログイン方法が既に登録されています。",
  AccessDenied: "この Google アカウントではアクセスが許可されませんでした。",
  Configuration: "認証設定に不足があります。AUTH_SECRET、AUTH_GOOGLE_ID、AUTH_GOOGLE_SECRET を確認してください。",
  Verification: "認証リンクの検証に失敗しました。もう一度お試しください。",
  SessionRequired: "このページを見るにはログインが必要です。",
};

type SearchParams = Promise<{
  callbackUrl?: string | string[];
  error?: string | string[];
}>;

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getSignInErrorMessage(error: string | undefined) {
  if (!error) return null;
  return signInErrorMessages[error] || `ログインに失敗しました。もう一度お試しください。(${error})`;
}

function getSafeRedirectTo(callbackUrl: string | undefined) {
  if (!callbackUrl) return "/";
  if (callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")) return callbackUrl;

  try {
    const url = new URL(callbackUrl);
    const authOrigin = process.env.AUTH_URL ? new URL(process.env.AUTH_URL).origin : null;
    if (authOrigin && url.origin === authOrigin) {
      return `${url.pathname}${url.search}${url.hash}`;
    }
  } catch {
    return "/";
  }

  return "/";
}

export default async function SignInPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const errorMessage = getSignInErrorMessage(firstParam(params.error));
  const redirectTo = getSafeRedirectTo(firstParam(params.callbackUrl));

  return (
    <div className="bg-background relative flex min-h-screen items-center justify-center overflow-hidden p-6">
      {/* Decorative Background Elements */}
      <div className="pointer-events-none absolute top-0 right-0 h-125 w-125 translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-50/50 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-100 w-100 -translate-x-1/2 translate-y-1/2 rounded-full bg-stone-100 blur-3xl" />

      {/* Large background text like a magazine */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none">
        <span className="font-playfair text-[40vw] leading-none font-black text-stone-200/20 select-none">M</span>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-[4rem] border border-white/50 bg-white/80 p-10 text-center shadow-2xl ring-1 shadow-rose-100/20 ring-rose-100/30 backdrop-blur-xl md:p-16">
          {/* Brand Logo/Icon */}
          <div className="relative mx-auto mb-10 h-20 w-20">
            <div className="rounded-article absolute inset-0 rotate-6 animate-pulse bg-rose-500 opacity-10" />
            <div className="rounded-logo absolute inset-0 z-10 flex items-center justify-center border border-rose-50 bg-white text-rose-500 shadow-sm">
              <Sparkles size={32} />
            </div>
          </div>

          {/* Title Section */}
          <div className="mb-12 space-y-4">
            <h1 className="font-playfair text-4xl font-bold tracking-tight text-stone-900 md:text-5xl">Memoir</h1>
            <div className="flex items-center justify-center gap-2">
              <div className="h-px w-8 bg-rose-100" />
              <p className="text-[10px] font-black tracking-[0.4em] text-rose-400 uppercase">Exclusive Access</p>
              <div className="h-px w-8 bg-rose-100" />
            </div>
            <p className="mx-auto max-w-60 pt-2 text-sm leading-relaxed font-medium text-stone-500">
              旅の続きを、ふたりで。
              <br />
              新しい記憶を刻む準備はできましたか？
            </p>
          </div>

          {errorMessage && (
            <div className="mb-8 rounded-3xl border border-rose-200 bg-rose-50 px-5 py-4 text-left text-xs leading-relaxed font-bold text-rose-700">
              {errorMessage}
            </div>
          )}

          {/* Sign In Button */}
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo });
            }}
            className="space-y-6"
          >
            <button
              type="submit"
              className="group relative w-full overflow-hidden rounded-4xl bg-stone-900 p-px transition-all hover:shadow-2xl hover:shadow-stone-200 active:scale-[0.98]"
            >
              {/* Button inner gradient effect */}
              <div className="absolute inset-0 bg-linear-to-tr from-stone-800 to-stone-700 opacity-0 transition-opacity group-hover:opacity-100" />

              <div className="rounded-inner relative flex items-center justify-center gap-4 bg-stone-900 px-8 py-5 transition-colors group-hover:bg-transparent">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  <Image src="https://www.google.com/favicon.ico" alt="G" width={14} height={14} />
                </div>
                <span className="text-[12px] font-black tracking-[0.2em] text-white uppercase">
                  Sign In with Google
                </span>
              </div>
            </button>

            <p className="text-[9px] font-bold tracking-widest text-stone-300 uppercase">
              Secured by Google Authentication
            </p>
          </form>

          {/* Footer Decoration */}
          <div className="mt-16 flex justify-center gap-6 border-t border-stone-50 pt-8 text-stone-300">
            <Map size={14} />
            <div className="h-4 w-px bg-stone-100" />
            <LogIn size={14} />
          </div>
        </div>

        {/* Helper bottom link */}
        <p className="mt-8 text-center text-[10px] font-bold tracking-[0.2em] text-stone-400 uppercase">
          &copy; 2026 Fukuoka Memoir Project
        </p>
      </div>
    </div>
  );
}
