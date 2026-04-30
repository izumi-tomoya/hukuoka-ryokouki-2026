# Fukuoka Trip 2026 — AI Coding Guide
<!-- このファイルは Gemini / Claude / Codex などの AI コーディングアシスタントが参照するガイドラインです -->

## プロジェクト概要

彩 & 泉 の 1 泊 2 日・福岡旅行のモバイル最適化タイムラインアプリ。
プライベートリポジトリなので、個人情報（予約番号・サプライズ内容）が含まれる。

---

## 技術スタック

| 項目 | 内容 |
|------|------|
| フレームワーク | Next.js 16 (App Router) + React 19 + TypeScript 5 |
| スタイリング | Tailwind CSS **v4**（`@tailwindcss/postcss` 使用）|
| アニメーション | Framer Motion / tailwindcss-animate |
| 認証 | NextAuth.js v5 beta |
| DB / ORM | PostgreSQL + Prisma v7 |
| UI ライブラリ | Base UI (React) / lucide-react |
| 地図 | Leaflet / react-leaflet |
| フォーム | React Hook Form + Zod v4 |
| 状態管理 | Zustand v5 |
| パッケージマネージャ | **bun**（`bun install` / `bun add`）|

> **⚠️ Tailwind CSS v4 注意点**
> - `darkMode: "class"` は `tailwind.config.ts` に残っているが、v4 では CSS Variables が主役。
> - グラデーションは `bg-gradient-to-r` → `bg-linear-to-r` 構文へ移行済み。
> - `@apply` でカスタムクラスを使う場合は `globals.css` の `@theme` ブロックを先に確認。

---

## よく使うコマンド

```bash
bun dev          # 開発サーバー（Next.js Turbopack）
bun run build    # プロダクションビルド（prebuild で prisma generate が走る）
bun run lint     # ESLint
bun add <pkg>    # 依存追加（本番）
bun add -D <pkg> # 依存追加（開発のみ）
```

---

## ディレクトリ構造

```
src/
├── app/              # Next.js App Router（ロジックを持たない接着剤）
│   ├── api/          # Route Handlers
│   └── (protected)/  # 認証必須ページグループ
├── components/       # 汎用 UI（ドメイン知識なし）
│   ├── ui/           # プリミティブ（Button, Badge 等）
│   ├── patterns/     # 複合 UI（Modal, Carousel 等）
│   └── trip/         # 旅程 UI パーツ（DayView, EventCard 等）
├── features/         # 機能層（ドメイン知識を持つ）
│   └── trip/
│       ├── components/
│       ├── api/
│       └── types/    # trip.ts に TripEvent / Tip 等の型定義
├── data/
│   └── tripData.ts   # 旅程データのマスターファイル（直接編集可）
├── config/
│   └── constants.ts  # 全共有定数（cookie名・nav items・day設定など）
├── lib/              # 外部ライブラリ初期化
└── types/            # グローバル型定義
```

---

## コアデータ構造（`src/data/tripData.ts`）

```ts
// 旅程イベント
type TripEvent = {
  time: string;           // "HH:MM"
  type: "food" | "transport" | "sightseeing" | "hotel" | "basic";
  title: string;
  desc?: string;
  tag: string;
  tagLabel: string;
  locationUrl?: string;
  isConfirmed?: boolean;  // 予約確定フラグ（チェックボックス UI に連動）
  isYatai?: boolean;      // 屋台フラグ
  foodName?: string;
  foodDesc?: string;
  highlight?: string;
  transitSteps?: TransitStep[];
  yataiStops?: YataiStop[];
};
```

---

## 設計原則

### Server / Client Component ルール
- `features/trip/components/` 直下はすべて **Server Component（デフォルト）**
- `useState` / `useEffect` を使う場合は `components/client/` に隔離し `"use client"` を付与
- `app/` 層の `page.tsx` はロジックを持たず、`features/` のコンポーネントを配置するだけ

### Secret Mode（サプライズ機能）
- `secret_mode` という名の Cookie で管理する
- Server Component 内で `cookies()` を読み取り、サプライズイベントの内容を条件分岐する
- クライアントサイドの `localStorage` は使用しない（ハイドレーションミスマッチ防止）

### 定数管理
- URL・Cookie 名・ナビゲーション項目・Day 設定などの共有定数は **必ず `src/config/constants.ts` に集約**
- `tripData.ts` に直書きしない

### インポートルール
- バレルファイル（`index.ts`）は作成しない
- ファイルを直接インポートする
- パスエイリアス: `@/*` → `src/*`

---

## UI / デザイン標準

| 項目 | 内容 |
|------|------|
| フォント | `Playfair Display Italic`（アクセント）+ `Noto Sans JP` |
| 表示幅 | モバイルファースト、`max-w-md` 中央揃え |
| テーマカラー | `memoir-*`（`tailwind.config.ts` 参照） |
| グラスモーフィズム | `backdrop-blur-xl` + `bg-white/70` + 薄いボーダー |
| シャドウ | `shadow-2xl shadow-slate-200/50` |
| アイコン | `lucide-react` を使用 |
| アニメーション | Framer Motion / `tailwindcss-animate` |

---

## セキュリティ注意事項

- **予約番号・サプライズ内容は `.env` または Cookie で管理**。`tripData.ts` に直書きしてもよいが、Git 管理されていることを意識する
- `.env` は `.gitignore` 済みなので機密情報は `.env` で管理する
- `dangerouslySetInnerHTML` は DOMPurify でサニタイズしない限り使用禁止
- `any` 型を乱用しない

---

## よくある落とし穴

1. **Tailwind v4 クラス変更**: `bg-gradient-to-r` ではなく `bg-linear-to-r` を使う
2. **Prisma generate 忘れ**: スキーマ変更後は `bun run build` 前に `bunx prisma generate`
3. **Base UI**: `@base-ui/react` は `react-aria-components` と別物。Floating UI ベース
4. **NextAuth v5 beta**: `getServerSession()` は廃止。`auth()` を使う（`src/lib/auth.ts` 参照）
5. **Zod v4**: `z.string().nonempty()` は廃止。`z.string().min(1)` を使う

---

## 実装前のチェックリスト

- [ ] `src/config/constants.ts` に追加すべき定数はないか
- [ ] Server Component で完結できるか（`"use client"` は最小限に）
- [ ] `features/trip/types/trip.ts` の型定義と整合しているか
- [ ] Tailwind v4 の新構文に準拠しているか
- [ ] `bun run lint` でエラーが出ないか
