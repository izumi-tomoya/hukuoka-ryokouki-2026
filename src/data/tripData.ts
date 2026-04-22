import type { TripEvent, Tip } from "@/types/trip";

export const day1Events: TripEvent[] = [
  {
    time: "04:15",
    type: "transport",
    title: "🏠 夜明け前の出発",
    desc: "黎明の静寂の中、特別な2日間の幕開け。忘れ物はない？二人の福岡物語、いよいよスタート✨",
    tag: "transport",
    tagLabel: "Departure",
  },
  {
    time: "04:25",
    type: "transport",
    title: "🚌 空港連絡バス (京王八王子駅前)",
    desc: "早朝の羽田行きバス。乗り換えなしで座っていけるから、空港まであともうひと眠り💤",
    tag: "transport",
    tagLabel: "Transit",
    access: ["自宅", "→ 徒歩/タクシー →", "京王八王子駅前(4番乗り場)"],
  },
  {
    time: "05:30",
    type: "transport",
    title: "✈️ 羽田空港 第2ターミナル到着",
    desc: "フライトの1時間半前。余裕を持って保安検査を済ませ、展望デッキで朝の空気を感じよう。",
    tag: "transport",
    tagLabel: "Airport",
  },
  {
    time: "07:00",
    type: "transport",
    title: "🛫 雲の上のティータイム",
    desc: "JAL/ANAの翼で福岡へ。窓の外に広がる雲海と、時折顔を出す富士山を探して。",
    tag: "transport",
    tagLabel: "Flight",
  },
  {
    time: "08:55",
    type: "sightseeing",
    title: "🛬 福岡空港 到着",
    desc: "着陸した瞬間から感じる、九州のエネルギー。都心まで地下鉄でわずか5分という魔法のような近さ。",
    tag: "sightseeing",
    tagLabel: "Fukuoka",
    access: ["福岡空港駅", "→ 地下鉄空港線(約10分) →", "中洲川端駅"],
  },
  {
    time: "09:30",
    type: "hotel",
    title: "🏨 ホテルオークラ福岡 プレチェックイン",
    desc: "重い荷物はここで預けて。博多の伝統と気品が漂うロビーで、少しだけ背筋を伸ばして出発。",
    tag: "hotel",
    tagLabel: "Okura",
  },
  {
    time: "10:30",
    type: "transport",
    title: "🚃 直通観光列車「旅人」で太宰府へ",
    desc: "日曜限定、天神10:30発の直通急行。ピンク色の可愛い車両が、観光気分を盛り上げてくれる🌸",
    tag: "transport",
    tagLabel: "Transit",
    access: ["天神駅", "→ 西鉄大牟田線(直通急行) →", "太宰府駅"],
  },
  {
    time: "11:15",
    type: "food",
    foodName: "🍱 和牛めんたい 神楽 (KAGURA)",
    foodDesc:
      "太宰府参道で最も輝く美食。蓋を開けた瞬間に立ち昇る湯気と、宝石のような和牛＆明太子。大川組子の器が織りなす伝統工芸の美しさを堪能。最後は出汁茶漬けで至福の〆を。",
    highlight: "💡 エスコート術：到着後すぐに店頭で整理券を。QRコードで順番を確認しながら、待ち時間に参拝や梅ヶ枝餅の食べ歩きをするのがスマート！",
    locationUrl: "https://www.dazaifu-kagura.jp/",
  },
  {
    time: "14:00",
    type: "sightseeing",
    title: "🏛️ 九州国立博物館の「蒼い空間」",
    desc: "山の中に浮かぶ巨大なミラーガラス。エスカレーターを抜けた先の「虹のトンネル」は、二人を異世界へ誘うフォトスポット。",
    tag: "sightseeing",
    tagLabel: "Culture",
  },
  {
    time: "16:00",
    type: "hotel",
    title: "🏨 オークラのプライベートルーム",
    desc: "正式にチェックイン。窓の外には那珂川の流れ。夜の喧騒の前に、上質なリネンに包まれて休息を。",
    tag: "hotel",
    tagLabel: "Relax",
  },
  {
    time: "17:30",
    type: "shopping",
    title: "💦 キャナルシティの黄昏",
    desc: "ホテルから川沿いを散策して10分。夕闇に映える18:00の噴水ショーは、二人の夜を彩る最初の演出。",
    tag: "shopping",
    tagLabel: "Evening",
    access: ["ホテル", "→ 那珂川沿い徒歩(約10分) →", "キャナルシティ"],
  },
  {
    time: "18:30",
    type: "food",
    foodName: "🐟 はじめの一歩 キャナルシティ博多店",
    foodDesc:
      "呼子の透き通るようなイカの活造り。足が動く鮮度は感動モノ。博多名物「ごまさば」も、ここでは一味違う洗練された味わい。博多の海の恵みを、二人で分かち合おう。",
    highlight: "🌟 ポイント：キャナルシティ内にあるので、食前後に噴水ショーを楽しむのが最高の流れ。カウンター席で板前さんの手さばきを見ながら、旬の地酒で乾杯！",
    locationUrl: "https://maps.app.goo.gl/UFoEzUdDGu9uomVF8",
  },
  {
    time: "20:30",
    type: "basic",
    isYatai: true,
    yataiStops: [
      {
        time: "20:30",
        stop: "1st: 中洲の川端屋台",
        desc: "ネオンが水面に映る中、まずは冷たいビールと焼きラーメンで福岡の夜を実感。",
      },
      {
        time: "21:15",
        stop: "2nd: 天神フレンチ屋台",
        desc: "少し趣向を変えて、フォアグラやワインが楽しめる屋台へ。意外性が会話を弾ませる✨",
      },
      {
        time: "22:00",
        stop: "3rd: 春吉の隠れ家",
        desc: "人混みを離れて、地元の人に愛される静かな屋台で〆の一杯。",
      },
    ],
  },
  {
    time: "23:00",
    type: "hotel",
    title: "😴 博多の夜に抱かれて",
    desc: "おやすみなさい。明日も、君の笑顔が見られますように。心地よい疲れとともに深い眠りへ。",
    tag: "hotel",
    tagLabel: "Good Night",
  },
];

