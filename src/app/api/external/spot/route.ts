import { NextResponse } from "next/server";
import { searchGourmet } from "@/lib/external/hotpepper";
import { searchNearbySpots } from "@/lib/external/yahoo";

function normalizeKeyword(keyword: string) {
  return keyword
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/gu, "")
    .replace(/\(.*?\)/g, "")
    .trim();
}

function isGourmetLike(name: string, category?: string | null) {
  const text = `${name} ${category || ""}`;
  return /食|グルメ|レストラン|居酒屋|カフェ|喫茶|ラーメン|うどん|寿司|焼肉|ホテル/.test(text);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");
  const latParam = searchParams.get("lat");
  const lngParam = searchParams.get("lng");
  const address = searchParams.get("address");
  const category = searchParams.get("category");
  const description = searchParams.get("description");
  const locationUrl = searchParams.get("locationUrl");

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const keyword = normalizeKeyword(name);
  const lat = latParam ? Number(latParam) : undefined;
  const lng = lngParam ? Number(lngParam) : undefined;
  const allowCoords = Number.isFinite(lat) && Number.isFinite(lng);

  try {
    if (isGourmetLike(keyword, category)) {
      const gourmet = await searchGourmet(keyword, allowCoords ? lat : undefined, allowCoords ? lng : undefined);
      if (gourmet) {
        return NextResponse.json({
          source: "hotpepper",
          name: gourmet.name,
          address: gourmet.address || address || "",
          description: gourmet.catch || description || "",
          image: gourmet.photo || gourmet.logo || "",
          open: gourmet.open || "",
          url: gourmet.url || locationUrl || "",
          budget: gourmet.budget || "",
          category: category || "グルメ",
          tags: [
            gourmet.wifi?.includes("あり") ? "Wi-Fi" : "",
            gourmet.card?.includes("可") ? "カード可" : "",
            gourmet.barrier_free?.includes("あり") ? "バリアフリー" : "",
            gourmet.pet?.includes("可") ? "ペット可" : "",
          ].filter(Boolean),
          couponUrl: gourmet.coupon || "",
        });
      }
    }

    if (allowCoords) {
      const nearby = await searchNearbySpots(lat as number, lng as number, keyword);
      const matched =
        nearby.find((spot: { name: string; address: string; category?: string; lat: string; lng: string }) => 
          keyword.includes(spot.name) || spot.name.includes(keyword)
        ) || nearby[0];

      if (matched) {
        return NextResponse.json({
          source: "yahoo",
          name: matched.name || keyword,
          address: matched.address || address || "",
          description: description || "",
          image: "",
          open: "",
          url: locationUrl || "",
          budget: "",
          category: matched.category || category || "",
          tags: [matched.category || category || ""].filter(Boolean),
          couponUrl: "",
          nearby: nearby.slice(0, 3),
        });
      }
    }

    return NextResponse.json({
      source: "memoir",
      name: keyword,
      address: address || "",
      description: description || "",
      image: "",
      open: "",
      url: locationUrl || "",
      budget: "",
      category: category || "",
      tags: [category || ""].filter(Boolean),
      couponUrl: "",
    });
  } catch (error) {
    console.error("Spot info route failed:", error);
    return NextResponse.json({ error: "Failed to load spot info" }, { status: 500 });
  }
}
