import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // 禁用 COOP header 以支持 WalletConnect
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin-allow-popups",
          },
        ],
      },
    ];
  },
  // Turbopack 配置
  experimental: {
    turbo: {
      root: ".",
    },
  },
};

export default nextConfig;
