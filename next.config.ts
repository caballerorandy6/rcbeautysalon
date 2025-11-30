import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true, // Enable React Compiler for automatic memoization
  images: {
    unoptimized: true, // Disable automatic image optimization
    qualities: [75, 90], // Configure allowed image qualities
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
