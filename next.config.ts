import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com/**",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com/**",
      },
    ],
  },
};

export default nextConfig;
