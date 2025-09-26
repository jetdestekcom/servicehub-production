import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const bookings = await prisma.booking.findMany({
      where: { 
        OR: [
          { customerId: session.user.id },
          { service: { providerId: session.user.id } }
        ]
      },
      include: {
        service: {
          include: {
            provider: {
              select: {
                id: true,
                name: true,
                phone: true,
                image: true,
                rating: true,
                reviewCount: true
              }
            }
          }
        },
        customer: {
          select: {
            id: true,
            name: true,
            phone: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('My bookings fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


