import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@sofi/ui", "@sofi/db", "@sofi/tokens"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
};

export default nextConfig;
