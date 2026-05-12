import type { PrismaClient } from "@prisma/client";
import { type DeepMockProxy, mockDeep, mockReset } from "jest-mock-extended";

// Prisma Client の深いモックを作成
export const mockPrisma = mockDeep<PrismaClient>();

// テストごとにモックの状態をリセット
beforeEach(() => {
  mockReset(mockPrisma);
});

export type PrismaMock = DeepMockProxy<PrismaClient>;
