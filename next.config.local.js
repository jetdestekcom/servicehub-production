/** @type {import('next').NextConfig} */
const nextConfig = {
  // Normale Next.js Konfiguration für lokale Entwicklung
  reactStrictMode: true,
  swcMinify: true,
  
  // Images
  images: {
    domains: ['localhost'],
    unoptimized: false, // Image optimization für lokale Entwicklung aktiviert
  },
  
  // Experimental features
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  
  // Security configurations
  poweredByHeader: false,
  compress: true,
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Redirects
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: false,
      },
      {
        source: '/login',
        destination: '/auth/signin',
        permanent: true,
      },
      {
        source: '/register',
        destination: '/auth/signup',
        permanent: true,
      },
    ]
  },

  // Rewrites für API routes
  async rewrites() {
    return [
      {
        source: '/api/health',
        destination: '/api/health/check',
      },
    ]
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }

    return config
  },
}

module.exports = nextConfig
