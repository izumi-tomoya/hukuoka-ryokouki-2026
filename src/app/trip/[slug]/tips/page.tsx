import { notFound, redirect } from "next/navigation";
import { cookies } from "next/headers";
import { SECRET_MODE_COOKIE_NAME } from "@/config/constants";
import { getTripBySlug } from "@/features/trip/api/tripActions";
import TipsSection from "@/components/trip/TipsSection";
import Link from "next/link";
import { BentoTile } from "@/components/ui/BentoTile";

export default async function TipsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const cookieStore = await cookies();
  const isSecretMode = cookieStore.get(SECRET_MODE_COOKIE_NAME)?.value === "true";
  if (!isSecretMode) redirect(`/trip/${slug}`);

  const trip = await getTripBySlug(slug);
  if (!trip) return notFound();

  const tips = trip.tips.map((t) => ({ title: t.title, body: t.body, isWarning: t.isWarning }));

  return (
    <main className="min-h-screen bg-[#FDFDFC] text-[#2D2D2D] p-6 md:p-12">
      <header className="mb-12">
        <Link href={`/trip/${slug}`} className="text-zinc-400 hover:text-zinc-900 transition-colors mb-4 block">← Back to trip</Link>
        <h1 className="text-3xl font-light tracking-tight">Escort Tips</h1>
        <p className="text-zinc-500 text-base mt-3">彼氏専用プレミアムガイド</p>
      </header>

      {tips.length === 0 ? (
        <BentoTile>Tipsはまだ登録されていません</BentoTile>
      ) : (
        <TipsSection tips={tips} dayNumber={1} />
      )}

      <section className="mt-12">
        <h2 className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-6">Final Checklist</h2>
        <BentoTile>
          <ul className="space-y-6">
            {[
              { text: "モバイルバッテリーの充電", icon: "🔋" },
              { text: "現金の用意（屋台用）", icon: "💴" },
              { text: "折り畳み傘の持参", icon: "🌂" },
              { text: "お腹の空き具合の調整", icon: "🍛" },
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-zinc-50 text-xl">
                  {item.icon}
                </div>
                <span className="text-sm font-medium text-zinc-700 flex-1">{item.text}</span>
                <div className="h-5 w-5 rounded-full border border-zinc-200" />
              </li>
            ))}
          </ul>
        </BentoTile>
      </section>
    </main>
  );
}
