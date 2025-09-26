import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Rapor oluştur
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { 
      type, 
      targetId, 
      reason, 
      description, 
      evidence 
    }: {
      type: string;
      targetId: string;
      reason: string;
      description?: string;
      evidence?: Record<string, unknown>;
    } = await request.json()

    // Rapor türüne göre hedef kontrolü
    let targetExists = false
    switch (type) {
      case 'SERVICE':
        targetExists = !!(await prisma.service.findUnique({ where: { id: targetId } }))
        break
      case 'USER':
        targetExists = !!(await prisma.user.findUnique({ where: { id: targetId } }))
        break
      case 'BOOKING':
        targetExists = !!(await prisma.booking.findUnique({ where: { id: targetId } }))
        break
      case 'REVIEW':
        targetExists = !!(await prisma.review.findUnique({ where: { id: targetId } }))
        break
    }

    if (!targetExists) {
      return NextResponse.json({ error: 'Target not found' }, { status: 404 })
    }

    // Rapor oluştur
    const report = await prisma.report.create({
      data: {
        reporterId: session.user.id,
        type: type as 'SERVICE' | 'USER' | 'BOOKING' | 'REVIEW' | 'MESSAGE',
        targetId,
        reason,
        description,
        evidence: evidence ? JSON.stringify(evidence) : null,
        status: 'PENDING'
      }
    })

    // Admin'lere bildirim gönder
    const admins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: { id: true }
    })

    for (const admin of admins) {
      await prisma.notification.create({
        data: {
          userId: admin.id,
          type: 'SYSTEM',
          title: 'Yeni Rapor Alındı',
          content: `${type} türünde yeni bir rapor alındı.`,
          data: JSON.stringify({ reportId: report.id, type, targetId })
        }
      })
    }

    return NextResponse.json({ 
      success: true, 
      reportId: report.id,
      message: 'Report submitted successfully' 
    })

  } catch (error) {
    console.error('Report creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Raporları getir (Admin)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    if (status) where.status = status
    if (type) where.type = type

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        include: {
          reporter: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.report.count({ where })
    ])

    return NextResponse.json({
      success: true,
      reports,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Reports fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
