import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sway-public-use2.s3.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'sway.quest',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
