import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getTripBySlug } from "@/features/trip/api/tripActions";
import TipsSection from "@/components/trip/TipsSection";
import CategoryTabs from "@/components/trip/CategoryTabs";

export default async function TipsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const session = await auth();
  if (!session?.user?.isAdmin) redirect(`/trip/${slug}`);

  const trip = await getTripBySlug(slug);
  if (!trip) return notFound();

  const tips = trip.tips.map((t) => ({ title: t.title, body: t.body, isWarning: t.isWarning }));

  return (
    <div className="min-h-screen bg-stone-50 pb-20">
      <header className="px-6 pt-16 pb-8 mx-auto max-w-5xl">
        <CategoryTabs slug={slug} activePath={`/trip/${slug}/tips`} isSecretMode={true} />
        
        <div className="mt-12 text-center md:text-left">
          <h1 className="font-playfair text-5xl font-extrabold text-stone-900 mb-4 tracking-tight">Secret Tips</h1>
          <p className="text-stone-400 text-xs font-bold tracking-[0.2em] uppercase">管理者専用プレミアムガイド</p>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6">
        <TipsSection tips={tips} dayNumber={1} />
      </main>
    </div>
  );
}
