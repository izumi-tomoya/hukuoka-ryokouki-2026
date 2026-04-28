import type { TripEvent, Tip } from "@/features/trip/types/trip";

export const day1Events: TripEvent[] = [
  {
    time: "04:33",
    type: "transport",
    title: "出発：八王子から羽田へ",
    desc: "早朝の出発。二人の旅がいよいよ始まります✨",
    tag: "transport",
    tagLabel: "Departure",
    transitSteps: [
      {
        time: "04:33",
        station: "八王子",
        mode: "train",
        lineName: "JR中央線快速・東京行",
        duration: "56分",
        platform: "2番線",
      },
      {
        time: "05:29",
        station: "神田",
        mode: "walking",
        duration: "乗換4分",
      },
      {
        time: "05:33",
        station: "神田",
        mode: "train",
        lineName: "JR山手線外回り・東京・品川方面",
        duration: "9分",
        platform: "3番線着",
      },
      {
        time: "05:42",
        station: "浜松町",
        mode: "walking",
        duration: "乗換18分",
      },
      {
        time: "06:00",
        station: "浜松町",
        mode: "train",
        lineName: "東京モノレール空港快速・羽田空港第2ターミナル行",
        duration: "18分",
        platform: "1・2番線",
      },
      {
        time: "06:18",
        station: "羽田空港第2ターミナル",
        mode: "arrival",
      }
    ]
  },
  {
    time: "07:30",
    type: "transport",
    title: "羽田空港から福岡へ",
    desc: "07:30発。空路、博多へ向かいます。✈️",
    tag: "transport",
    tagLabel: "Flight",
    isConfirmed: true,
  },
  {
    time: "09:25",
    type: "sightseeing",
    title: "🛬 福岡空港 到着",
    desc: "福岡に到着！まずは地下鉄でホテルへ荷物を預けに移動します。",
    tag: "sightseeing",
    tagLabel: "Arrival",
    transitSteps: [
      {
        time: "09:40",
        station: "福岡空港",
        mode: "subway",
        lineName: "福岡市地下鉄空港線・姪浜行",
        duration: "9分",
        fare: "260円",
      },
      {
        time: "09:49",
        station: "中洲川端",
        mode: "walking",
        duration: "徒歩1分",
        exit: "6番出口直結",
      },
      {
        time: "09:55",
        station: "ホテルオークラ福岡",
        mode: "arrival",
      }
    ]
  },
  {
    time: "09:59",
    type: "transport",
    title: "太宰府へ移動",
    desc: "ホテルに荷物を預け、太宰府へ。西鉄の観光列車を楽しみましょう。",
    tag: "transport",
    tagLabel: "Transit",
    transitSteps: [
      {
        time: "10:03",
        station: "中洲川端",
        mode: "subway",
        lineName: "福岡市地下鉄空港線・姪浜行",
        duration: "3分",
        fare: "210円",
        platform: "2番線",
      },
      {
        time: "10:06",
        station: "天神",
        mode: "walking",
        duration: "徒歩7分",
      },
      {
        time: "10:15",
        station: "西鉄福岡",
        mode: "train",
        lineName: "西鉄天神大牟田線急行・太宰府行",
        duration: "32分",
        fare: "410円",
        platform: "当駅始発",
      },
      {
        time: "10:47",
        station: "太宰府",
        mode: "walking",
        duration: "徒歩3分",
      },
      {
        time: "10:54",
        station: "和牛めんたい 神楽",
        mode: "arrival",
      }
    ]
  },
  {
    time: "11:00",
    type: "food",
    title: "和牛めんたい 神楽",
    foodName: "🍱 和牛めんたい 神楽 (KAGURA)",
    foodDesc: "太宰府参道の名店で贅沢ランチ。整理券を早めに確保するのがポイント！",
    highlight: "🌟 参道を楽しみながら待ち時間を過ごせます。",
    locationUrl: "https://www.dazaifu-kagura.jp/",
    tag: "food",
    tagLabel: "Reserved",
    isConfirmed: true,
  },
  {
    time: "14:00",
    type: "sightseeing",
    title: "九州国立博物館",
    desc: "太宰府天満宮に隣接。美しい建築と展示をゆっくり見学。",
    tag: "sightseeing",
    tagLabel: "Culture",
  },
  {
    time: "15:00",
    type: "hotel",
    title: "🏨 ホテルオークラ福岡 チェックイン",
    desc: "ホテルに戻りチェックイン。一休みしてから夜の街へ。",
    tag: "hotel",
    tagLabel: "Okura",
    transitSteps: [
      {
        time: "14:30",
        station: "太宰府",
        mode: "train",
        lineName: "西鉄太宰府線・二日市行",
        duration: "6分",
      },
      {
        time: "14:40",
        station: "西鉄二日市",
        mode: "train",
        lineName: "西鉄天神大牟田線急行・福岡天神行",
        duration: "15分",
      },
      {
        time: "14:55",
        station: "西鉄福岡",
        mode: "walking",
        duration: "徒歩7分",
      },
      {
        time: "15:02",
        station: "天神",
        mode: "subway",
        lineName: "地下鉄空港線",
        duration: "2分",
      },
      {
        time: "15:05",
        station: "中洲川端",
        mode: "arrival",
      }
    ]
  },
  {
    time: "18:30",
    type: "food",
    title: "海鮮屋 はじめの一歩",
    foodName: "🐟 海鮮屋 はじめの一歩 キャナルシティ博多店",
    foodDesc: "【予約済み】ごまさば＋イカ活造り。博多の味を堪能。予約番号：#10356",
    highlight: "🌟 キャナルシティ内なので、噴水ショーもセットで！",
    locationUrl: "https://hajimeno-ippo.info/",
    tag: "food",
    tagLabel: "Reserved",
    isConfirmed: true,
    transitSteps: [
      {
        time: "18:15",
        station: "ホテルオークラ福岡",
        mode: "walking",
        duration: "徒歩12分",
      },
      {
        time: "18:27",
        station: "はじめの一歩",
        mode: "arrival",
      }
    ]
  },
  {
    time: "20:30",
    type: "basic",
    title: "中洲・屋台散策",
    desc: "福岡の夜の定番、屋台巡り。キャナルから中洲へはすぐです。",
    tag: "night",
    tagLabel: "Night View",
    isYatai: true,
    transitSteps: [
      {
        time: "20:30",
        station: "はじめの一歩",
        mode: "walking",
        duration: "徒歩5分",
      },
      {
        time: "20:35",
        station: "中洲屋台街",
        mode: "arrival",
      }
    ],
    yataiStops: [
      { time: "20:45", stop: "中洲エリア", desc: "雰囲気を楽しむ。" },
      { time: "21:30", stop: "天神エリア", desc: "地元の人と交流。" },
    ],
  },
];

