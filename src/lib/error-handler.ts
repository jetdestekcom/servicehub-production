// Kapsamlı hata yönetimi sistemi
export class AppError extends Error {
  public statusCode: number
  public isOperational: boolean
  public code?: string
  public details?: any

  constructor(
    message: string,
    statusCode: number = 500,
    isOperational: boolean = true,
    code?: string,
    details?: any
  ) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational
    this.code = code
    this.details = details

    Error.captureStackTrace(this, this.constructor)
  }
}

// Hata türleri
export const ErrorTypes = {
  // Authentication & Authorization
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  TOKEN_EXPIRED: 'TOKEN_EXPIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  
  // Validation
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  
  // Business Logic
  RESOURCE_NOT_FOUND: 'RESOURCE_NOT_FOUND',
  DUPLICATE_RESOURCE: 'DUPLICATE_RESOURCE',
  OPERATION_NOT_ALLOWED: 'OPERATION_NOT_ALLOWED',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  
  // External Services
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  PAYMENT_ERROR: 'PAYMENT_ERROR',
  EMAIL_ERROR: 'EMAIL_ERROR',
  SMS_ERROR: 'SMS_ERROR',
  
  // System
  DATABASE_ERROR: 'DATABASE_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  
  // Security
  SECURITY_VIOLATION: 'SECURITY_VIOLATION',
  SUSPICIOUS_ACTIVITY: 'SUSPICIOUS_ACTIVITY',
  IP_BLOCKED: 'IP_BLOCKED'
}

// Hata mesajları
export const ErrorMessages = {
  [ErrorTypes.UNAUTHORIZED]: 'Oturum gerekli',
  [ErrorTypes.FORBIDDEN]: 'Bu işlem için yetkiniz yok',
  [ErrorTypes.TOKEN_EXPIRED]: 'Oturum süresi dolmuş',
  [ErrorTypes.INVALID_CREDENTIALS]: 'Geçersiz email veya şifre',
  [ErrorTypes.VALIDATION_ERROR]: 'Girilen veriler geçersiz',
  [ErrorTypes.INVALID_INPUT]: 'Geçersiz input verisi',
  [ErrorTypes.MISSING_REQUIRED_FIELD]: 'Gerekli alan eksik',
  [ErrorTypes.RESOURCE_NOT_FOUND]: 'Kaynak bulunamadı',
  [ErrorTypes.DUPLICATE_RESOURCE]: 'Bu kaynak zaten mevcut',
  [ErrorTypes.OPERATION_NOT_ALLOWED]: 'Bu işlem yapılamaz',
  [ErrorTypes.INSUFFICIENT_PERMISSIONS]: 'Yetersiz yetki',
  [ErrorTypes.EXTERNAL_SERVICE_ERROR]: 'Dış servis hatası',
  [ErrorTypes.PAYMENT_ERROR]: 'Ödeme işlemi hatası',
  [ErrorTypes.EMAIL_ERROR]: 'Email gönderim hatası',
  [ErrorTypes.SMS_ERROR]: 'SMS gönderim hatası',
  [ErrorTypes.DATABASE_ERROR]: 'Veritabanı hatası',
  [ErrorTypes.NETWORK_ERROR]: 'Ağ bağlantı hatası',
  [ErrorTypes.TIMEOUT_ERROR]: 'İşlem zaman aşımı',
  [ErrorTypes.RATE_LIMIT_EXCEEDED]: 'Çok fazla istek',
  [ErrorTypes.SECURITY_VIOLATION]: 'Güvenlik ihlali',
  [ErrorTypes.SUSPICIOUS_ACTIVITY]: 'Şüpheli aktivite',
  [ErrorTypes.IP_BLOCKED]: 'IP adresi engellenmiş'
}

