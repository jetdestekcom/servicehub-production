// Redis client for production-grade rate limiting
import Redis from 'ioredis'

let redis: Redis | null = null

// Redis connection
export function getRedisClient(): Redis | null {
  // Redis für lokale Entwicklung deaktiviert
  if (process.env.NODE_ENV === 'development') {
    return null
  }
  
  if (!redis && process.env.REDIS_URL) {
    try {
      redis = new Redis(process.env.REDIS_URL, {
        retryDelayOnFailover: 100,
        maxRetriesPerRequest: 3,
        lazyConnect: true,
        keepAlive: 30000,
        connectTimeout: 10000,
        commandTimeout: 5000,
        // Security settings
        enableReadyCheck: true,
        maxLoadingTimeout: 10000,
        // Connection pool
        family: 4, // IPv4
        // TLS settings for production
        tls: process.env.NODE_ENV === 'production' ? {} : undefined
      })

      redis.on('error', (err) => {
        console.error('[REDIS] Connection error:', err)
        redis = null
      })

      redis.on('connect', () => {
        console.log('[REDIS] Connected successfully')
      })

      redis.on('ready', () => {
        console.log('[REDIS] Ready for operations')
      })

      redis.on('close', () => {
        console.log('[REDIS] Connection closed')
        redis = null
      })
    } catch (error) {
      console.error('[REDIS] Failed to create client:', error)
      redis = null
    }
  }
  
  return redis
}

// Memory fallback for development
const memoryStore = new Map<string, { count: number; resetTime: number; ttl: number }>()

// Cleanup expired entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of memoryStore.entries()) {
    if (now > value.resetTime) {
      memoryStore.delete(key)
    }
  }
}, 5 * 60 * 1000)

// Rate limiting implementation
export class RateLimiter {
  private redis: Redis | null
  private memoryStore: Map<string, { count: number; resetTime: number; ttl: number }>

  constructor() {
    this.redis = getRedisClient()
    this.memoryStore = memoryStore
  }

  async checkRateLimit(
    key: string, 
    limit: number, 
    windowMs: number,
    identifier?: string
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const now = Date.now()
    const resetTime = now + windowMs
    const fullKey = identifier ? `${key}:${identifier}` : key

    try {
      if (this.redis) {
        // Redis-based rate limiting (production)
        return await this.redisBasedLimit(fullKey, limit, windowMs, now)
      } else {
        // Memory-based rate limiting (development fallback)
        return this.memoryBasedLimit(fullKey, limit, windowMs, now)
      }
    } catch (error) {
      console.error('[RATE_LIMIT] Error:', error)
      // Fail open for availability, but log the error
      return { allowed: true, remaining: limit, resetTime }
    }
  }

  private async redisBasedLimit(
    key: string, 
    limit: number, 
    windowMs: number, 
    now: number
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const pipeline = this.redis!.pipeline()
    
    // Get current count
    pipeline.get(key)
    // Increment count
    pipeline.incr(key)
    // Set expiration if first time
    pipeline.expire(key, Math.ceil(windowMs / 1000))
    
    const results = await pipeline.exec()
    
    if (!results || results.some(([err]) => err)) {
      throw new Error('Redis operation failed')
    }

    const currentCount = parseInt(results[1][1] as string) || 0
    const remaining = Math.max(0, limit - currentCount)
    const allowed = currentCount <= limit

    return {
      allowed,
      remaining,
      resetTime: now + windowMs
    }
  }

  private memoryBasedLimit(
    key: string, 
    limit: number, 
    windowMs: number, 
    now: number
  ): { allowed: boolean; remaining: number; resetTime: number } {
    const current = this.memoryStore.get(key)
    
    if (!current || now > current.resetTime) {
      // New window
      this.memoryStore.set(key, {
        count: 1,
        resetTime: now + windowMs,
        ttl: windowMs
      })
      return {
        allowed: true,
        remaining: limit - 1,
        resetTime: now + windowMs
      }
    }

    if (current.count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: current.resetTime
      }
    }

    // Increment count
    current.count++
    this.memoryStore.set(key, current)

    return {
      allowed: true,
      remaining: limit - current.count,
      resetTime: current.resetTime
    }
  }

  // Advanced rate limiting with sliding window
  async checkSlidingWindowRateLimit(
    key: string,
    limit: number,
    windowMs: number,
    identifier?: string
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const now = Date.now()
    const fullKey = `sliding:${identifier ? `${key}:${identifier}` : key}`
    const windowStart = now - windowMs

    try {
      if (this.redis) {
        return await this.redisSlidingWindow(fullKey, limit, windowMs, now, windowStart)
      } else {
        return this.memorySlidingWindow(fullKey, limit, windowMs, now, windowStart)
      }
    } catch (error) {
      console.error('[SLIDING_RATE_LIMIT] Error:', error)
      return { allowed: true, remaining: limit, resetTime: now + windowMs }
    }
  }

  private async redisSlidingWindow(
    key: string,
    limit: number,
    windowMs: number,
    now: number,
    windowStart: number
  ): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
    const pipeline = this.redis!.pipeline()
    
    // Remove expired entries
    pipeline.zremrangebyscore(key, 0, windowStart)
    // Add current request
    pipeline.zadd(key, now, `${now}-${Math.random()}`)
    // Count requests in window
    pipeline.zcard(key)
    // Set expiration
    pipeline.expire(key, Math.ceil(windowMs / 1000))
    
    const results = await pipeline.exec()
    
    if (!results || results.some(([err]) => err)) {
      throw new Error('Redis sliding window operation failed')
    }

    const currentCount = results[2][1] as number
    const allowed = currentCount <= limit
    const remaining = Math.max(0, limit - currentCount)

    return {
      allowed,
      remaining,
      resetTime: now + windowMs
    }
  }

  private memorySlidingWindow(
    key: string,
    limit: number,
    windowMs: number,
    now: number,
    windowStart: number
  ): { allowed: boolean; remaining: number; resetTime: number } {
    const current = this.memoryStore.get(key)
    
    if (!current) {
      this.memoryStore.set(key, {
        count: 1,
        resetTime: now + windowMs,
        ttl: windowMs
      })
      return {
        allowed: true,
        remaining: limit - 1,
        resetTime: now + windowMs
      }
    }

    // Simple approximation for memory-based sliding window
    const timeSinceReset = now - (current.resetTime - windowMs)
    const decayFactor = Math.max(0, 1 - (timeSinceReset / windowMs))
    const effectiveCount = Math.floor(current.count * decayFactor) + 1

    if (effectiveCount > limit) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: current.resetTime
      }
    }

    current.count = effectiveCount
    current.resetTime = now + windowMs
    this.memoryStore.set(key, current)

    return {
      allowed: true,
      remaining: limit - effectiveCount,
      resetTime: current.resetTime
    }
  }

  // Cleanup method
  async cleanup(): Promise<void> {
    if (this.redis) {
      await this.redis.quit()
      this.redis = null
    }
    this.memoryStore.clear()
  }
}

// Global rate limiter instance
export const rateLimiter = new RateLimiter()

// Graceful shutdown
process.on('SIGINT', async () => {
  await rateLimiter.cleanup()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await rateLimiter.cleanup()
  process.exit(0)
})

