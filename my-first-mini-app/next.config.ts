import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: ['static.usernames.app-backend.toolsforhumanity.com'],
  },
  allowedDevOrigins: [
    'localhost:3002',
    'pulverulently-lilah-touristically.ngrok-free.dev',
    '*.ngrok-free.dev', // Allow any ngrok subdomain
  ],
  reactStrictMode: false,
};

export default nextConfig;
