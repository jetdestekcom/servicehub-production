import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { SecurityUtils } from './security-config'
import { env } from './env'

  // API güvenlik middleware'i
export class APISecurityMiddleware {
  // Wrap method für API handlers
  static wrap(options: {
    requireAuth?: boolean
    handler: (req: NextRequest, context: any) => Promise<NextResponse>
  }) {
    return async (request: NextRequest, context: any = {}) => {
      try {
        // Auth kontrolü
        if (options.requireAuth) {
          // Für lokale Entwicklung: Auth deaktivieren
          if (process.env.NODE_ENV === 'development') {
            context.user = { 
              id: 'dev-user-1', 
              name: 'Development User', 
              email: 'dev@example.com',
              role: 'CUSTOMER'
            }
          } else {
            const session = await getServerSession(authOptions)
            if (!session?.user) {
              return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }
            context.user = session.user
          }
        }

        // Handler'ı çalıştır
        return await options.handler(request, context)
      } catch (error) {
        console.error('[API Handler] Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
      }
    }
  }

  // Auth wrapper für einfache Verwendung
  static withAuth(request: NextRequest, handler: (req: NextRequest, user: any) => Promise<NextResponse>) {
    return APISecurityMiddleware.wrap({
      requireAuth: true,
      handler: async (req: NextRequest, context: any) => {
        return handler(req, context.user)
      }
    })(request)
  }

  // Rate limiting kontrolü
  static async checkRateLimit(request: NextRequest, endpoint: string): Promise<boolean> {
    // Für lokale Entwicklung: immer erlauben
    if (process.env.NODE_ENV === 'development') {
      return true
    }
    
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    const key = `${endpoint}:${ip}`
    
    // Redis ile implement edilecek, şimdilik basit kontrol
    return await SecurityUtils.checkRateLimit(key, 100, 60) // 100 istek / dakika
  }

  // IP güvenlik kontrolü
  static validateIP(request: NextRequest): { valid: boolean; risk: string } {
    const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
    return SecurityUtils.validateIP(ip)
  }

  // User-Agent kontrolü
  static validateUserAgent(userAgent: string | null): boolean {
    if (!userAgent) return false
    
    // Bot kontrolü
    const botPatterns = [
      /bot/i, /crawler/i, /spider/i, /scraper/i,
      /curl/i, /wget/i, /python/i, /java/i
    ]
    
    return !botPatterns.some(pattern => pattern.test(userAgent))
  }

  // Request boyutu kontrolü
  static validateRequestSize(request: NextRequest): boolean {
    const contentLength = request.headers.get('content-length')
    if (!contentLength) return true
    
    const size = parseInt(contentLength)
    return size <= 10 * 1024 * 1024 // 10MB
  }

  // CORS kontrolü
  static validateCORS(request: NextRequest): boolean {
    const origin = request.headers.get('origin')
    if (!origin) return true // Same-origin request
    
    const allowedOrigins = env.isProduction 
      ? [env.APP_URL] 
      : ['http://localhost:3000', 'http://127.0.0.1:3000']
    
    return allowedOrigins.includes(origin)
  }

  // Ana güvenlik kontrolü
  static async validateRequest(request: NextRequest, endpoint: string): Promise<{
    valid: boolean
    error?: string
    statusCode?: number
  }> {
    try {
      // IP kontrolü
      const ipValidation = this.validateIP(request)
      if (!ipValidation.valid) {
        return {
          valid: false,
          error: 'Geçersiz IP adresi',
          statusCode: 403
        }
      }

      // User-Agent kontrolü
      const userAgent = request.headers.get('user-agent')
      if (!this.validateUserAgent(userAgent)) {
        return {
          valid: false,
          error: 'Geçersiz User-Agent',
          statusCode: 403
        }
      }

      // Request boyutu kontrolü
      if (!this.validateRequestSize(request)) {
        return {
          valid: false,
          error: 'Request boyutu çok büyük',
          statusCode: 413
        }
      }

      // CORS kontrolü
      if (!this.validateCORS(request)) {
        return {
          valid: false,
          error: 'CORS hatası',
          statusCode: 403
        }
      }

      // Rate limiting kontrolü
      const rateLimitValid = await this.checkRateLimit(request, endpoint)
      if (!rateLimitValid) {
        return {
          valid: false,
          error: 'Çok fazla istek',
          statusCode: 429
        }
      }

      return { valid: true }
    } catch (error) {
      console.error('[API Security] Validation error:', error)
      return {
        valid: false,
        error: 'Güvenlik kontrolü hatası',
        statusCode: 500
      }
    }
  }

  // Güvenlik başlıklarını ekle
  static addSecurityHeaders(response: NextResponse): NextResponse {
    const headers = SecurityUtils.getSecurityHeaders()
    
    Object.entries(headers).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  }

  // Hata yanıtı oluştur
  static createErrorResponse(message: string, statusCode: number = 400): NextResponse {
    const response = NextResponse.json(
      { 
        success: false, 
        error: message,
        timestamp: new Date().toISOString()
      },
      { status: statusCode }
    )

    return this.addSecurityHeaders(response)
  }

  // Başarılı yanıt oluştur
  static createSuccessResponse(data: any, statusCode: number = 200): NextResponse {
    const response = NextResponse.json(
      { 
        success: true, 
        data,
        timestamp: new Date().toISOString()
      },
      { status: statusCode }
    )

    return this.addSecurityHeaders(response)
  }
}

// Authentication middleware
export async function requireAuth(request: NextRequest): Promise<{
  user: any
  error?: string
}> {
  try {
    // Für lokale Entwicklung: Mock-User zurückgeben
    if (process.env.NODE_ENV === 'development') {
      return { 
        user: { 
          id: 'dev-user-1', 
          name: 'Development User', 
          email: 'dev@example.com',
          role: 'CUSTOMER'
        } 
      }
    }

    const session = await getServerSession(authOptions)
    
    if (!session || !session.user) {
      return {
        user: null,
        error: 'Oturum gerekli'
      }
    }

    return { user: session.user }
  } catch (error) {
    console.error('[Auth Middleware] Error:', error)
    return {
      user: null,
      error: 'Kimlik doğrulama hatası'
    }
  }
}

// Role-based access control
export function requireRole(allowedRoles: string[]) {
  return async (request: NextRequest): Promise<{
    user: any
    error?: string
  }> => {
    const { user, error } = await requireAuth(request)
    
    if (error) {
      return { user: null, error }
    }

    if (!allowedRoles.includes(user.role)) {
      return {
        user: null,
        error: 'Yetkisiz erişim'
      }
    }

    return { user }
  }
}

// Input validation middleware
export function validateInput(schema: any) {
  return (request: NextRequest): { valid: boolean; data?: any; error?: string } => {
    try {
      // Request body'yi parse et
      const body = request.json()
      
      // Schema validation
      const result = schema.safeParse(body)
      
      if (!result.success) {
        return {
          valid: false,
          error: 'Geçersiz input verisi'
        }
      }

      return {
        valid: true,
        data: result.data
      }
    } catch (error) {
      return {
        valid: false,
        error: 'Input parsing hatası'
      }
    }
  }
}

// API wrapper - tüm API endpoint'leri için
export function withSecurity(
  handler: (request: NextRequest, context?: any) => Promise<NextResponse>,
  options: {
    requireAuth?: boolean
    allowedRoles?: string[]
    rateLimit?: boolean
    validateInput?: any
  } = {}
) {
  return async (request: NextRequest, context?: any): Promise<NextResponse> => {
    try {
      // Güvenlik kontrolü
      const securityCheck = await APISecurityMiddleware.validateRequest(
        request, 
        request.nextUrl.pathname
      )

      if (!securityCheck.valid) {
        return APISecurityMiddleware.createErrorResponse(
          securityCheck.error!,
          securityCheck.statusCode!
        )
      }

      // Authentication kontrolü
      if (options.requireAuth) {
        const { user, error } = options.allowedRoles 
          ? await requireRole(options.allowedRoles)(request)
          : await requireAuth(request)

        if (error) {
          return APISecurityMiddleware.createErrorResponse(error, 401)
        }

        // User'ı context'e ekle
        context = { ...context, user }
      }

      // Input validation
      if (options.validateInput) {
        const validation = validateInput(options.validateInput)(request)
        if (!validation.valid) {
          return APISecurityMiddleware.createErrorResponse(validation.error!, 400)
        }
        context = { ...context, validatedData: validation.data }
      }

      // Handler'ı çalıştır
      const response = await handler(request, context)
      
      // Güvenlik başlıklarını ekle
      return APISecurityMiddleware.addSecurityHeaders(response)
    } catch (error) {
      console.error('[API Handler] Error:', error)
      return APISecurityMiddleware.createErrorResponse(
        'Sunucu hatası',
        500
      )
    }
  }
}
