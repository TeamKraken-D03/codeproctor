// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"],
  }, eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
