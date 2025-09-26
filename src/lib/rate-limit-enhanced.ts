import { NextRequest } from 'next/server'

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Maximum requests per window
  keyGenerator?: (req: NextRequest) => string
  skipSuccessfulRequests?: boolean
  skipFailedRequests?: boolean
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

class RateLimiter {
  private store: RateLimitStore = {}
  private config: RateLimitConfig

  constructor(config: RateLimitConfig) {
    this.config = config
    this.cleanup()
  }

  private cleanup() {
    const now = Date.now()
    Object.keys(this.store).forEach(key => {
      if (this.store[key].resetTime < now) {
        delete this.store[key]
      }
    })
    
    // Cleanup every 5 minutes
    setTimeout(() => this.cleanup(), 5 * 60 * 1000)
  }

  private getKey(req: NextRequest): string {
    if (this.config.keyGenerator) {
      return this.config.keyGenerator(req)
    }
    
    // Default: IP address
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
    return ip
  }

  isAllowed(req: NextRequest): { allowed: boolean; remaining: number; resetTime: number } {
    const key = this.getKey(req)
    const now = Date.now()
    const windowMs = this.config.windowMs
    const maxRequests = this.config.maxRequests

    if (!this.store[key] || this.store[key].resetTime < now) {
      // New window
      this.store[key] = {
        count: 1,
        resetTime: now + windowMs
      }
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: this.store[key].resetTime
      }
    }

    if (this.store[key].count >= maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: this.store[key].resetTime
      }
    }

    this.store[key].count++
    return {
      allowed: true,
      remaining: maxRequests - this.store[key].count,
      resetTime: this.store[key].resetTime
    }
  }
}

// Pre-configured rate limiters
export const rateLimiters = {
  // General API rate limiting
  general: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100,
    keyGenerator: (req) => {
      const forwarded = req.headers.get('x-forwarded-for')
      const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
      return `general:${ip}`
    }
  }),

  // Authentication rate limiting
  auth: new RateLimiter({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5,
    keyGenerator: (req) => {
      const forwarded = req.headers.get('x-forwarded-for')
      const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
      return `auth:${ip}`
    }
  }),

  // Password reset rate limiting
  passwordReset: new RateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3,
    keyGenerator: (req) => {
      const forwarded = req.headers.get('x-forwarded-for')
      const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
      return `password-reset:${ip}`
    }
  }),

  // Email sending rate limiting
  email: new RateLimiter({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10,
    keyGenerator: (req) => {
      const forwarded = req.headers.get('x-forwarded-for')
      const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
      return `email:${ip}`
    }
  }),

  // Search rate limiting
  search: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 30,
    keyGenerator: (req) => {
      const forwarded = req.headers.get('x-forwarded-for')
      const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
      return `search:${ip}`
    }
  }),

  // Booking rate limiting
  booking: new RateLimiter({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 5,
    keyGenerator: (req) => {
      const forwarded = req.headers.get('x-forwarded-for')
      const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
      return `booking:${ip}`
    }
  })
}

// Middleware function for rate limiting
export function withRateLimit(
  limiter: RateLimiter,
  options: {
    skipSuccessfulRequests?: boolean
    skipFailedRequests?: boolean
  } = {}
) {
  return (req: NextRequest) => {
    const result = limiter.isAllowed(req)
    
    if (!result.allowed) {
      return {
        success: false,
        error: 'Rate limit exceeded',
        remaining: result.remaining,
        resetTime: result.resetTime
      }
    }

    return {
      success: true,
      remaining: result.remaining,
      resetTime: result.resetTime
    }
  }
}

// Helper function to add rate limit headers
export function addRateLimitHeaders(
  response: Response,
  remaining: number,
  resetTime: number
): Response {
  response.headers.set('X-RateLimit-Remaining', remaining.toString())
  response.headers.set('X-RateLimit-Reset', resetTime.toString())
  return response
}
