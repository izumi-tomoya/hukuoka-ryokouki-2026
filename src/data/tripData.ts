import type { TripEvent, Tip } from "@/features/trip/types/trip";

export const day1Events: TripEvent[] = [
  {
    time: "04:33",
    type: "transport",
    title: "出発：八王子から羽田空港へ",
    desc: "静寂の八王子駅から、二人の旅が始まります。羽田までは約1時間45分の移動です。",
    tag: "transport",
    tagLabel: "Departure",
    locationUrl: "https://www.google.com/maps/search/?api=1&query=八王子駅",
    transitSteps: [
      {
        time: "04:33",
        station: "八王子駅",
        mode: "train",
        lineName: "JR中央線快速・東京行",
        duration: "54分",
        platform: "2番線発",
      },
      {
        time: "05:27",
        station: "神田駅",
        mode: "walking",
        duration: "徒歩5分",
        desc: "3番線の山手線ホームへ移動。早朝なのでスムーズです。",
      },
      {
        time: "05:32",
        station: "神田駅",
        mode: "train",
        lineName: "JR山手線外回り・品川方面",
        duration: "9分",
        platform: "3番線発",
      },
      {
        time: "05:41",
        station: "浜松町駅",
        mode: "walking",
        duration: "徒歩10分",
        desc: "モノレール乗り換え口へ。連絡通路を渡ります。",
      },
      {
        time: "06:00",
        station: "モノレール浜松町駅",
        mode: "train",
        lineName: "東京モノレール空港快速",
        duration: "18分",
        platform: "1番線発",
      },
      {
        time: "06:18",
        station: "羽田空港第2ターミナル",
        mode: "arrival",
        desc: "到着後、出発ロビーへ。自動手荷物預け機を利用しましょう。",
      }
    ]
  },
  {
    time: "07:30",
    type: "transport",
    title: "空路、福岡へ",
    desc: "07:30発。雲の上で、これからの二人の時間に想いを馳せて。✈️",
    tag: "transport",
    tagLabel: "Flight",
    locationUrl: "https://www.google.com/maps/dir/?api=1&origin=羽田空港&destination=福岡空港&travelmode=transit",
    isConfirmed: true,
  },
  {
    time: "09:25",
    type: "sightseeing",
    title: "🛬 福岡空港 到着",
    desc: "福岡に到着！降機後、地下鉄駅へ。11時のランチ予約に向けて移動を開始します。",
    tag: "sightseeing",
    tagLabel: "Arrival",
    locationUrl: "https://www.google.com/maps/search/?api=1&query=福岡空港",
    transitSteps: [
      {
        time: "09:45",
        station: "福岡空港駅",
        mode: "subway",
        lineName: "福岡市地下鉄空港線・姪浜行",
        duration: "9分",
        fare: "260円",
      },
      {
        time: "09:54",
        station: "中洲川端駅",
        mode: "walking",
        duration: "徒歩1分",
        desc: "6番出口直結。そのままホテルオークラ福岡のクロークへ。",
      },
      {
        time: "10:00",
        station: "ホテルオークラ福岡",
        mode: "arrival",
        desc: "荷物を預け、身軽になって即座に天神へ向かいます。",
      }
    ]
  },
  {
    time: "10:05",
    type: "transport",
    title: "太宰府へ：西鉄観光列車の旅",
    desc: "中洲川端から天神へ。西鉄の急行で太宰府を目指します。",
    tag: "transport",
    tagLabel: "Transit",
    locationUrl: "https://www.google.com/maps/dir/?api=1&origin=中洲川端駅&destination=太宰府駅&travelmode=transit",
    transitSteps: [
      {
        time: "10:08",
        station: "中洲川端駅",
        mode: "subway",
        lineName: "地下鉄空港線",
        duration: "3分",
        platform: "2番線",
      },
      {
        time: "10:11",
        station: "天神駅",
        mode: "walking",
        duration: "徒歩4分",
        desc: "地下街を足早に抜け、西鉄福岡（天神）駅の北口改札へ。",
      },
      {
        time: "10:15",
        station: "西鉄福岡（天神）駅",
        mode: "train",
        lineName: "西鉄天神大牟田線急行・太宰府行",
        duration: "32分",
        fare: "410円",
        platform: "3番線（当駅始発）",
      },
      {
        time: "10:47",
        station: "太宰府駅",
        mode: "walking",
        duration: "徒歩3分",
      },
      {
        time: "10:55",
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
    foodDesc: "【11:00予約】太宰府参道の名店で贅沢ランチ。開店直後の最高のタイミングで入店します。",
    highlight: "🌟 参道の賑わいを感じながら、至福のひとときを。",
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
    locationUrl: "https://www.google.com/maps/search/?api=1&query=九州国立博物館",
    transitSteps: [
      {
        time: "13:50",
        station: "和牛めんたい 神楽",
        mode: "walking",
        duration: "徒歩10分",
      },
      {
        time: "14:00",
        station: "九州国立博物館",
        mode: "arrival",
      }
    ]
  },
  {
    time: "15:00",
    type: "hotel",
    title: "🏨 ホテルオークラ福岡 チェックイン",
    desc: "ホテルに戻りチェックイン。一休みしてから夜の街へ。",
    tag: "hotel",
    tagLabel: "Reserved",
    isConfirmed: true,
    locationUrl: "https://www.google.com/maps/dir/?api=1&origin=太宰府駅&destination=ホテルオークラ福岡&travelmode=transit",
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
    locationUrl: "https://www.google.com/maps/search/?api=1&query=キャナルシティ博多+はじめの一歩",
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
    locationUrl: "https://www.google.com/maps/dir/?api=1&origin=キャナルシティ博多&destination=中洲屋台街&travelmode=walking",
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
    tagLabel: "Reserved",
    isConfirmed: true,
  },
  {
    time: "12:00",
    type: "food",
    title: "水たき 長野",
    foodName: "🍲 水たき 長野",
    foodDesc: "【予約済み】博多名物の絶品水炊き。伝統の味を二人の記憶に。",
    locationUrl: "https://tabelog.com/fukuoka/A4001/A400102/40000010/",
    tag: "food",
    tagLabel: "Reserved",
    isConfirmed: true,
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
    tagLabel: "Reserved",
    isConfirmed: true,
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
  { title: "水たき長野", body: "支払いは現金のみなので注意してください。", isWarning: true },
  { title: "お土産", body: "福岡空港で最後にまとめて購入するのがスムーズです。" },
];

export const packingList = [
  // 必需品
  { name: "スマートフォン", category: "Essential" },
  { name: "身分証明書・免許証", category: "Essential" },
  { name: "航空券（モバイル搭乗券）", category: "Essential" },
  { name: "現金（屋台や一部店舗用）", category: "Essential" },
  { name: "クレジットカード", category: "Essential" },
  { name: "交通系ICカード（nimoca/SUGOCA等）", category: "Essential" },
  { name: "健康保険証", category: "Essential" },
  
  // 衣類
  { name: "着替え（2日分）", category: "Clothing" },
  { name: "下着・靴下", category: "Clothing" },
  { name: "パジャマ（ホテルにあるが、こだわりがあれば）", category: "Clothing" },
  { name: "歩きやすい靴", category: "Clothing" },
  { name: "羽織もの（朝晩の冷え込み対策）", category: "Clothing" },
  
  // ガジェット
  { name: "モバイルバッテリー（必須！）", category: "Gadget" },
  { name: "充電ケーブル（スマホ・ウォッチ用）", category: "Gadget" },
  { name: "ACアダプター", category: "Gadget" },
  { name: "カメラ・SDカード", category: "Gadget" },
  { name: "ワイヤレスイヤホン", category: "Gadget" },
  
  // その他
  { name: "常備薬（胃薬・鎮痛剤など）", category: "Other" },
  { name: "折りたたみ傘", category: "Other" },
  { name: "エコバッグ（お土産用）", category: "Other" },
  { name: "除菌シート・ハンドジェル", category: "Other" },
  { name: "ハンカチ・ティッシュ", category: "Other" },
];

export const itoshimaEvents: TripEvent[] = [];
export const itoshimaTips: Tip[] = [];
