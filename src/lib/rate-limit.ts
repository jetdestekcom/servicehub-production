type RateKey = string

const windowMs = 60_000
const maxRequests = 60

const bucket = new Map<RateKey, { count: number; resetAt: number }>()

export function rateLimit(key: RateKey): boolean {
  const now = Date.now()
  const entry = bucket.get(key)
  if (!entry || entry.resetAt < now) {
    bucket.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= maxRequests) return false
  entry.count += 1
  return true
}

export function ipKey(headers: Headers): RateKey {
  return (
    headers.get('x-forwarded-for') ||
    headers.get('x-real-ip') ||
    'unknown-ip'
  )
}




