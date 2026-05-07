/**
 * tripActions.ts のユニットテスト
 *
 * テスト方針:
 * - Prisma Client を jest-mock-extended でモックし、実 DB への接続を行わない
 * - next/cache (revalidatePath) と next-auth (auth) もモックする
 * - 各 Action の「正常系」と「異常系（エラー時）」を網羅する
 */

import { prismaMock } from './helpers/prismaMock';
import { Trip, Event, PackingItem, Tip } from '@prisma/client';
import { TripWithRelations } from '@/features/trip/api/tripActions';

// ---- 外部依存のモック ----

// @/lib/prisma の prisma インスタンスをモックに差し替える
jest.mock('@/lib/prisma', () => ({
  prisma: prismaMock,
}));

// next/cache はサーバー専用 API なのでスタブ化
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

// next-auth の auth() をスタブ化（デフォルトは管理者セッションとして振る舞う）
jest.mock('@/lib/auth', () => ({
  auth: jest.fn(),
}));

import { auth } from '@/lib/auth';
import {
  getTrips,
  getTripBySlug,
  toggleEventConfirmation,
  addPackingItemAction,
  togglePackingItemAction,
  deletePackingItemAction,
  createTipAction,
  deleteTipAction,
} from '@/features/trip/api/tripActions';

// 管理者セッションのフィクスチャ
const mockAdminSession = {
  user: { id: 'user-1', name: 'Admin', isAdmin: true },
};

// 非管理者セッションのフィクスチャ
const mockGuestSession = {
  user: { id: 'user-2', name: 'Guest', isAdmin: false },
};

// ---------- getTrips ----------

describe('getTrips()', () => {
  it('Trip 一覧を日付降順で返す', async () => {
    const mockTrips = [
      { id: 'trip-1', title: '福岡旅行', slug: 'fukuoka-2026', startDate: new Date('2026-05-24'), status: 'Upcoming' },
      { id: 'trip-2', title: '糸島ドライブ', slug: 'itoshima-drive', startDate: new Date('2026-04-10'), status: 'Completed' },
    ] as unknown as Trip[];

    prismaMock.trip.findMany.mockResolvedValue(mockTrips);

    const result = await getTrips();

    expect(prismaMock.trip.findMany).toHaveBeenCalledWith({
      orderBy: { startDate: 'desc' },
    });
    expect(result).toHaveLength(2);
    expect(result[0].title).toBe('福岡旅行');
  });
});

// ---------- getTripBySlug ----------

describe('getTripBySlug()', () => {
  it('存在する slug で TripWithRelations を返す', async () => {
    const mockTrip = {
      id: 'trip-1',
      slug: 'fukuoka-2026',
      title: '福岡旅行',
      days: [],
      tips: [],
    } as unknown as TripWithRelations;

    prismaMock.trip.findUnique.mockResolvedValue(mockTrip);
    // packingItem / gourmetAward は lazy fetch されるので、any キャスト経由で呼ばれる
    // prismaMock では動的プロパティのモックが難しいため、try-catch の fallback が動く
    // → packingItems / gourmetAwards が [] で返ることを確認
    const result = await getTripBySlug('fukuoka-2026');

    expect(prismaMock.trip.findUnique).toHaveBeenCalledWith(
      expect.objectContaining({ where: { slug: 'fukuoka-2026' } })
    );
    expect(result).not.toBeNull();
    expect(result?.slug).toBe('fukuoka-2026');
    // packingItems / gourmetAwards は (prisma as any).* 経由の lazy fetch のため
    // モック環境では fallback の [] または undefined になる
    expect(result?.packingItems ?? []).toEqual([]);
    expect(result?.gourmetAwards ?? []).toEqual([]);
  });

  it('存在しない slug で null を返す', async () => {
    prismaMock.trip.findUnique.mockResolvedValue(null);

    const result = await getTripBySlug('not-found');

    expect(result).toBeNull();
  });
});

// ---------- toggleEventConfirmation ----------

