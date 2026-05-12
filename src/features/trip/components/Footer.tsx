import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-border/50 dark:border-border bg-secondary/30 dark:bg-background border-t py-20 transition-colors">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6">
        <Link href="/" className="font-playfair dark:text-foreground text-2xl font-bold tracking-tight text-stone-900">
          Memoir
        </Link>
        <p className="text-[10px] font-black tracking-[0.4em] text-stone-300 uppercase dark:text-zinc-600">
          © 2026 Memoir — Private Travel Journal
        </p>
      </div>
    </footer>
  );
}
