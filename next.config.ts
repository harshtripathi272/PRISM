import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize production builds
  output: 'standalone',
  
  // Compress responses
  compress: true,
  
  // Optimize images
  images: {
    formats: ['image/webp'],
    minimumCacheTTL: 31536000, // 1 year cache
  },
  
  // Headers for better caching
  async headers() {
    return [
      {
        source: '/sequence-webp/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
