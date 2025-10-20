/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["via.placeholder.com", "luke-stat-forming-kinase.trycloudflare.com"], // Add domains for external images
    // Also allow remote patterns (useful if hostnames or paths vary)
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
    ],
  },
};

module.exports = nextConfig;