/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true
  },
  env: {
    API_URL: process.env.API_URL,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL
  }
};

module.exports = nextConfig;
