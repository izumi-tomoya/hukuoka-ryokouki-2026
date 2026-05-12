import { notFound } from "next/navigation";
import { day1Events, day1Tips, day2Events, day2Tips } from "@/data/tripData";
import DaySummaryReport from "@/features/trip/components/DaySummaryReport";

type PageProps = {
  params: Promise<{
    slug: string;
    id: string;
  }>;
};

export default async function DaySummaryPage({ params }: PageProps) {
  const { slug, id } = await params;

  // IDに基づいてデータを取得（Day 1 または Day 2）
  const events = id === "1" ? day1Events : id === "2" ? day2Events : null;
  const tips = id === "1" ? day1Tips : id === "2" ? day2Tips : [];

  if (!events) {
    notFound();
  }

  return <DaySummaryReport dayId={id} events={events} tips={tips} slug={slug} />;
}
