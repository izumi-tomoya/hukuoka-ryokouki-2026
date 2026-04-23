export const SECRET_MODE_COOKIE_NAME = "secret_mode";

export const DAY_CONFIG: Record<number, { title: string; label: string; highlight: string }> = {
  1: { title: "博多、彩りの追憶", label: "DAY 1", highlight: "都会の洗練と伝統が交差する街。最高のスタートを。" },
  2: { title: "海風と、語り継がれる風景", label: "DAY 2", highlight: "海風を感じながら、心に刻まれる穏やかな時間を。" },
};

export const ESSENTIALS_BY_REGION: Record<string, { title: string; items: string[] }> = {
  "Fukuoka": {
    title: "福岡・博多旅の準備",
    items: [
      "交通系ICカード（nimoca/SUGOCA等）: 福岡の地下鉄やバスは非常に便利です。",
      "地下鉄1日乗車券: 空港や博多・天神を巡るなら必須。",
      "モバイルバッテリー: 食べ歩きや写真撮影で電池を消耗します。",
      "少し良いハンカチ: 屋台などはタオルが必要な場合も。"
    ]
  },
  "Itoshima": {
    title: "糸島ドライブの準備",
    items: [
      "運転免許証: レンタカーを借りる場合は忘れずに。",
      "サングラス: 糸島の海岸線は日差しが強いです。",
      "歩きやすい靴: 砂浜を歩くスポットが多いです。",
      "現金: 小規模なカフェでは現金のみの場所も多いです。"
    ]
  }
};
