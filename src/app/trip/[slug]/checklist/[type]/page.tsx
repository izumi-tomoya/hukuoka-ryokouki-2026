import { notFound } from "next/navigation";
import { getPackingListByCategory } from "@/features/trip/api/getExtendedTripData";
import ChecklistTypeView from "@/features/trip/components/ChecklistTypeView";

type PageProps = {
  params: Promise<{
    slug: string;
    type: string;
  }>;
};

export default async function ChecklistPage({ params }: PageProps) {
  const { slug, type } = await params;
  const items = await getPackingListByCategory(type, slug);

  if (items.length === 0) {
    notFound();
  }

  return <ChecklistTypeView type={type} items={items} slug={slug} />;
}
