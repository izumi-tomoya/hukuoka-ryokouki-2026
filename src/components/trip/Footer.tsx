import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="py-20 border-t border-stone-100 bg-stone-50">
      <div className="max-w-5xl mx-auto px-6 flex flex-col items-center gap-6">
        <Link href="/" className="font-playfair text-2xl font-bold text-stone-900 tracking-tight">
          Memoir
        </Link>
        <p className="text-[10px] font-black tracking-[0.4em] text-stone-300 uppercase">
          © 2026 Memoir — Private Travel Journal
        </p>
      </div>
    </footer>
  );
}
