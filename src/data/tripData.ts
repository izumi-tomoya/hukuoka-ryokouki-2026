import type { TripEvent, Tip } from "@/features/trip/types/trip";

export const day1Events: TripEvent[] = [
  {
    time: "04:15",
    type: "transport",
    title: "出発",
    desc: "家を出発。福岡物語、いよいよスタート✨",
    tag: "transport",
    tagLabel: "Departure",
  },
  {
    time: "07:30",
    type: "transport",
    title: "ANA241便にて福岡へ出発",
    desc: "羽田(07:30)発。二人の福岡物語✨",
    tag: "transport",
    tagLabel: "Flight",
  },
  {
    time: "09:25",
    type: "sightseeing",
    title: "🛬 福岡空港 到着",
    desc: "定刻通り到着。オークラ福岡へ移動。",
    tag: "sightseeing",
    tagLabel: "Arrival",
    access: ["福岡空港", "→ 地下鉄 →", "ホテルオークラ福岡"],
  },
  {
    time: "10:30",
    type: "transport",
    title: "特急「旅人」で太宰府へ",
    desc: "西鉄天神駅から太宰府へ。優雅な列車旅。",
    tag: "transport",
    tagLabel: "Transit",
  },
  {
    time: "11:15",
    type: "food",
    foodName: "🍱 和牛めんたい 神楽 (KAGURA)",
    foodDesc: "太宰府参道の名店で贅沢ランチ。",
    highlight: "整理券を早めに確保するのがポイント！",
    locationUrl: "https://www.dazaifu-kagura.jp/",
  },
  {
    time: "14:00",
    type: "sightseeing",
    title: "九州国立博物館",
    desc: "美しい建築と展示をゆっくり見学。",
    tag: "sightseeing",
    tagLabel: "Culture",
  },
  {
    time: "15:00",
    type: "hotel",
    title: "🏨 ホテルオークラ福岡 チェックイン",
    desc: "荷物を預けて一休み。",
    tag: "hotel",
    tagLabel: "Okura",
  },
  {
    time: "18:30",
    type: "food",
    foodName: "🐟 海鮮屋 はじめの一歩 キャナルシティ博多店",
    foodDesc: "【予約済み】とりあえずごまさば＋イカ活造りプラン。博多名物のごまさばと、鮮度抜群のイカ活造りを堪能。予約番号：#10356",
    highlight: "🌟 18:30入店〜20:30退店。キャナルシティ内にあるので、食前後に噴水ショーを楽しむのがおすすめ！",
    locationUrl: "https://hajimeno-ippo.info/",
    tag: "food",
    tagLabel: "Reserved",
    isConfirmed: true,
  },
  {
    time: "20:30",
    type: "basic",
    title: "中洲・屋台散策",
    desc: "福岡の夜の定番、屋台巡り。",
    isYatai: true,
    yataiStops: [
      { time: "20:30", stop: "中洲エリア", desc: "雰囲気を楽しむ。" },
      { time: "21:30", stop: "天神エリア", desc: "地元の人と交流。" },
    ],
  },
];
// ... (day2Events, tips等)

export const day2Events: TripEvent[] = [
  {
    time: "08:00",
    type: "hotel",
    title: "🍳 オークラで朝食",
    desc: "ホテルでのゆったりとした朝食。",
    tag: "hotel",
    tagLabel: "Breakfast",
  },
  {
    time: "12:00",
    type: "food",
    foodName: "🍲 水たき 長野",
    foodDesc: "博多名物の絶品水炊き。",
    locationUrl: "https://tabelog.com/fukuoka/A4001/A400102/40000010/",
  },
  {
    time: "14:00",
    type: "sightseeing",
    title: "大濠公園",
    desc: "公園を散策し、スタバでのんびり。",
    tag: "sightseeing",
    tagLabel: "Ohori Park",
  },
  {
    time: "15:45",
    type: "surprise",
    title: "福岡タワー",
    desc: "地上123mからのパノラマビュー。",
    locationUrl: "https://www.fukuokatower.co.jp/",
  },
  {
    time: "18:45",
    type: "food",
    foodName: "🍜 牧のうどん",
    foodDesc: "旅の〆は博多のソウルフード。",
    tag: "food",
    tagLabel: "Dinner",
  },
  {
    time: "20:45",
    type: "transport",
    title: "ANA272便にて羽田へ",
    desc: "福岡(20:45)発。お疲れ様でした！",
    tag: "transport",
    tagLabel: "Flight",
  },
];

export const day1Tips: Tip[] = [
  { title: "予約の確認", body: "ホテルオークラ福岡は朝食付です。チェックイン時に確認を。" },
  { title: "フライト", body: "ANA241/272便です。座席は事前に確認済み。" },
];

export const day2Tips: Tip[] = [
  { title: "水たき長野", body: "支払いは現金のみなので注意してください。" },
];

export const itoshimaEvents: TripEvent[] = [];
export const itoshimaTips: Tip[] = [];
