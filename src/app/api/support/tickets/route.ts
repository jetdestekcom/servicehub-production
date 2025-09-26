import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Destek talebi oluştur
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      subject,
      description,
      priority = 'MEDIUM',
      category,
      relatedId,
      attachments = []
    }: {
      subject: string;
      description: string;
      priority?: string;
      category?: string;
      relatedId?: string;
      attachments?: string[];
    } = await request.json()

    // Destek talebi oluştur
    const ticket = await prisma.supportTicket.create({
      data: {
        userId: session.user.id,
        subject,
        description,
        priority: priority as 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT',
        category: category as 'TECHNICAL' | 'BILLING' | 'GENERAL' | 'COMPLAINT' | 'SUGGESTION',
        relatedId,
        attachments: JSON.stringify(attachments),
        status: 'OPEN'
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
          type: 'SUPPORT',
          title: 'Yeni Destek Talebi',
          content: `Yeni bir destek talebi alındı: ${subject}`,
          data: JSON.stringify({ ticketId: ticket.id, priority })
        }
      })
    }

    return NextResponse.json({
      success: true,
      ticketId: ticket.id,
      message: 'Support ticket created successfully'
    })

  } catch (error) {
    console.error('Support ticket creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Destek taleplerini getir
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const priority = searchParams.get('priority')
    const category = searchParams.get('category')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    const skip = (page - 1) * limit

    const where: Record<string, unknown> = {}
    
    // Admin değilse sadece kendi taleplerini görebilir
    if (session.user.role !== 'ADMIN') {
      where.userId = session.user.id
    }

    if (status) where.status = status
    if (priority) where.priority = priority
    if (category) where.category = category

    const [tickets, total] = await Promise.all([
      prisma.supportTicket.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true
            }
          },
          assignedTo: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          _count: {
            select: {
              messages: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.supportTicket.count({ where })
    ])

    return NextResponse.json({
      success: true,
      tickets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Support tickets fetch error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
