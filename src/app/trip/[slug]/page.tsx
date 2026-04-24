import { notFound } from "next/navigation";
import Link from "next/link";
import { cookies } from "next/headers";
import { SECRET_MODE_COOKIE_NAME } from "@/config/constants";
import { getTripBySlug } from "@/features/trip/api/tripActions";
import { Calendar, ChevronRight, Clock } from "lucide-react";
import TripLayout from "@/components/trip/TripLayout";
import { TripCountdown } from "@/features/trip/components/client/TripCountdown";
import { auth } from "@/lib/auth";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default async function TripPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);
  if (!trip) return notFound();

  const session = await auth();
  const isAdmin = !!session?.user?.isAdmin;

  return (
    <TripLayout 
      slug={slug} 
      activePath={`/trip/${slug}`} 
      isSecretMode={isAdmin} 
      title={trip.title}
      subtitle={`${trip.location} / ${new Date(trip.startDate).toLocaleDateString("ja-JP", { month: "short", day: "numeric" })} — ${new Date(trip.endDate).toLocaleDateString("ja-JP", { month: "short", day: "numeric" })}`}
    >
      <Container className="pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          <div className="md:col-span-2 overflow-hidden rounded-[3rem] bg-white border border-rose-100 p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 text-rose-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">
                <Clock size={12} />
                Countdown to Journey
              </div>
              <h3 className="font-playfair text-3xl font-bold text-stone-900">旅の始まりまで、あと...</h3>
            </div>
            <div className="shrink-0">
              <TripCountdown startDate={trip.startDate} />
            </div>
          </div>

          <SectionHeader title="Itinerary" subtitle="Daily Plans" className="md:col-span-2 mb-0" />

          {trip.days.map((day) => (
            <Link
              key={day.id}
              href={`/trip/${slug}/day/${day.dayNumber}`}
              className="group block rounded-[2.5rem] border border-rose-100 bg-white p-10 shadow-sm transition-all hover:shadow-2xl hover:-translate-y-1.5 hover:border-rose-300"
            >
              <div className="flex justify-between items-start mb-12">
                <span className="text-[10px] font-black uppercase tracking-[0.5em] text-rose-400">Chapter {day.dayNumber}</span>
                <div className="h-14 w-14 rounded-3xl bg-rose-50 flex items-center justify-center text-rose-500 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-sm">
                  <ChevronRight size={24} strokeWidth={2.5} />
                </div>
              </div>
              <h2 className="font-playfair text-4xl font-bold text-stone-900 mb-4 leading-tight">{day.title}</h2>
              <div className="pt-6 border-t border-stone-50 flex items-center justify-between text-xs font-bold text-stone-400 uppercase tracking-widest">
                <span>{new Date(day.date).toLocaleDateString("ja-JP", { month: "short", day: "numeric", weekday: "short" })}</span>
                <span>{day.events.length} Plans</span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </TripLayout>
  );
}
