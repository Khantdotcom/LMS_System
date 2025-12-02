import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    // 1. Your server actions config (for ngrok)
    experimental: {
        serverActions: {
            allowedOrigins: ['unchiding-dorris-synovially.ngrok-free.dev', 'localhost:3000']
        }
    },

    // 2. Your image config (Merged here correctly)
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 't.me',
            },
            {
                protocol: 'https',
                hostname: 'img.youtube.com', // Added this to fix your specific error
            },
            {
                protocol: 'https',
                hostname: 'i.ytimg.com', // Good to have for other YouTube thumbnail formats
            },
        ],
    },
};

export default nextConfig;