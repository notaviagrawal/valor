import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'static.usernames.app-backend.toolsforhumanity.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  allowedDevOrigins: ['pulverulently-lilah-touristically.ngrok-free.dev'],
  reactStrictMode: false,
};

export default nextConfig;
