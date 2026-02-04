import type { NextConfig } from "next";

const NEXT_PUBLIC_BACKEND = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${NEXT_PUBLIC_BACKEND}/:path*`,
      },
    ];
  },
};

export default nextConfig;
