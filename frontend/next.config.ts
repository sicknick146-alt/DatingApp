import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  output: "standalone",
  webpack: (config) => {
    // Add memory limits for Next.js webpack
    config.optimization = {
      ...config.optimization,
      minimize: false,
    };
    return config;
  },
};

export default nextConfig;
