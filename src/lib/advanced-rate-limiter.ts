// Advanced Rate Limiter - Military Grade Security
import { NextRequest } from 'next/server'
// import { rateLimiter } from './redis-client' // Deaktiviert für lokale Entwicklung

export interface RateLimitConfig {
  windowMs: number
  maxRequests: number
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
  keyGenerator?: (req: NextRequest) => string
  onLimitReached?: (req: NextRequest) => void
}

export class AdvancedRateLimiter {
  private static instance: AdvancedRateLimiter
  private configs: Map<string, RateLimitConfig> = new Map()

  static getInstance(): AdvancedRateLimiter {
    if (!AdvancedRateLimiter.instance) {
      AdvancedRateLimiter.instance = new AdvancedRateLimiter()
    }
    return AdvancedRateLimiter.instance
  }

  // Register rate limit configuration for specific routes
  registerRoute(route: string, config: RateLimitConfig): void {
    this.configs.set(route, config)
  }

  // Check rate limit for specific request
  async checkRateLimit(req: NextRequest): Promise<{
    allowed: boolean
    remaining: number
    resetTime: number
    retryAfter?: number
  }> {
    const pathname = req.nextUrl.pathname
    const config = this.getConfigForRoute(pathname)
    
    if (!config) {
      return { allowed: true, remaining: Infinity, resetTime: Date.now() }
    }

    const key = config.keyGenerator ? config.keyGenerator(req) : this.defaultKeyGenerator(req)
    
    // Für lokale Entwicklung: immer erlauben
    if (process.env.NODE_ENV === 'development') {
      return {
        allowed: true,
        remaining: config.maxRequests,
        resetTime: Date.now() + config.windowMs,
        retryAfter: undefined
      }
    }
    
    // Für Production: Redis verwenden
    const { rateLimiter } = await import('./redis-client')
    const result = await rateLimiter.checkRateLimit(
      key,
      config.maxRequests,
      config.windowMs
    )

    if (!result.allowed && config.onLimitReached) {
      config.onLimitReached(req)
    }

    return {
      allowed: result.allowed,
      remaining: result.remaining,
      resetTime: result.resetTime,
      retryAfter: result.allowed ? undefined : Math.ceil((result.resetTime - Date.now()) / 1000)
    }
  }

  private getConfigForRoute(pathname: string): RateLimitConfig | undefined {
    // Exact match first
    if (this.configs.has(pathname)) {
      return this.configs.get(pathname)
    }

    // Pattern matching for dynamic routes
    for (const [route, config] of this.configs.entries()) {
      if (this.matchesRoute(pathname, route)) {
        return config
      }
    }

    return undefined
  }

  private matchesRoute(pathname: string, pattern: string): boolean {
    // Convert Next.js dynamic route pattern to regex
    const regexPattern = pattern
      .replace(/\[([^\]]+)\]/g, '([^/]+)') // [id] -> ([^/]+)
      .replace(/\*\*/g, '.*') // ** -> .*
      .replace(/\*/g, '[^/]*') // * -> [^/]*
    
    const regex = new RegExp(`^${regexPattern}$`)
    return regex.test(pathname)
  }

  private defaultKeyGenerator(req: NextRequest): string {
    const ip = this.getClientIP(req)
    const userAgent = req.headers.get('user-agent') || 'unknown'
    const pathname = req.nextUrl.pathname
    
    // Create composite key for better rate limiting
    return `rate_limit:${pathname}:${ip}:${this.hashUserAgent(userAgent)}`
  }

  private getClientIP(req: NextRequest): string {
    const forwarded = req.headers.get('x-forwarded-for')
    const realIP = req.headers.get('x-real-ip')
    const cfConnectingIP = req.headers.get('cf-connecting-ip')
    
    if (cfConnectingIP) return cfConnectingIP
    if (realIP) return realIP
    if (forwarded) return forwarded.split(',')[0].trim()
    
    return req.ip || '127.0.0.1'
  }

  private hashUserAgent(userAgent: string): string {
    // Simple hash for user agent (not cryptographic)
    let hash = 0
    for (let i = 0; i < userAgent.length; i++) {
      const char = userAgent.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36)
  }
}

