import { day1Events, day2Events, packingList } from "@/data/tripData";
import type { TripEvent } from "../types/trip";

/**
 * イベントのタイトルや料理名からスラグを生成します
 */
export function generateEventSlug(event: TripEvent): string {
  const base = event.foodName || event.title || "unnamed";
  return base
    .toLowerCase()
    .replace(/[^\w\sぁ-んァ-ン一-龠-]/g, "") // 特殊文字を削除
    .replace(/\s+/g, "-"); // スペースをハイフンに
}

/**
 * スラグから特定のイベントを取得します
 */
export async function getEventBySlug(slug: string): Promise<TripEvent | undefined> {
  const allEvents = [...day1Events, ...day2Events];
  return allEvents.find((e) => generateEventSlug(e) === slug);
}

/**
 * カテゴリ（type または tag）に一致するイベントを取得します
 */
export async function getEventsByCategory(category: string): Promise<TripEvent[]> {
  const allEvents = [...day1Events, ...day2Events];
  return allEvents.filter(
    (e) => e.type === category || e.tag === category || e.tagLabel?.toLowerCase() === category.toLowerCase(),
  );
}

/**
 * カテゴリに一致するパッキングリスト（持ち物）を取得します
 */
export async function getPackingListByCategory(category: string) {
  return packingList.filter((item) => item.category.toLowerCase() === category.toLowerCase());
}

/**
 * パッキングリストのカテゴリ一覧を取得します
 */
export async function getPackingCategories(): Promise<string[]> {
  const categories = packingList.map((item) => item.category);
  return Array.from(new Set(categories));
}
