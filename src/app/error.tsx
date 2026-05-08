'use client';

import { useEffect } from 'react';
import { Container } from '@/components/ui/Container';
import { MagazineCard } from '@/components/ui/MagazineCard';
import { AlertTriangle, Home, RotateCcw } from 'lucide-react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Unhandled runtime error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-memoir-bg dark:bg-background flex items-center justify-center p-6">
      <Container className="max-w-md">
        <MagazineCard padding="lg" className="text-center border-rose-500/20 shadow-2xl shadow-rose-500/5">
          <div className="mx-auto h-20 w-20 mb-8 flex items-center justify-center rounded-article bg-rose-50 dark:bg-rose-950/30 text-rose-500">
            <AlertTriangle size={36} />
          </div>
          
          <h2 className="font-playfair text-3xl font-black text-foreground mb-4">
            旅の途中で、<br />何かが起きたようです
          </h2>
          
          <p className="text-sm text-muted-foreground leading-relaxed mb-10 italic">
            &ldquo;予期せぬエラーが発生しました。申し訳ありませんが、もう一度やり直すか、トップページに戻ってください。&rdquo;
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => reset()}
              className="flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl bg-foreground text-background font-black text-xs uppercase tracking-widest transition-all hover:opacity-90 active:scale-[0.98]"
            >
              <RotateCcw size={14} />
              もう一度読み込む
            </button>
            
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl bg-secondary text-foreground font-black text-xs uppercase tracking-widest transition-all hover:bg-border active:scale-[0.98]"
            >
              <Home size={14} />
              トップに戻る
            </Link>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-10 p-4 rounded-xl bg-stone-100 dark:bg-zinc-800 text-left overflow-auto max-h-40">
               <p className="text-[10px] font-mono text-muted-foreground break-all">
                 {error.message || 'No error message available'}
               </p>
               {error.digest && (
                 <p className="text-[10px] font-mono text-muted-foreground mt-1">
                   ID: {error.digest}
                 </p>
               )}
            </div>
          )}
        </MagazineCard>
      </Container>
    </div>
  );
}
