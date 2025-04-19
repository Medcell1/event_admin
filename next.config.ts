/** @type {import('next').NextConfig} */
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allows all domains
      },
    ],
  },
  experimental: {
    serverActions: {
      allowedOrigins: [
        'localhost:3000',
        'ztt8cpnq-3000.euw.devtunnels.ms',
        '.devtunnels.ms' // Wildcard for all dev tunnel subdomains
      ],
    },
  },
};

export default nextConfig;