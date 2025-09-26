// Gelişmiş güvenlik sistemi - Rakiplerden daha güvenli
export interface SecurityConfig {
  passwordPolicy: {
    minLength: number
    requireUppercase: boolean
    requireLowercase: boolean
    requireNumbers: boolean
    requireSpecialChars: boolean
    maxAge: number // gün
    preventReuse: number // son N şifre
  }
  twoFactorAuth: {
    enabled: boolean
    required: boolean
    methods: ('sms' | 'email' | 'totp' | 'backup')[]
    backupCodes: number
  }
  sessionSecurity: {
    maxDuration: number // dakika
    idleTimeout: number // dakika
    maxConcurrentSessions: number
    requireReauth: boolean
  }
  rateLimiting: {
    login: { attempts: number; window: number } // deneme / dakika
    api: { requests: number; window: number } // istek / dakika
    passwordReset: { attempts: number; window: number } // deneme / saat
  }
  fraudDetection: {
    enabled: boolean
    suspiciousActivity: boolean
    deviceFingerprinting: boolean
    locationTracking: boolean
    ipWhitelist: boolean
  }
  dataProtection: {
    encryption: boolean
    dataRetention: number // gün
    gdprCompliance: boolean
    dataAnonymization: boolean
  }
}

export interface SecurityEvent {
  id: string
  type: 'login' | 'logout' | 'password_change' | 'suspicious_activity' | 'fraud_detected' | 'data_breach'
  userId?: string
  ip: string
  userAgent: string
  location?: {
    country: string
    city: string
    coordinates: { lat: number; lng: number }
  }
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  metadata: Record<string, any>
  timestamp: Date
  resolved: boolean
}

export interface SecurityReport {
  period: 'daily' | 'weekly' | 'monthly'
  totalEvents: number
  eventsByType: Record<string, number>
  eventsBySeverity: Record<string, number>
  topThreats: Array<{
    type: string
    count: number
    trend: 'up' | 'down' | 'stable'
  }>
  blockedAttempts: number
  successfulAttacks: number
  securityScore: number
  recommendations: string[]
}

export class SecurityManager {
  private config: SecurityConfig
  private events: SecurityEvent[] = []
  private blockedIPs: Set<string> = new Set()
  private suspiciousUsers: Set<string> = new Set()

  constructor(config: SecurityConfig) {
    this.config = config
  }

