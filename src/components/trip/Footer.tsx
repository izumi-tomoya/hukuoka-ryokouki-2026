import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="mt-auto py-12 px-6 border-t border-stone-100 bg-[#FFFCF9]">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <Link href="/" className="font-playfair text-xl font-bold text-stone-900">
          Memoir
        </Link>
        <p className="text-[11px] text-stone-400 tracking-wider uppercase">
          © 2026 Memoir — ふたりの旅の記憶
        </p>
      </div>
    </footer>
  );
}