// Hata oluşturucu fonksiyonlar
export const createError = {
  unauthorized: (message?: string) => new AppError(
    message || ErrorMessages[ErrorTypes.UNAUTHORIZED],
    401,
    true,
    ErrorTypes.UNAUTHORIZED
  ),

  forbidden: (message?: string) => new AppError(
    message || ErrorMessages[ErrorTypes.FORBIDDEN],
    403,
    true,
    ErrorTypes.FORBIDDEN
  ),

  notFound: (message?: string) => new AppError(
    message || ErrorMessages[ErrorTypes.RESOURCE_NOT_FOUND],
    404,
    true,
    ErrorTypes.RESOURCE_NOT_FOUND
  ),

  validation: (message?: string, details?: any) => new AppError(
    message || ErrorMessages[ErrorTypes.VALIDATION_ERROR],
    400,
    true,
    ErrorTypes.VALIDATION_ERROR,
    details
  ),

  conflict: (message?: string) => new AppError(
    message || ErrorMessages[ErrorTypes.DUPLICATE_RESOURCE],
    409,
    true,
    ErrorTypes.DUPLICATE_RESOURCE
  ),

  rateLimit: (message?: string) => new AppError(
    message || ErrorMessages[ErrorTypes.RATE_LIMIT_EXCEEDED],
    429,
    true,
    ErrorTypes.RATE_LIMIT_EXCEEDED
  ),

  internal: (message?: string, details?: any) => new AppError(
    message || 'Sunucu hatası',
    500,
    false,
    'INTERNAL_ERROR',
    details
  ),

  external: (service: string, message?: string) => new AppError(
    message || `${service} servisi hatası`,
    502,
    true,
    ErrorTypes.EXTERNAL_SERVICE_ERROR,
    { service }
  ),

  security: (message?: string, details?: any) => new AppError(
    message || ErrorMessages[ErrorTypes.SECURITY_VIOLATION],
    403,
    true,
    ErrorTypes.SECURITY_VIOLATION,
    details
  )
}

// Hata işleyici
export class ErrorHandler {
  // Hata loglama
  static logError(error: Error, context?: any): void {
    const timestamp = new Date().toISOString()
    const errorInfo = {
      timestamp,
      message: error.message,
      stack: error.stack,
      context,
      type: error instanceof AppError ? error.code : 'UNKNOWN'
    }

    // Production'da Sentry'ye gönder
    if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
      // Sentry integration burada olacak
      console.error('[SENTRY]', errorInfo)
    } else {
      console.error('[ERROR]', errorInfo)
    }
  }

  // Hata yanıtı oluştur
  static createErrorResponse(error: Error): {
    success: false
    error: string
    code?: string
    details?: any
    timestamp: string
  } {
    this.logError(error)

    if (error instanceof AppError) {
      return {
        success: false,
        error: error.message,
        code: error.code,
        details: error.details,
        timestamp: new Date().toISOString()
      }
    }

    // Bilinmeyen hatalar için güvenli yanıt
    return {
      success: false,
      error: process.env.NODE_ENV === 'production' 
        ? 'Sunucu hatası' 
        : error.message,
      timestamp: new Date().toISOString()
    }
  }

  // Try-catch wrapper
  static async handleAsync<T>(
    asyncFn: () => Promise<T>,
    context?: any
  ): Promise<{ data?: T; error?: AppError }> {
    try {
      const data = await asyncFn()
      return { data }
    } catch (error) {
      if (error instanceof AppError) {
        this.logError(error, context)
        return { error }
      }

      // Beklenmeyen hatalar
      const appError = createError.internal(
        'Beklenmeyen hata oluştu',
        { originalError: error instanceof Error ? error.message : 'Unknown error' }
      )
      this.logError(appError, context)
      return { error: appError }
    }
  }

  // Validation hata işleyici
  static handleValidationError(errors: any[]): AppError {
    const details = errors.map(err => ({
      field: err.path?.join('.') || 'unknown',
      message: err.message,
      value: err.value
    }))

    return createError.validation('Girilen veriler geçersiz', details)
  }

  // Database hata işleyici
  static handleDatabaseError(error: any): AppError {
    // Prisma hatalarını işle
    if (error.code === 'P2002') {
      return createError.conflict('Bu kayıt zaten mevcut')
    }

    if (error.code === 'P2025') {
      return createError.notFound('Kayıt bulunamadı')
    }

    if (error.code === 'P2003') {
      return createError.validation('Geçersiz referans')
    }

    // Diğer database hataları
    return createError.internal('Veritabanı hatası', { code: error.code })
  }

  // External service hata işleyici
  static handleExternalServiceError(service: string, error: any): AppError {
    if (error.status === 401) {
      return createError.unauthorized(`${service} servisi kimlik doğrulama hatası`)
    }

    if (error.status === 403) {
      return createError.forbidden(`${service} servisi erişim hatası`)
    }

    if (error.status === 404) {
      return createError.notFound(`${service} servisi kaynak bulunamadı`)
    }

    if (error.status >= 500) {
      return createError.external(service, 'Sunucu hatası')
    }

    return createError.external(service, error.message)
  }
}

// Global hata yakalayıcı
export function globalErrorHandler(error: Error, context?: any): never {
  ErrorHandler.logError(error, context)
  
  if (error instanceof AppError) {
    throw error
  }

  throw createError.internal('Beklenmeyen hata', { originalError: error.message })
}

// API endpoint hata wrapper'ı
export function withErrorHandling<T extends any[], R>(
  handler: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await handler(...args)
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      
      throw createError.internal('İşlem hatası', { 
        originalError: error instanceof Error ? error.message : 'Unknown error' 
      })
    }
  }
}

