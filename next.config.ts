import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    turbopack: {
      root: ".",
    },
  },
  allowedDevOrigins: ['tizumi.local'],
};

export default nextConfig;