export const day2Events: TripEvent[] = [
  {
    time: "07:30",
    type: "basic",
    title: "☀️ 優雅な朝の始まり",
    desc: "カーテンの隙間から差し込む光。ゆったりとした朝の目覚めが、今日の旅をより素敵にする。",
    tag: "transport",
    tagLabel: "Wake Up",
  },
  {
    time: "08:30",
    type: "food",
    foodName: "🍳 オークラ伝統のフレンチトースト",
    foodDesc:
      "一晩かけてアパレイユに浸し、じっくりと焼き上げられた「芸術品」。ぷるぷると震える柔らかさと、バターの香りに包まれる至福。博多の朝食で、これ以上の贅沢はないはず。",
    highlight: "🌟 ポイント：焼き上がりに時間がかかるので、席に着いたらまずオーダーを確認しておくのがスムーズ。",
    tag: "hotel",
    tagLabel: "Breakfast",
  },
  {
    time: "11:00",
    type: "hotel",
    title: "🧳 さよならオークラ",
    desc: "お世話になった部屋に別れを告げて。大きな荷物はフロントに預け、身軽な姿で午後の街へ繰り出そう。",
    tag: "hotel",
    tagLabel: "Checkout",
  },
  {
    time: "12:00",
    type: "food",
    foodName: "🍲 水たき 長野 (伝説の老舗)",
    foodDesc:
      "予約の取れない名店。白濁したスープは鶏の旨味が凝縮された美容液のよう。仲居さんが最高の一杯をよそってくれるから、僕たちはただ美味しいねって言い合える。〆のおじやは、すべての旨味を吸い込んだ絶品。",
    highlight: "⚠️ 注意：完全予約制(2ヶ月前から)。支払いは「現金のみ」なので、事前に千円札を多めに用意しておくとスマート。",
    access: ["ホテル", "→ タクシー(約5分) →", "水たき長野"],
    locationUrl: "https://tabelog.com/fukuoka/A4001/A400102/40000010/",
  },
  {
    time: "14:00",
    type: "sightseeing",
    title: "🌳 大濠公園のレイクリゾート",
    desc: "都会のオアシス。池の周りをゆっくりと。スターバックスでお気に入りの一杯を手に、ふたりの将来の話でもしてみる？",
    tag: "sightseeing",
    tagLabel: "Ohori Park",
    access: ["水たき長野", "→ 地下鉄(呉服町〜大濠公園) →", "大濠公園駅"],
  },
  {
    time: "15:15",
    type: "transport",
    title: "🚕 シーサイド・ドライブ",
    desc: "公園からタクシーに飛び乗って、海沿いの道を。次は、この旅最大のハイライトへ。",
    tag: "transport",
    tagLabel: "Taxi Move",
  },
  {
    time: "15:45",
    type: "surprise",
    title: "🗼 天空のパノラマ・シークレット",
    desc: "福岡タワー、地上123mの展望室。360度広がるオーシャンビューと、夕日に染まり始める街並み。恋人の聖地で、二人の絆を誓う南京錠を。",
    highlight: "🌟 サプライズ：実はここで、こっそり準備していた手紙や小さなギフトを渡すのに最高のシチュエーションです。",
    locationUrl: "https://www.fukuokatower.co.jp/",
    access: ["大濠公園", "→ タクシー(約10分) →", "福岡タワー"],
  },
  {
    time: "17:30",
    type: "basic",
    title: "🕐 ラスト・モーメント",
    desc: "空港へ向かう前のひととき。天神のデパートでお土産を眺めたり、お洒落なカフェで最後の福岡の空気を吸い込んで。",
    tag: "shopping",
    tagLabel: "Free Time",
  },
  {
    time: "18:45",
    type: "food",
    foodName: "🍜 牧のうどん 空港店",
    foodDesc:
      "旅の〆は、気取らない「博多のソウル」。スープを吸い続ける魔法の麺に、二人で笑いながら向き合おう。やかんの出汁を継ぎ足すのは僕の役目。これこそが、福岡の日常の贅沢。",
    highlight: "⚠️ 重要：19:45には店を出てタクシーで空港へ。麺がスープを吸って食べるのに時間がかかるので、余裕を持って入店を！",
    access: ["天神/博多", "→ タクシー →", "牧のうどん空港店"],
  },
  {
    time: "20:00",
    type: "shopping",
    title: "🛍️ 福岡空港 保安検査へ",
    desc: "20:45発の便に備えてターミナルへ。搭乗締切は20分前。最後に空港限定の明太キッシュを買えるかな？",
    tag: "shopping",
    tagLabel: "Souvenir",
    access: ["牧のうどん", "→ タクシー(約5分) →", "空港ターミナル"],
  },
  {
    time: "20:45",
    type: "transport",
    title: "✈️ さよなら福岡、また来るね",
    desc: "滑走路の光が宝石のように流れていく。帰りたくないね、そんな言葉を交わしながら高度を上げていく。",
    tag: "transport",
    tagLabel: "Flight",
  },
  {
    time: "22:25",
    type: "transport",
    title: "🛬 羽田の夜風",
    desc: "無事到着。日常に戻る前の、少しだけ寂しいけれど温かい時間。モノレールからの夜景も、今日は特別に見える。",
    tag: "transport",
    tagLabel: "Arrival",
  },
  {
    time: "24:00",
    type: "hotel",
    title: "🏠 お家が「一番」になる魔法",
    desc: "ただいま。最高の旅をありがとう。ふたりの思い出の1ページが、今日完成しました。おやすみなさい💤",
    tag: "hotel",
    tagLabel: "Home",
  },
];

