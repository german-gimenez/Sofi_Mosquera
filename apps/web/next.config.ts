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
  async redirects() {
    return [
      {
        source: "/cuadros",
        destination: "/arte",
        permanent: true,
      },
      {
        source: "/sobre",
        destination: "/studio",
        permanent: true,
      },
      {
        source: "/asesoria",
        destination: "/studio#proceso",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
