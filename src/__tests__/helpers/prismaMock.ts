import { PrismaClient } from '@prisma/client';
import { mockDeep, mockReset, DeepMockProxy } from 'jest-mock-extended';

// Prisma Client の深いモックを作成
export const prismaMock = mockDeep<PrismaClient>();

// テストごとにモックの状態をリセット
beforeEach(() => {
  mockReset(prismaMock);
});

export type PrismaMock = DeepMockProxy<PrismaClient>;
