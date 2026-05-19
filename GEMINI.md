# Fukuoka Trip 2026 — AI Coding Guide

<!-- このファイルは Gemini / Claude / Codex などの AI コーディングアシスタントが参照するガイドラインです -->

> [!IMPORTANT]
> **This is NOT the Next.js/Tailwind you know.**
> このプロジェクトは Next.js 16 (App Router) と Tailwind CSS v4 を使用しており、AI の学習データとは多くの API や構文が異なります。実装前に必ず `node_modules/next/dist/docs/` や公式ドキュメントを参照してください。

---

## 🚀 CRITICAL RULES (最優先ルール)

1.  **Tailwind CSS v4 準拠**:
    - `bg-gradient-to-r` は廃止。必ず **`bg-linear-to-r`** を使用すること。
    - `darkMode: "class"` ではなく、CSS Variables ベースのテーマ管理を優先する。
    - `globals.css` の `@theme` ブロックを必ず確認し、定義済みの `memoir-*` カラーを使用すること。
2.  **Next.js 16 (App Router) & React 19**:
    - `"use client"` は必要最小限（Interactivity が必要な場合のみ）に留める。
    - `features/trip/components/` 直下はデフォルトで **Server Component** とする。
3.  **Secret Mode (サプライズ機能)**:
    - `secret_mode` Cookie で制御する。`cookies()` を使って Server Side で分岐し、ハイドレーションエラーを防ぐ。
4.  **定数・型定義の徹底**:
    - 共有定数は `src/config/constants.ts` に集約。直書き禁止。
    - 旅程データは `src/data/tripData.ts` を正（Source of Truth）とする。

---

## 🛠 技術スタック

| 項目                | 内容                                              |
| :------------------ | :------------------------------------------------ |
| **Framework**       | Next.js 16 (App Router) + React 19 + TypeScript 5 |
| **Styling**         | Tailwind CSS **v4** (@tailwindcss/postcss)        |
| **Animation**       | Framer Motion / tailwindcss-animate               |
| **Auth**            | NextAuth.js v5 beta (`auth()` を使用)             |
| **Database**        | PostgreSQL + Prisma v7                            |
| **UI Library**      | Base UI (React) / lucide-react                    |
| **Package Manager** | **bun** (`bun install` / `bun add`)               |

---

## 📁 ディレクトリ構造 (Feature-Driven Architecture)

```text
src/
├── app/              # Routing (ロジックを持たない接着剤)
├── components/       # 汎用 UI (ドメイン知識なし)
│   ├── ui/           # プリミティブ (Button, Badge 等)
│   ├── patterns/     # 複合 UI (Modal, Carousel 等)
│   └── trip/         # 旅程 UI パーツ (DayView, EventCard 等)
├── features/         # 機能層 (ドメイン知識を持つ)
│   └── trip/         # 旅程管理 (components, api, types)
├── data/             # tripData.ts (旅程マスターデータ)
├── config/           # constants.ts (共有定数)
└── lib/              # Library Config (auth.ts, prisma.ts)
```

---

## 🧩 コアデータ構造 (`TripEvent`)

```ts
type TripEvent = {
  time: string; // "HH:MM"
  type: "food" | "transport" | "sightseeing" | "hotel" | "basic";
  title: string;
  isConfirmed?: boolean; // 予約確定フラグ
  isYatai?: boolean; // 屋台フラグ
  locationUrl?: string; // Google Maps URL
  // ...詳細は features/trip/types/trip.ts を参照
};
```

---

## 🎨 デザイン標準

- **Font**: `Playfair Display Italic` (アクセント) + `Noto Sans JP`
- **Layout**: モバイルファースト (`max-w-md` 中央揃え)
- **Aesthetics**: グラスモーフィズム (`backdrop-blur-xl` + `bg-white/70`)
- **Shadow**: `shadow-2xl shadow-slate-200/50`

---

## ✅ 実装前チェックリスト

- [ ] `src/config/constants.ts` に定数を追加したか？
- [ ] Server Component で完結できないか再考したか？
- [ ] Tailwind v4 の新構文（`bg-linear-*` 等）を使っているか？
- [ ] `bun run lint` で警告が出ていないか？
