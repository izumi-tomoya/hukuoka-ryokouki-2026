import { redirect } from "next/navigation";
import { getTripBySlug } from "@/features/trip/api/tripActions";

export default async function DayIndexPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const trip = await getTripBySlug(slug);
  
  if (trip && trip.days.length > 0) {
    const firstDay = trip.days.sort((a, b) => a.dayNumber - b.dayNumber)[0];
    redirect(`/trip/${slug}/day/${firstDay.dayNumber}`);
  }
  
  redirect(`/trip/${slug}`);
}
