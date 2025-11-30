import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://mealsandfit.onrender.com/api/:path*",
      },
    ];
  },

  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "mealsandfit.onrender.com",
        port: "10000",
        pathname: "/storage/**",
      },
      {
        protocol: "http",
        hostname: "mealsandfit.onrender.com",
        port: "10000",
        pathname: "/storage/**",
      },
      // Prod (si aplica)
      // {
      //   protocol: "https",
      //   hostname: "cdn.tu-dominio.com",
      //   pathname: "/**",
      // },
      // {
      //   protocol: "https",
      //   hostname: "api.tu-dominio.com",
      //   pathname: "/storage/**",
      // },
    ],
  },
};

export default nextConfig;
