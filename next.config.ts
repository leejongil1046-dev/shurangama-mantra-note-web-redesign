import type { NextConfig } from "next";

// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          // CSP는 서비스에 맞게 조정 필요
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; img-src 'self' https: data:; media-src 'self' https:; frame-src https://www.youtube.com https://www.youtube-nocookie.com; script-src 'self' 'unsafe-inline' https://www.youtube.com https://www.youtube-nocookie.com; style-src 'self' 'unsafe-inline';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
