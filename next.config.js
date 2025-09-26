/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimized Next.js configuration
  reactStrictMode: true,
  
  // TypeScript ve ESLint ayarları - Geçici olarak devre dışı
  typescript: {
    ignoreBuildErrors: true, // Geçici olarak TypeScript hatalarını yoksay
  },
  eslint: {
    ignoreDuringBuilds: true, // Geçici olarak ESLint'i devre dışı bırak
  },
  
  // Images
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'jetdestek.com',
        port: '',
        pathname: '/**',
      }
    ],
    unoptimized: false, // Image optimization für lokale Entwicklung aktiviert
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // External packages
  serverExternalPackages: ['@prisma/client'],
  
  // Security configurations - CSP für lokale Entwicklung gelockert
  poweredByHeader: false,
  compress: true,
  
  // Content Security Policy - deaktiviert für lokale Entwicklung
  async headers() {
//    if (process.env.NODE_ENV === 'development') {
      return [] // Keine CSP für lokale Entwicklung
  },

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