export const day1Tips: Tip[] = [
  {
    title: "🚌 八王子からの最短ルート",
    body: "京王線始発よりも、04:25発の空港連絡バス(西東京バス/京急バス)を事前予約するのが最も確実で快適。新宿での乗り換えもなく、重い荷物も預けられます。",
  },
  {
    title: "⛩️ 太宰府『旅人』号の狙い方",
    body: "日曜朝、天神発の直通列車は10:30や11:00など。これを逃すと二日市駅での乗り換えが必要になるため、ホテルに荷物を預けたら即座に天神へ向かうのが吉。",
    isWarning: true,
  },
  {
    title: "🏮 屋台ハシゴの作法",
    body: "屋台は『長居しない』のが粋。1軒45分程度を目安に。中洲→天神の移動は、タクシーを使うと彼女の足も疲れず、優雅にハシゴを楽しめます。千円札を多めに用意して！",
  },
];

export const day2Tips: Tip[] = [
  {
    title: "🍲 水たき長野の『作法』",
    body: "創業100年の超人気店。月曜は営業していますが事前予約(092-281-2200)が必須。支払いは現金のみなので注意！仲居さんがすべて作ってくれるので、彼女との会話に集中して☺️",
    isWarning: true,
  },
  {
    title: "🚕 タクシー配車アプリの活用",
    body: "大濠公園や福岡タワー周辺は、タイミングによってタクシーが捕まりにくいことも。『GO』や『Uber』を事前に登録しておき、移動の5分前に呼ぶのが完璧なエスコートです。",
  },
  {
    title: "🍜 牧のうどん『空港店』の罠",
    body: "店名は空港店ですが、ターミナルからは離れています。徒歩は無理！19:45には店を出てタクシーを呼ぶのが、20:45のフライトに遅れないための鉄則です。",
    isWarning: true,
  },
];

