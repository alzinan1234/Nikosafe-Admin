/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "via.placeholder.com", 
      "luke-stat-forming-kinase.trycloudflare.com",
      "weekly-ontario-picked-qualified.trycloudflare.com" // Added new domain
    ],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'luke-stat-forming-kinase.trycloudflare.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'luke-stat-forming-kinase.trycloudflare.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'weekly-ontario-picked-qualified.trycloudflare.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'weekly-ontario-picked-qualified.trycloudflare.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;