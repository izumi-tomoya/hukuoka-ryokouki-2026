import { notFound } from "next/navigation";
import { getEventsByCategory } from "@/features/trip/api/getExtendedTripData";
import CategorySummaryView from "@/features/trip/components/CategorySummaryView";

type PageProps = {
  params: Promise<{
    slug: string;
    category: string;
  }>;
};

export default async function CategoryPage({ params }: PageProps) {
  const { slug, category } = await params;
  const events = await getEventsByCategory(category);

  if (events.length === 0) {
    // 存在しないカテゴリの場合は 404
    notFound();
  }

  return <CategorySummaryView category={category} events={events} slug={slug} />;
}
