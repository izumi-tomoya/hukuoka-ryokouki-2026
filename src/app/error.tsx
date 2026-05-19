"use client";

import { AlertTriangle, Home, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Container } from "@/components/ui/Container";
import { MagazineCard } from "@/components/ui/MagazineCard";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Unhandled runtime error:", error);
  }, [error]);

  return (
    <div className="bg-memoir-bg dark:bg-background flex min-h-screen items-center justify-center p-6">
      <Container className="max-w-md">
        <MagazineCard padding="lg" className="border-rose-500/20 text-center shadow-2xl shadow-rose-500/5">
          <div className="rounded-article mx-auto mb-8 flex h-20 w-20 items-center justify-center bg-rose-50 text-rose-500 dark:bg-rose-950/30">
            <AlertTriangle size={36} />
          </div>

          <h2 className="font-playfair text-foreground mb-4 text-3xl font-black">
            旅の途中で、
            <br />
            何かが起きたようです
          </h2>

          <p className="text-muted-foreground mb-10 text-sm leading-relaxed italic">
            &ldquo;予期せぬエラーが発生しました。申し訳ありませんが、もう一度やり直すか、トップページに戻ってください。&rdquo;
          </p>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => reset()}
              className="bg-foreground text-background flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-xs font-black tracking-widest uppercase transition-all hover:opacity-90 active:scale-[0.98]"
            >
              <RotateCcw size={14} />
              もう一度読み込む
            </button>

            <Link
              href="/"
              className="bg-secondary text-foreground hover:bg-border flex w-full items-center justify-center gap-2 rounded-2xl px-6 py-4 text-xs font-black tracking-widest uppercase transition-all active:scale-[0.98]"
            >
              <Home size={14} />
              トップに戻る
            </Link>
          </div>

          {process.env.NODE_ENV === "development" && (
            <div className="mt-10 max-h-40 overflow-auto rounded-xl bg-stone-100 p-4 text-left dark:bg-zinc-800">
              <p className="text-muted-foreground font-mono text-[10px] break-all">
                {error.message || "No error message available"}
              </p>
              {error.digest && <p className="text-muted-foreground mt-1 font-mono text-[10px]">ID: {error.digest}</p>}
            </div>
          )}
        </MagazineCard>
      </Container>
    </div>
  );
}
