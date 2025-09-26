// Content Security Policy Generator - DEFCON 1 Security Level
// Edge Runtime compatible nonce generation

// Generate cryptographically secure nonce (Edge Runtime compatible)
export function generateNonce(): string {
  // Use Web Crypto API for Edge Runtime compatibility
  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint8Array(16)
    window.crypto.getRandomValues(array)
    return btoa(String.fromCharCode(...array))
  }
  
  // Fallback for server-side (Node.js) - Edge Runtime compatible
  try {
    // Try to use crypto module if available
    const crypto = require('crypto')
    return crypto.randomBytes(16).toString('base64')
  } catch (error) {
    // Fallback to Math.random if crypto is not available
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
  }
}

// Generate strict CSP policy
export function generateCSP(nonce?: string): string {
  // Deaktiviert für lokale Entwicklung
  if (process.env.NODE_ENV === 'development') {
    return "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob: https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: blob: https:; font-src 'self' data: https:; connect-src 'self' https: wss: ws:; frame-src 'self' https:; worker-src 'self' blob:; manifest-src 'self';"
  }
  
  const nonceValue = nonce || generateNonce()
  
  const directives = [
    // Default source - only self
    "default-src 'self'",
    
    // Script sources - only self with nonce, no unsafe-inline or unsafe-eval
    `script-src 'self' 'nonce-${nonceValue}' https://js.stripe.com https://maps.googleapis.com`,
    
    // Style sources - only self with nonce
    `style-src 'self' 'nonce-${nonceValue}' https://fonts.googleapis.com`,
    
    // Image sources - self, data, and trusted CDNs
    "img-src 'self' data: https: blob:",
    
    // Font sources - self and Google Fonts
    "font-src 'self' https://fonts.gstatic.com data:",
    
    // Connect sources - self and trusted APIs
    "connect-src 'self' https://api.stripe.com https://maps.googleapis.com wss:",
    
    // Media sources - none
    "media-src 'none'",
    
    // Object sources - none
    "object-src 'none'",
    
    // Base URI - self only
    "base-uri 'self'",
    
    // Form action - self only
    "form-action 'self'",
    
    // Frame ancestors - none (prevents clickjacking)
    "frame-ancestors 'none'",
    
    // Frame sources - only Stripe
    "frame-src https://js.stripe.com https://hooks.stripe.com",
    
    // Worker sources - self only
    "worker-src 'self' blob:",
    
    // Manifest source - self only
    "manifest-src 'self'",
    
    // Upgrade insecure requests
    "upgrade-insecure-requests",
    
    // Block mixed content
    "block-all-mixed-content"
  ]

  return directives.join('; ')
}

// Generate report-only CSP for testing
export function generateReportOnlyCSP(nonce?: string): string {
  // Deaktiviert für lokale Entwicklung
  if (process.env.NODE_ENV === 'development') {
    return ""
  }
  
  const nonceValue = nonce || generateNonce()
  
  const directives = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonceValue}' https://js.stripe.com`,
    `style-src 'self' 'nonce-${nonceValue}' https://fonts.googleapis.com`,
    "img-src 'self' data: https:",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://api.stripe.com",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests"
  ]

  return directives.join('; ')
}

// Validate CSP directive
export function validateCSPDirective(directive: string): boolean {
  const allowedDirectives = [
    'default-src', 'script-src', 'style-src', 'img-src', 'font-src',
    'connect-src', 'media-src', 'object-src', 'base-uri', 'form-action',
    'frame-ancestors', 'frame-src', 'worker-src', 'manifest-src',
    'upgrade-insecure-requests', 'block-all-mixed-content'
  ]

  const directiveName = directive.split(' ')[0]
  return allowedDirectives.includes(directiveName)
}

// Security headers for maximum protection
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
  'X-Permitted-Cross-Domain-Policies': 'none',
  'X-Download-Options': 'noopen',
  'X-DNS-Prefetch-Control': 'off'
}

// Generate security headers with CSP
export function generateSecurityHeaders(nonce?: string): Record<string, string> {
  return {
    ...securityHeaders,
    'Content-Security-Policy': generateCSP(nonce),
    'Content-Security-Policy-Report-Only': generateReportOnlyCSP(nonce)
  }
}
