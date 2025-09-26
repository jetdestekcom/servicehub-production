import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const services = await prisma.service.findMany({
      include: {
        provider: {
          select: {
            name: true
          }
        },
        _count: {
          select: {
            bookings: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    const formattedServices = services.map(service => ({
      id: service.id,
      title: service.title,
      provider: service.provider.name,
      category: service.category,
      price: service.price,
      status: service.isActive ? 'active' : 'inactive',
      createdAt: service.createdAt.toISOString().split('T')[0],
      views: service.reviewCount,
      bookings: service._count.bookings,
      rating: service.rating
    }))

    return NextResponse.json(formattedServices)
  } catch (error) {
    console.error('Admin services error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