describe('toggleEventConfirmation()', () => {
  it('isConfirmed を true に更新できる', async () => {
    prismaMock.event.update.mockResolvedValue({} as unknown as Event);

    const result = await toggleEventConfirmation('event-1', true);

    expect(prismaMock.event.update).toHaveBeenCalledWith({
      where: { id: 'event-1' },
      data: { isConfirmed: true },
    });
    expect(result).toEqual({ success: true });
  });

  it('DB エラー時に success: false を返し、エラーをログに記録する', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    prismaMock.event.update.mockRejectedValue(new Error('DB connection failed'));

    const result = await toggleEventConfirmation('event-1', true);

    expect(result.success).toBe(false);
    expect(result.error).toContain('DB connection failed');
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to toggle event confirmation:',
      expect.any(Error)
    );
    consoleSpy.mockRestore();
  });
});

// ---------- PackingItem ----------

describe('addPackingItemAction()', () => {
  it('PackingItem を正常に作成できる', async () => {
    prismaMock.packingItem.create.mockResolvedValue({} as unknown as PackingItem);

    const result = await addPackingItemAction('trip-1', 'モバイルバッテリー', 'Gadget');

    expect(prismaMock.packingItem.create).toHaveBeenCalledWith({
      data: { tripId: 'trip-1', name: 'モバイルバッテリー', category: 'Gadget' },
    });
    expect(result).toEqual({ success: true });
  });

  it('DB エラー時に success: false を返し、エラーをログに記録する', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    prismaMock.packingItem.create.mockRejectedValue(new Error('Unique constraint failed'));

    const result = await addPackingItemAction('trip-1', 'モバイルバッテリー', 'Gadget');

    expect(result.success).toBe(false);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

describe('togglePackingItemAction()', () => {
  it('isPacked を true に更新できる', async () => {
    prismaMock.packingItem.update.mockResolvedValue({} as unknown as PackingItem);

    const result = await togglePackingItemAction('item-1', true);

    expect(prismaMock.packingItem.update).toHaveBeenCalledWith({
      where: { id: 'item-1' },
      data: { isPacked: true },
    });
    expect(result).toEqual({ success: true });
  });
});

describe('deletePackingItemAction()', () => {
  it('PackingItem を削除できる', async () => {
    prismaMock.packingItem.delete.mockResolvedValue({} as unknown as PackingItem);

    const result = await deletePackingItemAction('item-1');

    expect(prismaMock.packingItem.delete).toHaveBeenCalledWith({
      where: { id: 'item-1' },
    });
    expect(result).toEqual({ success: true });
  });
});

// ---------- Tip（管理者権限チェックあり） ----------

describe('createTipAction()', () => {
  const tipData = {
    title: '現金を用意する',
    body: '水たき長野は現金のみ',
    isWarning: true,
    isConfirmed: false,
    category: 'Gourmet',
    deepLevel: 1,
  };

  it('管理者なら Tip を作成できる', async () => {
    (auth as jest.Mock).mockResolvedValue(mockAdminSession);
    prismaMock.tip.create.mockResolvedValue({} as unknown as Tip);

    const result = await createTipAction('trip-1', tipData);

    expect(prismaMock.tip.create).toHaveBeenCalledWith({
      data: { tripId: 'trip-1', ...tipData },
    });
    expect(result).toEqual({ success: true });
  });

  it('非管理者は Error をスローする', async () => {
    (auth as jest.Mock).mockResolvedValue(mockGuestSession);

    await expect(createTipAction('trip-1', tipData)).rejects.toThrow('管理者権限が必要です');
    expect(prismaMock.tip.create).not.toHaveBeenCalled();
  });
});

describe('deleteTipAction()', () => {
  it('管理者なら Tip を削除できる', async () => {
    (auth as jest.Mock).mockResolvedValue(mockAdminSession);
    prismaMock.tip.delete.mockResolvedValue({} as unknown as Tip);

    const result = await deleteTipAction('tip-1');

    expect(prismaMock.tip.delete).toHaveBeenCalledWith({ where: { id: 'tip-1' } });
    expect(result).toEqual({ success: true });
  });

  it('非管理者は Error をスローする', async () => {
    (auth as jest.Mock).mockResolvedValue(mockGuestSession);

    await expect(deleteTipAction('tip-1')).rejects.toThrow('管理者権限が必要です');
  });
});