export const itoshimaEvents: TripEvent[] = [
  {
    time: "10:00",
    type: "transport",
    title: "🚗 レンタカーで糸島へ出発",
    desc: "博多駅や天神でレンタカーをピックアップ。お気に入りのプレイリストを流して、シーサイドドライブの始まり！",
    tag: "transport",
    tagLabel: "Drive",
  },
  {
    time: "11:00",
    type: "sightseeing",
    title: "⛩️ 桜井二見ヶ浦・白い鳥居",
    desc: "糸島のシンボル。青い海に映える白い鳥居と、仲良く並ぶ夫婦岩。砂浜を歩いて、波の音を間近で感じよう。",
    tag: "sightseeing",
    tagLabel: "Scenic",
    locationUrl: "https://maps.app.goo.gl/8JpY9uY6XWp3L7Z67",
  },
  {
    time: "12:30",
    type: "food",
    foodName: "🥗 Beach Cafe SUNSET",
    foodDesc: "糸島カフェブームの先駆け。テラス席から海を眺めながら、名物のロコモコや新鮮な糸島野菜のランチを堪能。",
    highlight: "💡 エスコート術：人気店なので、二見ヶ浦に着く前に混雑状況を確認。並ぶ場合は名前を書いてから砂浜を散策するのが吉。",
    locationUrl: "https://maps.app.goo.gl/6Dq29v2u6Xm8f5X68",
  },
  {
    time: "14:30",
    type: "food",
    foodName: "🍦 ロンドンバスカフェ",
    foodDesc: "海岸沿いに停まった赤い2階建てバス。海をバックにジェラートを。2階席からの眺めもフォトジェニック！",
    tag: "food",
    tagLabel: "Gelato",
    locationUrl: "https://maps.app.goo.gl/XyZ29v3u6Xm8f5X69",
  },
  {
    time: "16:00",
    type: "sightseeing",
    title: "🌴 ヤシの木ブランコ",
    desc: "ざうお糸島本店にある巨大なブランコ。童心に帰って、海に飛び込むような開放感を味わおう。",
    tag: "sightseeing",
    tagLabel: "Fun",
    locationUrl: "https://maps.app.goo.gl/AzZ29v4u6Xm8f5X70",
  },
  {
    time: "18:00",
    type: "transport",
    title: "🌆 福岡市内へ帰還",
    desc: "夕日に染まる海岸線を走りながら。楽しかった一日の余韻に浸りつつ、安全運転で戻りましょう。",
    tag: "transport",
    tagLabel: "Return",
  }
];

export const itoshimaTips: Tip[] = [
  {
    title: "🚗 運転のポイント",
    body: "糸島の海岸線は一本道が多く、週末は渋滞することも。時間に余裕を持って動くのが、機嫌よく過ごすコツです。",
  },
  {
    title: "📸 撮影スポット",
    body: "二見ヶ浦の鳥居は午後になると順光になり、海の色がよりきれいに写ります。スマホの広角モードを活用して！",
  },
];
