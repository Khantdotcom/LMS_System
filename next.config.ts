import type { NextConfig } from "next";

const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ['unchiding-dorris-synovially.ngrok-free.dev', 'localhost:3000']
    }
  }
};

module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 't.me', // Allow this domain
      },
    ],
  },
}
export default nextConfig;
