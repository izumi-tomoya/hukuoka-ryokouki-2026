import { notFound } from "next/navigation";
import { getEventBySlug } from "@/features/trip/api/getExtendedTripData";
import { getSecretMode } from "@/features/trip/api/secretMode";
import SpotDetailView from "@/features/trip/components/SpotDetailView";

type PageProps = {
  params: Promise<{
    slug: string;
    spotId: string;
  }>;
};

export default async function SpotDetailPage({ params }: PageProps) {
  const { slug, spotId } = await params;
  const [event, isAdmin] = await Promise.all([getEventBySlug(spotId), getSecretMode()]);

  if (!event) {
    notFound();
  }

  return <SpotDetailView event={event} slug={slug} isAdmin={isAdmin} />;
}
