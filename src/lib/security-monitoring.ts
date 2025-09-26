// Security Monitoring System - SIEM Integration
import { NextRequest } from 'next/server'

export interface SecurityEvent {
  id: string
  type: SecurityEventType
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  timestamp: string
  source: string
  details: Record<string, any>
  ip?: string
  userAgent?: string
  userId?: string
  sessionId?: string
}

export type SecurityEventType = 
  | 'AUTHENTICATION_FAILURE'
  | 'RATE_LIMIT_EXCEEDED'
  | 'SUSPICIOUS_ACTIVITY'
  | 'SQL_INJECTION_ATTEMPT'
  | 'XSS_ATTEMPT'
  | 'CSRF_ATTEMPT'
  | 'UNAUTHORIZED_ACCESS'
  | 'DATA_EXFILTRATION_ATTEMPT'
  | 'BRUTE_FORCE_ATTACK'
  | 'DDoS_ATTEMPT'
  | 'MALICIOUS_FILE_UPLOAD'
  | 'PRIVILEGE_ESCALATION_ATTEMPT'
  | 'SESSION_HIJACKING_ATTEMPT'
  | 'API_ABUSE'
  | 'SECURITY_CONFIGURATION_CHANGE'

export class SecurityMonitor {
  private static instance: SecurityMonitor
  private events: SecurityEvent[] = []
  private alertThresholds: Map<SecurityEventType, number> = new Map()
  private blockedIPs: Set<string> = new Set()
  private suspiciousUsers: Set<string> = new Set()

  static getInstance(): SecurityMonitor {
    if (!SecurityMonitor.instance) {
      SecurityMonitor.instance = new SecurityMonitor()
      SecurityMonitor.instance.initializeThresholds()
    }
    return SecurityMonitor.instance
  }

  private initializeThresholds(): void {
    // Set alert thresholds for different event types
    this.alertThresholds.set('AUTHENTICATION_FAILURE', 5) // 5 failed attempts
    this.alertThresholds.set('RATE_LIMIT_EXCEEDED', 3) // 3 rate limit violations
    this.alertThresholds.set('BRUTE_FORCE_ATTACK', 10) // 10 brute force attempts
    this.alertThresholds.set('SQL_INJECTION_ATTEMPT', 1) // Any SQL injection attempt
    this.alertThresholds.set('XSS_ATTEMPT', 1) // Any XSS attempt
    this.alertThresholds.set('UNAUTHORIZED_ACCESS', 3) // 3 unauthorized access attempts
  }

  // Log security event
  logEvent(event: Omit<SecurityEvent, 'id' | 'timestamp'>): void {
    const securityEvent: SecurityEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: new Date().toISOString()
    }

    this.events.push(securityEvent)
    
    // Check if alert threshold is exceeded
    this.checkAlertThreshold(securityEvent)
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[SECURITY] ${securityEvent.type}:`, securityEvent)
    }
    
    // Send to external SIEM in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToSIEM(securityEvent)
    }
  }

  // Check if alert threshold is exceeded
  private checkAlertThreshold(event: SecurityEvent): void {
    const threshold = this.alertThresholds.get(event.type)
    if (!threshold) return

    const recentEvents = this.getRecentEvents(event.type, 300000) // 5 minutes
    if (recentEvents.length >= threshold) {
      this.triggerAlert(event, recentEvents.length)
    }
  }

  // Get recent events of specific type
  private getRecentEvents(type: SecurityEventType, timeWindowMs: number): SecurityEvent[] {
    const cutoffTime = Date.now() - timeWindowMs
    return this.events.filter(event => 
      event.type === type && 
      new Date(event.timestamp).getTime() > cutoffTime
    )
  }

  // Trigger security alert
  private triggerAlert(event: SecurityEvent, count: number): void {
    const alert = {
      type: 'SECURITY_ALERT',
      severity: event.severity,
      message: `Security threshold exceeded for ${event.type}: ${count} events in 5 minutes`,
      event,
      timestamp: new Date().toISOString()
    }

    console.error('[SECURITY ALERT]', alert)
    
    // In production, send to security team
    if (process.env.NODE_ENV === 'production') {
      this.sendSecurityAlert(alert)
    }
  }

  // Send to external SIEM
  private sendToSIEM(event: SecurityEvent): void {
    // In production, integrate with actual SIEM
    // Examples: Splunk, ELK Stack, Datadog, New Relic
    try {
      // Example SIEM integration
      // await fetch(process.env.SIEM_ENDPOINT, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event)
      // })
    } catch (error) {
      console.error('[SIEM] Failed to send event:', error)
    }
  }

  // Send security alert to team
  private sendSecurityAlert(alert: any): void {
    // In production, send to security team via Slack, email, etc.
    try {
      // Example alert integration
      // await fetch(process.env.SECURITY_WEBHOOK, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(alert)
      // })
    } catch (error) {
      console.error('[ALERT] Failed to send security alert:', error)
    }
  }

  // Generate unique event ID
  private generateEventId(): string {
    return `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Block IP address
  blockIP(ip: string, reason: string): void {
    this.blockedIPs.add(ip)
    this.logEvent({
      type: 'SUSPICIOUS_ACTIVITY',
      severity: 'HIGH',
      source: 'SecurityMonitor',
      details: { action: 'IP_BLOCKED', ip, reason }
    })
  }

