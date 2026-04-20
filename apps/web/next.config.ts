import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@sofi/ui", "@sofi/db", "@sofi/tokens"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.public.blob.vercel-storage.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/interiorismo",
        destination: "/proyectos",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
