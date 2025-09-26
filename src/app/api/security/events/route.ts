import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SecurityManager, DEFAULT_SECURITY_CONFIG } from '@/lib/security-system'

// Güvenlik olayları
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const severity = searchParams.get('severity')
    const type = searchParams.get('type')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const where: any = {}
    if (severity) where.severity = severity
    if (type) where.type = type

    const events = await prisma.securityEvent.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      skip: (page - 1) * limit,
      take: limit
    })

    const total = await prisma.securityEvent.count({ where })

    return NextResponse.json({
      success: true,
      data: {
        events,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    })
  } catch (error) {
    console.error('Güvenlik olayları hatası:', error)
    return NextResponse.json({ error: 'Güvenlik olayları yüklenemedi' }, { status: 500 })
  }
}

// Güvenlik olayı oluştur
export async function POST(request: NextRequest) {
  try {
    const {
      type,
      userId,
      ip,
      userAgent,
      location,
      severity,
      description,
      metadata
    } = await request.json()

    const securityManager = new SecurityManager(DEFAULT_SECURITY_CONFIG)

    const event = securityManager.logSecurityEvent({
      type,
      userId,
      ip,
      userAgent,
      location,
      severity,
      description,
      metadata
    })

    return NextResponse.json({ success: true, data: event })
  } catch (error) {
    console.error('Güvenlik olayı oluşturma hatası:', error)
    return NextResponse.json({ error: 'Güvenlik olayı oluşturulamadı' }, { status: 500 })
  }
}

