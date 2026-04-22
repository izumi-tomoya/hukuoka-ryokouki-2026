export const SECRET_MODE_COOKIE_NAME = "secret_mode";

export const NAV_ITEMS = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/day/1", label: "Day 1", icon: "📅" },
  { href: "/day/2", label: "Day 2", icon: "📅" },
  { href: "/tips", label: "Tips", icon: "🧭" },
] as const;

export const DAY_CONFIG = {
  1: {
    label: "DAY 1 — 2026.5.24 (日)",
    title: "⛩️ 太宰府 → 博多グルメ → 屋台ハシゴ！",
    highlight:
      "千年の歴史が息づく太宰府を参拝し、博多グルメを満喫！夜は中洲の屋台街でシメのラーメンまで、博多の魅力をぎゅっと詰め込んだ最高の一日🔥",
  },
  2: {
    label: "DAY 2 — 2026.5.25 (月)",
    title: "🍲 水炊きランチ → 大濠公園 → サプライズ✨",
    highlight:
      "100年の老舗で本格水炊きランチ、大濠公園でのんびりお散歩、そして彼氏からのとっておきサプライズへ…！最後は福岡のソウルフードで締めくくり🍜",
  },
} as const;

export const TRIP_STATS = {
  BUDGET: "¥45,000~",
  WEATHER: "24°C ☀️",
  LOCATION: "FUK",
} as const;
