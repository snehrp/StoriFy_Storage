import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "100MB"
    }
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: 'img.freepik.com',
      },
      {
        protocol: "https",
        hostname: "cloud.appwrite.io"
      },
      {
        protocol: "https",
        hostname: 'e7.pngegg.com',
      }
    ]
  }
};

export default nextConfig;
