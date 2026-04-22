import { notFound } from "next/navigation";
import DayView from "@/components/trip/DayView";
import { day1Events, day2Events } from "@/data/tripData";

export default async function DayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  if (id === "1") {
    return <DayView events={day1Events} dayNumber={1} />;
  }
  
  if (id === "2") {
    return <DayView events={day2Events} dayNumber={2} />;
  }
  
  return notFound();
}
