import { day1Events, day2Events, packingList } from "@/data/tripData";
import type { TripEvent } from "../types/trip";
import { getTripBySlug } from "./tripActions";

/**
 * イベントのタイトルや料理名からスラグを生成します
 */
export function generateEventSlug(event: TripEvent): string {
  // 1. 明示的なスラグがある場合はそれを使用
  if (event.slug) return event.slug;

  // 2. ID がある場合はそれを使用（データベースのイベントなど）
  if (event.id) return event.id;

  // 3. フォールバック: タイトルから生成（日本語が含まれる可能性があるが、上記2つが基本使われる）
  const base = event.foodName || event.title || "unnamed";
  return base
    .toLowerCase()
    .trim()
    .replace(/[^\w\sぁ-んァ-ン一-龠-]/g, "") // 特殊文字を削除
    .replace(/\s+/g, "-"); // スペースをハイフンに
}

/**
 * スラグから特定のイベントを取得します
 */
export async function getEventBySlug(spotId: string, tripSlug?: string): Promise<TripEvent | undefined> {
  const decodedSpotId = decodeURIComponent(spotId);

  // tripSlug がある場合はデータベースから取得を試みる
  if (tripSlug) {
    const trip = await getTripBySlug(tripSlug);
    if (trip) {
      const allEvents = trip.days.flatMap((d) => d.events);
      const found = allEvents.find((e) => generateEventSlug(e as unknown as TripEvent) === decodedSpotId);
      if (found) return found as unknown as TripEvent;
    }
  }

  // フォールバック: 静的データから検索
  const allEvents = [...day1Events, ...day2Events];
  return allEvents.find((e) => generateEventSlug(e) === decodedSpotId);
}

/**
 * カテゴリ（type または tag）に一致するイベントを取得します
 */
export async function getEventsByCategory(category: string, tripSlug?: string): Promise<TripEvent[]> {
  // tripSlug がある場合はデータベースから取得を試みる
  if (tripSlug) {
    const trip = await getTripBySlug(tripSlug);
    if (trip) {
      const allEvents = trip.days.flatMap((d) => d.events) as unknown as TripEvent[];
      return allEvents.filter(
        (e) => e.type === category || e.tag === category || e.tagLabel?.toLowerCase() === category.toLowerCase(),
      );
    }
  }

  // フォールバック: 静的データから検索
  const allEvents = [...day1Events, ...day2Events];
  return allEvents.filter(
    (e) => e.type === category || e.tag === category || e.tagLabel?.toLowerCase() === category.toLowerCase(),
  );
}

/**
 * カテゴリに一致するパッキングリスト（持ち物）を取得します
 */
export async function getPackingListByCategory(category: string, tripSlug?: string) {
  // tripSlug がある場合はデータベースから取得を試みる
  if (tripSlug) {
    const trip = await getTripBySlug(tripSlug);
    if (trip) {
      return trip.packingItems.filter((item) => item.category.toLowerCase() === category.toLowerCase());
    }
  }

  // フォールバック: 静的データから検索
  return packingList.filter((item) => item.category.toLowerCase() === category.toLowerCase());
}

/**
 * パッキングリストのカテゴリ一覧を取得します
 */
export async function getPackingCategories(): Promise<string[]> {
  const categories = packingList.map((item) => item.category);
  return Array.from(new Set(categories));
}
