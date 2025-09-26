import type { NextConfig } from 'next'

// Next.js Configuration für Namecheap Stellar Business Hosting
const nextConfig: NextConfig = {
  // Output configuration für statische Generierung
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true, // Namecheap unterstützt keine Next.js Image Optimization
  },
  
  // Disable server-side features for static export
  experimental: {
    esmExternals: false,
  },
  
  // Security configurations
  poweredByHeader: false,
  compress: true,
  
  // Static file serving
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  
  // Security headers (werden in .htaccess implementiert)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
          },
        ],
      },
    ]
  },

  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Redirects für SEO
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

  // Webpack configuration für Namecheap
  webpack: (config, { isServer }) => {
    // Optimierungen für Namecheap Hosting
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }

    // Memory optimizations
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: -10,
            chunks: 'all',
          },
        },
      },
    }

    return config
  },
}

export default nextConfig