  // Güvenlik olayı kaydet
  logSecurityEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): SecurityEvent {
    const securityEvent: SecurityEvent = {
      ...event,
      id: this.generateId(),
      timestamp: new Date()
    }

    this.events.push(securityEvent)
    this.analyzeEvent(securityEvent)

    return securityEvent
  }

  // Şifre güvenliği kontrolü
  validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = []
    const policy = this.config.passwordPolicy

    if (password.length < policy.minLength) {
      errors.push(`Şifre en az ${policy.minLength} karakter olmalı`)
    }

    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
      errors.push('Şifre en az bir büyük harf içermeli')
    }

    if (policy.requireLowercase && !/[a-z]/.test(password)) {
      errors.push('Şifre en az bir küçük harf içermeli')
    }

    if (policy.requireNumbers && !/\d/.test(password)) {
      errors.push('Şifre en az bir rakam içermeli')
    }

    if (policy.requireSpecialChars && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Şifre en az bir özel karakter içermeli')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  // IP adresi kontrolü
  checkIP(ip: string): { allowed: boolean; reason?: string } {
    if (this.blockedIPs.has(ip)) {
      return { allowed: false, reason: 'IP adresi engellenmiş' }
    }

    // Rate limiting kontrolü
    const recentEvents = this.events.filter(event => 
      event.ip === ip && 
      event.timestamp > new Date(Date.now() - this.config.rateLimiting.login.window * 60 * 1000)
    )

    if (recentEvents.length >= this.config.rateLimiting.login.attempts) {
      this.blockedIPs.add(ip)
      return { allowed: false, reason: 'Çok fazla başarısız deneme' }
    }

    return { allowed: true }
  }

  // Şüpheli aktivite tespiti
  detectSuspiciousActivity(userId: string, activity: any): boolean {
    if (!this.config.fraudDetection.enabled) return false

    const userEvents = this.events.filter(event => event.userId === userId)
    const recentEvents = userEvents.filter(event => 
      event.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000)
    )

    // Çok fazla başarısız giriş
    const failedLogins = recentEvents.filter(event => event.type === 'login' && event.severity === 'high')
    if (failedLogins.length > 5) {
      this.suspiciousUsers.add(userId)
      this.logSecurityEvent({
        type: 'suspicious_activity',
        userId,
        ip: activity.ip,
        userAgent: activity.userAgent,
        severity: 'high',
        description: 'Çok fazla başarısız giriş denemesi',
        metadata: { failedLogins: failedLogins.length }
      })
      return true
    }

    // Farklı konumlardan hızlı giriş
    const locations = recentEvents.map(event => event.location).filter(Boolean)
    const uniqueLocations = new Set(locations.map(loc => `${loc?.country}-${loc?.city}`))
    if (uniqueLocations.size > 3) {
      this.logSecurityEvent({
        type: 'suspicious_activity',
        userId,
        ip: activity.ip,
        userAgent: activity.userAgent,
        severity: 'medium',
        description: 'Farklı konumlardan hızlı giriş',
        metadata: { uniqueLocations: uniqueLocations.size }
      })
      return true
    }

    return false
  }

  // Güvenlik raporu oluştur
  generateSecurityReport(period: 'daily' | 'weekly' | 'monthly'): SecurityReport {
    const now = new Date()
    const startDate = this.getStartDate(period, now)
    
    const periodEvents = this.events.filter(event => event.timestamp >= startDate)
    
    const eventsByType = periodEvents.reduce((acc, event) => {
      acc[event.type] = (acc[event.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const eventsBySeverity = periodEvents.reduce((acc, event) => {
      acc[event.severity] = (acc[event.severity] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topThreats = Object.entries(eventsByType)
      .map(([type, count]) => ({
        type,
        count,
        trend: this.calculateTrend(type, period)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)

    const blockedAttempts = periodEvents.filter(event => 
      event.type === 'login' && event.severity === 'high'
    ).length

    const successfulAttacks = periodEvents.filter(event => 
      event.type === 'fraud_detected' || event.type === 'data_breach'
    ).length

    const securityScore = this.calculateSecurityScore(periodEvents)
    const recommendations = this.generateRecommendations(periodEvents)

    return {
      period,
      totalEvents: periodEvents.length,
      eventsByType,
      eventsBySeverity,
      topThreats,
      blockedAttempts,
      successfulAttacks,
      securityScore,
      recommendations
    }
  }

  // Güvenlik skoru hesapla
  private calculateSecurityScore(events: SecurityEvent[]): number {
    let score = 100

    // Kritik olaylar
    const criticalEvents = events.filter(event => event.severity === 'critical')
    score -= criticalEvents.length * 20

    // Yüksek öncelikli olaylar
    const highEvents = events.filter(event => event.severity === 'high')
    score -= highEvents.length * 10

    // Orta öncelikli olaylar
    const mediumEvents = events.filter(event => event.severity === 'medium')
    score -= mediumEvents.length * 5

    // Düşük öncelikli olaylar
    const lowEvents = events.filter(event => event.severity === 'low')
    score -= lowEvents.length * 1

    return Math.max(0, Math.min(100, score))
  }

  // Öneriler oluştur
  private generateRecommendations(events: SecurityEvent[]): string[] {
    const recommendations: string[] = []

    const failedLogins = events.filter(event => 
      event.type === 'login' && event.severity === 'high'
    ).length

    if (failedLogins > 10) {
      recommendations.push('Başarısız giriş denemelerini azaltmak için CAPTCHA ekleyin')
    }

    const suspiciousActivities = events.filter(event => 
      event.type === 'suspicious_activity'
    ).length

    if (suspiciousActivities > 5) {
      recommendations.push('Şüpheli aktiviteleri azaltmak için 2FA zorunlu hale getirin')
    }

    const fraudEvents = events.filter(event => 
      event.type === 'fraud_detected'
    ).length

    if (fraudEvents > 0) {
      recommendations.push('Fraud tespiti için makine öğrenmesi algoritmaları kullanın')
    }

    return recommendations
  }

  // Trend hesapla
  private calculateTrend(type: string, period: string): 'up' | 'down' | 'stable' {
    // Basit trend hesaplama
    const now = new Date()
    const currentPeriod = this.getStartDate(period, now)
    const previousPeriod = this.getStartDate(period, new Date(currentPeriod.getTime() - this.getPeriodDuration(period)))

    const currentEvents = this.events.filter(event => 
      event.type === type && event.timestamp >= currentPeriod
    ).length

    const previousEvents = this.events.filter(event => 
      event.type === type && 
      event.timestamp >= previousPeriod && 
      event.timestamp < currentPeriod
    ).length

    if (currentEvents > previousEvents * 1.2) return 'up'
    if (currentEvents < previousEvents * 0.8) return 'down'
    return 'stable'
  }

  // Olay analizi
  private analyzeEvent(event: SecurityEvent): void {
    if (event.severity === 'critical') {
      this.handleCriticalEvent(event)
    } else if (event.severity === 'high') {
      this.handleHighPriorityEvent(event)
    }
  }

  // Kritik olay işleme
  private handleCriticalEvent(event: SecurityEvent): void {
    // IP'yi engelle
    this.blockedIPs.add(event.ip)
    
    // Kullanıcıyı şüpheli olarak işaretle
    if (event.userId) {
      this.suspiciousUsers.add(event.userId)
    }

    // Yöneticilere bildirim gönder
    this.notifyAdmins(event)
  }

  // Yüksek öncelikli olay işleme
  private handleHighPriorityEvent(event: SecurityEvent): void {
    // Geçici IP engelleme
    setTimeout(() => {
      this.blockedIPs.delete(event.ip)
    }, 60 * 60 * 1000) // 1 saat
  }

  // Yönetici bildirimi
  private notifyAdmins(event: SecurityEvent): void {
    // Yönetici bildirimi implementasyonu
    console.log('Critical security event:', event)
  }

  // Yardımcı fonksiyonlar
  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }

  private getStartDate(period: string, date: Date): Date {
    switch (period) {
      case 'daily':
        return new Date(date.getFullYear(), date.getMonth(), date.getDate())
      case 'weekly':
        const weekStart = new Date(date)
        weekStart.setDate(date.getDate() - date.getDay())
        return new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate())
      case 'monthly':
        return new Date(date.getFullYear(), date.getMonth(), 1)
      default:
        return date
    }
  }

  private getPeriodDuration(period: string): number {
    switch (period) {
      case 'daily':
        return 24 * 60 * 60 * 1000
      case 'weekly':
        return 7 * 24 * 60 * 60 * 1000
      case 'monthly':
        return 30 * 24 * 60 * 60 * 1000
      default:
        return 24 * 60 * 60 * 1000
    }
  }
}

// Varsayılan güvenlik konfigürasyonu
export const DEFAULT_SECURITY_CONFIG: SecurityConfig = {
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxAge: 90,
    preventReuse: 5
  },
  twoFactorAuth: {
    enabled: true,
    required: false,
    methods: ['sms', 'email', 'totp', 'backup'],
    backupCodes: 10
  },
  sessionSecurity: {
    maxDuration: 480, // 8 saat
    idleTimeout: 30, // 30 dakika
    maxConcurrentSessions: 3,
    requireReauth: false
  },
  rateLimiting: {
    login: { attempts: 5, window: 15 },
    api: { requests: 100, window: 1 },
    passwordReset: { attempts: 3, window: 1 }
  },
  fraudDetection: {
    enabled: true,
    suspiciousActivity: true,
    deviceFingerprinting: true,
    locationTracking: true,
    ipWhitelist: false
  },
  dataProtection: {
    encryption: true,
    dataRetention: 2555, // 7 yıl
    gdprCompliance: true,
    dataAnonymization: true
  }
}

