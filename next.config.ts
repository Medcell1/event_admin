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
};

export default nextConfig;
//REMOVE ALLOW ALL DOMAINS