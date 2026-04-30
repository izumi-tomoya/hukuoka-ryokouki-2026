import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: './tsconfig.test.json' }],
  },
  // @/* → src/* のパスエイリアスを解決する
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // テスト対象ファイルのパターン
  testMatch: ['**/__tests__/**/*.test.ts'],
  // テスト実行前にモジュールをリセット
  clearMocks: true,
  resetMocks: true,
};

export default config;