export const day2Events: TripEvent[] = [
  {
    time: "08:00",
    type: "hotel",
    title: "🍳 オークラで朝食",
    desc: "ホテルでのゆったりとした朝食。フレンチトーストが絶品です。",
    tag: "hotel",
    tagLabel: "Breakfast",
  },
  {
    time: "12:00",
    type: "food",
    title: "水たき 長野",
    foodName: "🍲 水たき 長野",
    foodDesc: "博多名物の絶品水炊き。伝統の味を二人の記憶に。",
    locationUrl: "https://tabelog.com/fukuoka/A4001/A400102/40000010/",
    tag: "food",
    tagLabel: "Lunch",
    transitSteps: [
      {
        time: "11:45",
        station: "ホテルオークラ福岡",
        mode: "walking",
        duration: "徒歩10分",
      },
      {
        time: "11:55",
        station: "水たき 長野",
        mode: "arrival",
      }
    ]
  },
  {
    time: "14:00",
    type: "sightseeing",
    title: "大濠公園 / 大濠テラス",
    desc: "水辺を散策した後は、大濠テラスで八女茶を。静かな時間が、この後の特別なひとときをより輝かせます。",
    tag: "sightseeing",
    tagLabel: "Relax",
    transitSteps: [
      {
        time: "13:30",
        station: "水たき 長野",
        mode: "walking",
        duration: "徒歩10分",
      },
      {
        time: "13:42",
        station: "中洲川端",
        mode: "subway",
        lineName: "地下鉄空港線",
        duration: "5分",
      },
      {
        time: "13:47",
        station: "大濠公園",
        mode: "walking",
        duration: "徒歩3分",
      },
      {
        time: "13:50",
        station: "大濠公園",
        mode: "arrival",
      }
    ]
  },
  {
    time: "15:30",
    type: "food",
    title: "✨ Afternoon Tea (Secret Spot)",
    foodName: "🍰 天空のサプライズ・ティータイム",
    foodDesc: "バー＆ダイニング CLOUDS（ヒルトン福岡シーホーク）。絶景席を予約済み。予約番号：#YHCE9TJ5WD",
    highlight: "🌟 地上123mからの絶景と共に、二人で特別な時間を。",
    locationUrl: "https://tabelog.com/fukuoka/A4001/A400105/40004903/",
    tag: "surprise",
    tagLabel: "Surprise",
    isConfirmed: true,
    transitSteps: [
      {
        time: "15:00",
        station: "大濠公園",
        mode: "bus",
        lineName: "西鉄バス W1系統等",
        duration: "10分",
      },
      {
        time: "15:15",
        station: "ヒルトン福岡シーホーク前",
        mode: "walking",
        duration: "徒歩2分",
      },
      {
        time: "15:17",
        station: "CLOUDS",
        mode: "arrival",
      }
    ]
  },
  {
    time: "18:45",
    type: "food",
    title: "牧のうどん",
    foodName: "🍜 牧のうどん 空港店",
    foodDesc: "旅の〆は博多のソウルフード。スープを吸う麺が特徴。",
    tag: "food",
    tagLabel: "Dinner",
    transitSteps: [
      {
        time: "17:30",
        station: "ヒルトン福岡シーホーク",
        mode: "bus",
        lineName: "西鉄バス",
        duration: "25分",
      },
      {
        time: "18:30",
        station: "牧のうどん 空港店",
        mode: "arrival",
      }
    ]
  },
  {
    time: "20:45",
    type: "transport",
    title: "福岡空港から羽田へ",
    desc: "20:45発。二人の素晴らしい旅の締めくくりです。✈️",
    tag: "transport",
    tagLabel: "Flight",
    isConfirmed: true,
    transitSteps: [
      {
        time: "20:00",
        station: "牧のうどん",
        mode: "walking",
        duration: "徒歩5分",
      },
      {
        time: "20:05",
        station: "福岡空港ターミナル",
        mode: "arrival",
      }
    ]
  },
];

export const day1Tips: Tip[] = [
  { title: "予約の確認", body: "ホテルオークラ福岡は朝食付です。チェックイン時に確認を。" },
  { title: "フライト", body: "往復のフライト座席は事前に確認済み。モバイル搭乗券を準備しましょう。" },
  { title: "移動", body: "福岡市内の移動は地下鉄が便利。ICカードのチャージを確認してください。" },
];

export const day2Tips: Tip[] = [
  { title: "水たき長野", body: "支払いは現金のみなので注意してください。" },
  { title: "お土産", body: "福岡空港で最後にまとめて購入するのがスムーズです。" },
];

export const itoshimaEvents: TripEvent[] = [];
export const itoshimaTips: Tip[] = [];
