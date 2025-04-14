import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // experimental: {
  //   // serverComponentsExternalPackages: ["mongoose"],
  // },
  // If using Next.js 14+, add this:
  webpack: (config: any) => {
    config.externals.push({
      mongoose: "mongoose",
    });
    return config;
  },
};

export default nextConfig;
