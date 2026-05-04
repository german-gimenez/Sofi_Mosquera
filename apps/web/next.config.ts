import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

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
        destination: "/es/arte",
        permanent: true,
      },
      {
        source: "/sobre",
        destination: "/es/estudio",
        permanent: true,
      },
      {
        source: "/asesoria",
        destination: "/es/estudio",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
