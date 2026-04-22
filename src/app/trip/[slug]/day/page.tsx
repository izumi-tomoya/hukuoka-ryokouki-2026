import { redirect } from "next/navigation";

export default async function DayIndexPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  redirect(`/trip/${slug}/day/1`);
}
