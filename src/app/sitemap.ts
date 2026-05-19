import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // 基本的な静的ルート
  const staticRoutes = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 1,
    },
  ];

  try {
    // 全ての旅行データを取得
    const trips = await prisma.trip.findMany({
      include: {
        days: true,
      },
    });

    const tripRoutes = trips.flatMap((trip) => {
      const tripBaseUrl = `${baseUrl}/trip/${trip.slug}`;
      const lastModified = trip.updatedAt || new Date();

      // 各旅行のメインページ
      const routes = [
        {
          url: tripBaseUrl,
          lastModified,
          changeFrequency: "weekly" as const,
          priority: 0.8,
        },
        {
          url: `${tripBaseUrl}/memories`,
          lastModified,
          changeFrequency: "weekly" as const,
          priority: 0.6,
        },
        {
          url: `${tripBaseUrl}/info`,
          lastModified,
          changeFrequency: "weekly" as const,
          priority: 0.5,
        },
        {
          url: `${tripBaseUrl}/tips`,
          lastModified,
          changeFrequency: "weekly" as const,
          priority: 0.5,
        },
        {
          url: `${tripBaseUrl}/assist`,
          lastModified,
          changeFrequency: "monthly" as const,
          priority: 0.4,
        },
      ];

      // カテゴリーページ
      const categories = ["food", "sightseeing", "transport", "hotel"];
      categories.forEach((cat) => {
        routes.push({
          url: `${tripBaseUrl}/category/${cat}`,
          lastModified,
          changeFrequency: "weekly" as const,
          priority: 0.6,
        });
      });

      // 各日程のページ
      trip.days.forEach((day) => {
        routes.push({
          url: `${tripBaseUrl}/day/${day.dayNumber}`,
          lastModified,
          changeFrequency: "weekly" as const,
          priority: 0.7,
        });
      });

      return routes;
    });

    return [...staticRoutes, ...tripRoutes];
  } catch (error) {
    console.error("Sitemap generation failed:", error);
    return staticRoutes;
  }
}
