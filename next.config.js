/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    ppr: false // Désactiver PPR pour éviter les problèmes de routing
  },
  env: {
    CUSTOM_KEY: 'autobooker-saas',
  },
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  // Configuration pour production optimisée
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  },
  // Headers de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  }
}

module.exports = nextConfig