// Predefined rate limit configurations
export const RATE_LIMIT_CONFIGS = {
  // Authentication endpoints - strict limits
  AUTH: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 attempts per 15 minutes
    keyGenerator: (req: NextRequest) => {
      const ip = req.ip || '127.0.0.1'
      const email = req.nextUrl.searchParams.get('email') || 'unknown'
      return `auth:${ip}:${email}`
    }
  },
  
  // Registration - very strict
  REGISTRATION: {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3, // 3 registrations per hour
    keyGenerator: (req: NextRequest) => {
      const ip = req.ip || '127.0.0.1'
      return `registration:${ip}`
    }
  },
  
  // API endpoints - moderate limits
  API: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute
    keyGenerator: (req: NextRequest) => {
      const ip = req.ip || '127.0.0.1'
      const pathname = req.nextUrl.pathname
      return `api:${pathname}:${ip}`
    }
  },
  
  // Search endpoints - higher limits
  SEARCH: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 50, // 50 searches per minute
    keyGenerator: (req: NextRequest) => {
      const ip = req.ip || '127.0.0.1'
      return `search:${ip}`
    }
  },
  
  // File upload - strict limits
  UPLOAD: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 10, // 10 uploads per minute
    keyGenerator: (req: NextRequest) => {
      const ip = req.ip || '127.0.0.1'
      return `upload:${ip}`
    }
  },
  
  // Admin endpoints - very strict
  ADMIN: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 20, // 20 admin requests per minute
    keyGenerator: (req: NextRequest) => {
      const ip = req.ip || '127.0.0.1'
      return `admin:${ip}`
    }
  }
}

// Initialize rate limiter with configurations
export function initializeRateLimiter(): AdvancedRateLimiter {
  const limiter = AdvancedRateLimiter.getInstance()
  
  // Register route-specific configurations
  limiter.registerRoute('/api/auth/signin', RATE_LIMIT_CONFIGS.AUTH)
  limiter.registerRoute('/api/auth/signup', RATE_LIMIT_CONFIGS.REGISTRATION)
  limiter.registerRoute('/api/auth/register', RATE_LIMIT_CONFIGS.REGISTRATION)
  limiter.registerRoute('/api/services', RATE_LIMIT_CONFIGS.API)
  limiter.registerRoute('/api/services/search', RATE_LIMIT_CONFIGS.SEARCH)
  limiter.registerRoute('/api/services/smart-search', RATE_LIMIT_CONFIGS.SEARCH)
  limiter.registerRoute('/api/upload', RATE_LIMIT_CONFIGS.UPLOAD)
  limiter.registerRoute('/api/admin', RATE_LIMIT_CONFIGS.ADMIN)
  
  return limiter
}

// Middleware function for rate limiting
export async function withRateLimit(req: NextRequest): Promise<{
  allowed: boolean
  response?: Response
}> {
  const limiter = AdvancedRateLimiter.getInstance()
  const result = await limiter.checkRateLimit(req)
  
  if (!result.allowed) {
    const response = new Response(
      JSON.stringify({
        error: 'Rate limit exceeded',
        retryAfter: result.retryAfter,
        message: 'Too many requests. Please try again later.'
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': result.retryAfter?.toString() || '60',
          'X-RateLimit-Limit': '100',
          'X-RateLimit-Remaining': result.remaining.toString(),
          'X-RateLimit-Reset': new Date(result.resetTime).toISOString()
        }
      }
    )
    
    return { allowed: false, response }
  }
  
  return { allowed: true }
}

// Security event logging for rate limit violations
export function logRateLimitViolation(req: NextRequest, details: any): void {
  const securityEvent = {
    type: 'RATE_LIMIT_VIOLATION',
    timestamp: new Date().toISOString(),
    ip: req.ip || 'unknown',
    userAgent: req.headers.get('user-agent') || 'unknown',
    pathname: req.nextUrl.pathname,
    details
  }
  
  console.error('[SECURITY] Rate limit violation:', securityEvent)
  
  // In production, send to SIEM
  if (process.env.NODE_ENV === 'production') {
    // Send to security monitoring system
    // sendToSIEM(securityEvent)
  }
}

