import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { BookingStatus } from '@prisma/client'

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const { status } = await request.json()

    if (!Object.values(BookingStatus).includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    // Check if booking exists and user has permission
    const booking = await prisma.booking.findFirst({
      where: { 
        id,
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
      }
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: {
        status: status as BookingStatus,
        updatedAt: new Date()
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
      }
    })

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error('Booking status update error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
