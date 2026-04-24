import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns'],
    // 既知の型定義に存在しないプロパティを回避するため、
    // NextConfig に準拠した構造を保ちつつ設定を適用します
    turbo: {
      resolveExtensions: ['.mdx', '.tsx', '.ts', '.jsx', '.js', '.mjs', '.json'],
    },
  } as NextConfig['experimental'],
};

export default nextConfig;