  // Check if IP is blocked
  isIPBlocked(ip: string): boolean {
    return this.blockedIPs.has(ip)
  }

  // Mark user as suspicious
  markUserSuspicious(userId: string, reason: string): void {
    this.suspiciousUsers.add(userId)
    this.logEvent({
      type: 'SUSPICIOUS_ACTIVITY',
      severity: 'MEDIUM',
      source: 'SecurityMonitor',
      details: { action: 'USER_MARKED_SUSPICIOUS', userId, reason }
    })
  }

  // Check if user is suspicious
  isUserSuspicious(userId: string): boolean {
    return this.suspiciousUsers.has(userId)
  }

  // Get security statistics
  getSecurityStats(): {
    totalEvents: number
    eventsByType: Record<string, number>
    eventsBySeverity: Record<string, number>
    blockedIPs: number
    suspiciousUsers: number
  } {
    const eventsByType: Record<string, number> = {}
    const eventsBySeverity: Record<string, number> = {}

    this.events.forEach(event => {
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1
      eventsBySeverity[event.severity] = (eventsBySeverity[event.severity] || 0) + 1
    })

    return {
      totalEvents: this.events.length,
      eventsByType,
      eventsBySeverity,
      blockedIPs: this.blockedIPs.size,
      suspiciousUsers: this.suspiciousUsers.size
    }
  }

  // Get recent security events
  getRecentEvents(limit: number = 100): SecurityEvent[] {
    return this.events
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit)
  }
}

// Security event logging functions
export const securityLogger = {
  // Authentication events
  logAuthFailure: (req: NextRequest, email: string, reason: string) => {
    const monitor = SecurityMonitor.getInstance()
    monitor.logEvent({
      type: 'AUTHENTICATION_FAILURE',
      severity: 'MEDIUM',
      source: 'AuthSystem',
      details: { email, reason },
      ip: req.ip,
      userAgent: req.headers.get('user-agent')
    })
  },

  logAuthSuccess: (req: NextRequest, userId: string, email: string) => {
    const monitor = SecurityMonitor.getInstance()
    monitor.logEvent({
      type: 'AUTHENTICATION_SUCCESS',
      severity: 'LOW',
      source: 'AuthSystem',
      details: { userId, email },
      ip: req.ip,
      userAgent: req.headers.get('user-agent')
    })
  },

  // Rate limiting events
  logRateLimitExceeded: (req: NextRequest, endpoint: string, limit: number) => {
    const monitor = SecurityMonitor.getInstance()
    monitor.logEvent({
      type: 'RATE_LIMIT_EXCEEDED',
      severity: 'MEDIUM',
      source: 'RateLimiter',
      details: { endpoint, limit },
      ip: req.ip,
      userAgent: req.headers.get('user-agent')
    })
  },

  // Attack attempts
  logSQLInjectionAttempt: (req: NextRequest, query: string, endpoint: string) => {
    const monitor = SecurityMonitor.getInstance()
    monitor.logEvent({
      type: 'SQL_INJECTION_ATTEMPT',
      severity: 'CRITICAL',
      source: 'SecurityFilter',
      details: { query, endpoint },
      ip: req.ip,
      userAgent: req.headers.get('user-agent')
    })
  },

  logXSSAttempt: (req: NextRequest, payload: string, endpoint: string) => {
    const monitor = SecurityMonitor.getInstance()
    monitor.logEvent({
      type: 'XSS_ATTEMPT',
      severity: 'CRITICAL',
      source: 'SecurityFilter',
      details: { payload, endpoint },
      ip: req.ip,
      userAgent: req.headers.get('user-agent')
    })
  },

  // Unauthorized access
  logUnauthorizedAccess: (req: NextRequest, endpoint: string, userId?: string) => {
    const monitor = SecurityMonitor.getInstance()
    monitor.logEvent({
      type: 'UNAUTHORIZED_ACCESS',
      severity: 'HIGH',
      source: 'AuthMiddleware',
      details: { endpoint, userId },
      ip: req.ip,
      userAgent: req.headers.get('user-agent')
    })
  },

  // Data exfiltration attempts
  logDataExfiltrationAttempt: (req: NextRequest, endpoint: string, dataSize: number) => {
    const monitor = SecurityMonitor.getInstance()
    monitor.logEvent({
      type: 'DATA_EXFILTRATION_ATTEMPT',
      severity: 'HIGH',
      source: 'DataProtection',
      details: { endpoint, dataSize },
      ip: req.ip,
      userAgent: req.headers.get('user-agent')
    })
  }
}

// Initialize security monitoring
export function initializeSecurityMonitoring(): SecurityMonitor {
  return SecurityMonitor.getInstance()
}

