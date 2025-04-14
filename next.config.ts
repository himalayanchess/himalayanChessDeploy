import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Proper serverActions configuration
    serverActions: {
      bodySizeLimit: "2mb", // or whatever size limit you need
      allowedOrigins: [], // specify allowed origins if needed
    },

    // If you need mongoose in server components (Next.js 14+)
    serverComponentsExternalPackages: ["mongoose"],
  },

  webpack: (config, { isServer }) => {
    // Only add mongoose as external on client side
    if (!isServer) {
      config.externals.push({
        mongoose: "mongoose",
      });
    }

    return config;
  },
};

export default nextConfig;
