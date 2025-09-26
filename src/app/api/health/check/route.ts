// Health Check Endpoint - Production Monitoring
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SecurityMonitor } from '@/lib/security-monitoring'

export async function GET(req: NextRequest) {
  try {
    const startTime = Date.now()
    
    // Database health check
    const dbHealth = await checkDatabaseHealth()
    
    // Security monitoring health
    const securityHealth = checkSecurityHealth()
    
    // System health metrics
    const systemHealth = {
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV,
      responseTime: Date.now() - startTime
    }

    const healthStatus = {
      status: 'healthy',
      checks: {
        database: dbHealth,
        security: securityHealth,
        system: systemHealth
      },
      overall: 'healthy'
    }

    // Determine overall health
    if (!dbHealth.healthy || !securityHealth.healthy) {
      healthStatus.overall = 'unhealthy'
      healthStatus.status = 'unhealthy'
    }

    const statusCode = healthStatus.overall === 'healthy' ? 200 : 503

    return NextResponse.json(healthStatus, { 
      status: statusCode,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })

  } catch (error) {
    console.error('[HEALTH] Health check failed:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      error: 'Health check failed',
      timestamp: new Date().toISOString()
    }, { 
      status: 503,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  }
}

async function checkDatabaseHealth(): Promise<{
  healthy: boolean
  responseTime: number
  error?: string
}> {
  const startTime = Date.now()
  
  try {
    // Simple database query to check connectivity
    await prisma.$queryRaw`SELECT 1`
    
    return {
      healthy: true,
      responseTime: Date.now() - startTime
    }
  } catch (error) {
    return {
      healthy: false,
      responseTime: Date.now() - startTime,
      error: error instanceof Error ? error.message : 'Unknown database error'
    }
  }
}

function checkSecurityHealth(): {
  healthy: boolean
  blockedIPs: number
  suspiciousUsers: number
  recentEvents: number
} {
  try {
    const monitor = SecurityMonitor.getInstance()
    const stats = monitor.getSecurityStats()
    
    // Check if security system is overloaded
    const isOverloaded = stats.totalEvents > 10000 // More than 10k events
    
    return {
      healthy: !isOverloaded,
      blockedIPs: stats.blockedIPs,
      suspiciousUsers: stats.suspiciousUsers,
      recentEvents: stats.totalEvents
    }
  } catch (error) {
    return {
      healthy: false,
      blockedIPs: 0,
      suspiciousUsers: 0,
      recentEvents: 0
    }
  }
}

