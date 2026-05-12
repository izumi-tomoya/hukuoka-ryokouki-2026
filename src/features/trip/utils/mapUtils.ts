import type { Tip, TripEvent } from "@/features/trip/types/trip";
import { cleanLocationName } from "@/features/trip/utils/locationCatalog";
import { isSecretContent, isSecretEvent } from "@/features/trip/utils/tripUtils";

export function extractLocationsFromEvents(
  events: TripEvent[],
  tips: Tip[] = [],
  isAdmin: boolean = false,
  knownSpots: string[] = [],
): string[] {
  const routeLocations = events.flatMap((e) => {
    // 管理者でない場合、サプライズ（秘密）イベントは場所を抽出しない
    if (isSecretEvent(e, isAdmin)) return [];

    // 1. 交通手段の場合は駅名を抽出
    if (e.type === "transport" && e.transitSteps && e.transitSteps.length > 0) {
      return e.transitSteps.map((s) => s.station).filter((s): s is string => !!s && !isSecretContent(s)); // 秘密の駅名は除外
    }

    // 2. 屋台の場合は立ち寄り地点を抽出
    if (e.isYatai && e.yataiStops) {
      return e.yataiStops.map((s) => s.stop).filter((s) => !isSecretContent(s));
    }

    // 3. 通常のイベント。ただし、移動に関する一般的なタイトルはスキップする
    const skipTitles = [
      "到着",
      "羽田空港から福岡へ",
      "福岡空港から羽田へ",
      "🛬 福岡空港 到着",
      "福岡空港 到着",
      "出発：八王子から羽田へ",
      "福岡空港ターミナル",
      "空路、福岡へ",
      "空路、福岡へ（羽田空港）",
    ];

    if (e.title && skipTitles.some((skip) => e.title?.includes(skip))) {
      return [];
    }

    const locationName = e.foodName || e.formalName || e.title;
    if (!locationName || isSecretContent(locationName)) {
      return [];
    }

    return [cleanLocationName(locationName)];
  });

  // 4. Tips（提案）から既知のスポット名を抽出
  const tipLocations = tips.flatMap((tip) => {
    const foundSpots = knownSpots.filter((spot) => tip.title.includes(spot) || tip.venue?.includes(spot));
    return foundSpots;
  });

  const allLocations = [...routeLocations, ...tipLocations].filter(
    (loc): loc is string => !!loc && loc.length > 0 && loc !== "到着" && loc !== "出発",
  );

  // 重複を削除
  return Array.from(new Set(allLocations));
}
