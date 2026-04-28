import { TripEvent, Tip } from "@/features/trip/types/trip";

// 福岡の主要スポット名のリスト（これらが Tip に含まれていれば抽出する）
const KNOWN_SPOTS = [
  '博多駅', '福岡空港', '天神', '中洲', '大濠公園', '福岡タワー', 
  '太宰府', '糸島', 'キャナルシティ', 'マリンメッセ', 'ホテルオークラ福岡',
  '神楽', '九州国立博物館', '水たき 長野', '牧のうどん', 'はじめの一歩',
  '志賀島', '能古島', '門司港', 'ヒルトン', 'CLOUDS'
];

export function extractLocationsFromEvents(events: TripEvent[], tips: Tip[] = [], isAdmin: boolean = false): string[] {
  const routeLocations = events.flatMap(e => {
    // 管理者でない場合、サプライズイベントは場所を抽出しない
    if (!isAdmin && e.tag === 'surprise') return [];

    // 1. 交通手段の場合は駅名を抽出
    if (e.type === 'transport' && e.transitSteps && e.transitSteps.length > 0) {
      return e.transitSteps
        .map(s => s.station)
        .filter((s): s is string => !!s);
    }
    // 2. 屋台の場合は立ち寄り地点を抽出
    if (e.isYatai && e.yataiStops) {
      return e.yataiStops.map(s => s.stop);
    }
    
    // 3. 通常のイベントは店名やタイトルを使用
    const skipTitles = [
      "出発", "到着", "羽田空港から福岡へ", "福岡空港から羽田へ", 
      "🛬 福岡空港 到着", "福岡空港 到着", "出発：八王子から羽田へ",
      "福岡空港ターミナル"
    ];
    if (e.title && skipTitles.includes(e.title)) return [];
    
    const locationName = e.foodName || e.title;
    // 絵文字を除去したクリーンな名前を返す
    return [locationName.replace(/[\u1F600-\u1F64F]|[\u2700-\u27BF]|[\u1F300-\u1F5FF]|[\u1F680-\u1F6FF]|[\u2600-\u26FF]/g, '').trim()];
  });

  // 4. Tips（提案）から既知のスポット名を抽出
  const tipLocations = tips.flatMap(tip => {
    const foundSpots = KNOWN_SPOTS.filter(spot => 
      tip.title.includes(spot) || (tip.venue && tip.venue.includes(spot))
    );
    return foundSpots;
  });

  const allLocations = [...routeLocations, ...tipLocations].filter((loc): loc is string => !!loc && loc.length > 0 && loc !== "到着" && loc !== "出発");

  // 重複を削除
  return allLocations.filter((loc, i) => allLocations.indexOf(loc) === i);
}
