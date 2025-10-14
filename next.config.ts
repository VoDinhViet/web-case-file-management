import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    authInterrupts: true, // 👈 Bật experimental feature
  },
};

export default nextConfig;
