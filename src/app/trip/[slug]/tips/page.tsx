import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { SECRET_MODE_COOKIE_NAME } from "@/config/constants";
import { getTripBySlug } from "@/app/actions/tripActions";
import TipsSection from "@/components/trip/TipsSection";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function TipsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const cookieStore = await cookies();
  const isSecretMode = cookieStore.get(SECRET_MODE_COOKIE_NAME)?.value === "true";
  if (!isSecretMode) redirect(`/trip/${slug}`);

  const trip = await getTripBySlug(slug);
  if (!trip) return notFound();

  const tips = trip.tips.map((t) => ({ title: t.title, body: t.body, isWarning: t.isWarning }));

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div
        className="relative overflow-hidden px-6 pt-14 pb-24 text-center"
        style={{ background: "linear-gradient(160deg, #0D0818 0%, #1A0D2E 50%, #0F0A20 100%)" }}
      >
        <div className="absolute -left-16 -top-16 h-64 w-64 rounded-full bg-indigo-600/15 blur-[80px] animate-pulse" />
        <div
          className="absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-amber-500/10 blur-[80px] animate-pulse"
          style={{ animationDelay: "600ms" }}
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-purple-400/30 to-transparent" />

        <Link
          href={`/trip/${slug}`}
          className="absolute left-5 top-7 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/7 text-white backdrop-blur-sm transition-all hover:bg-white/15"
        >
          <ChevronLeft size={18} />
        </Link>

        <div className="mb-5 animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-400/25 bg-purple-500/10 px-4 py-1.5 text-[9px] font-black tracking-[5px] text-purple-300 uppercase backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-400 animate-pulse" />
            Secret Guide
          </span>
        </div>

        <div className="animate-fade-up delay-100">
          <h1 className="font-playfair text-[40px] font-bold text-white mb-1 tracking-tight drop-shadow-lg">🧭 Escort</h1>
          <h1 className="font-playfair text-[40px] font-bold italic text-amber-300 tracking-tight drop-shadow-lg mb-4">Tips</h1>
        </div>
        <p className="mx-auto max-w-55 text-[11px] font-medium leading-relaxed text-white/50 animate-fade-up delay-200">
          彼女を最高に楽しませるための<br />彼氏専用プレミアムガイド
        </p>
      </div>

      {/* Tips */}
      <div className="-mt-10 relative z-10">
        {tips.length === 0 ? (
          <p className="text-center text-stone-400 py-20 text-[13px]">Tipsはまだ登録されていません</p>
        ) : (
          <TipsSection tips={tips} dayNumber={1} />
        )}
      </div>

      {/* Checklist */}
      <section className="px-5 py-8">
        <div className="mb-5 flex items-center gap-3">
          <div className="h-px flex-1 bg-linear-to-r from-stone-200 to-transparent" />
          <span className="text-[9px] font-black tracking-[5px] text-stone-400 uppercase">Final Checklist</span>
          <div className="h-px flex-1 bg-linear-to-l from-stone-200 to-transparent" />
        </div>
        <div className="rounded-[24px] p-6 ring-1 ring-amber-200/50" style={{ background: "linear-gradient(135deg, #FFFDF8 0%, #FFF8EE 100%)" }}>
          <ul className="space-y-4">
            {[
              { text: "モバイルバッテリーの充電", icon: "🔋" },
              { text: "現金の用意（屋台用）", icon: "💴" },
              { text: "折り畳み傘の持参", icon: "🌂" },
              { text: "お腹の空き具合の調整", icon: "🍛" },
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-4 transition-all hover:translate-x-1">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-stone-100 text-lg">
                  {item.icon}
                </div>
                <span className="text-[13px] font-bold text-stone-700 tracking-tight flex-1">{item.text}</span>
                <div className="h-6 w-6 rounded-full border-2 border-stone-200" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
