import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'jetdestek-jwt-secret-key-2024-development-only-32-chars-minimum'

// JWT token'dan user ID'yi çıkar
function getUserIdFromToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded.userId || null
  } catch (error) {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    // JWT token kontrolü
    const sessionToken = request.cookies.get('auth_token')
    
    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = getUserIdFromToken(sessionToken.value)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    // Get user's services
    const userServices = await prisma.service.findMany({
      where: { providerId: userId },
      select: { id: true }
    })
    
    const serviceIds = userServices.map(service => service.id)

    // Get booking statistics
    const [totalBookings, completedBookings, pendingBookings] = await Promise.all([
      prisma.booking.count({
        where: { serviceId: { in: serviceIds } }
      }),
      prisma.booking.count({
        where: { 
          serviceId: { in: serviceIds },
          status: 'COMPLETED'
        }
      }),
      prisma.booking.count({
        where: { 
          serviceId: { in: serviceIds },
          status: 'PENDING'
        }
      })
    ])

    // Get total earnings
    const completedBookingsWithPrice = await prisma.booking.findMany({
      where: { 
        serviceId: { in: serviceIds },
        status: 'COMPLETED'
      },
      select: { totalPrice: true }
    })

    const totalEarnings = completedBookingsWithPrice.reduce(
      (sum, booking) => sum + booking.totalPrice, 
      0
    )

    // Get rating statistics
    const reviews = await prisma.review.findMany({
      where: { 
        serviceId: { in: serviceIds }
      },
      select: { rating: true }
    })

    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0

    const totalReviews = reviews.length

    return NextResponse.json({
      totalBookings,
      completedBookings,
      pendingBookings,
      totalEarnings,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews
    })

  } catch (error) {
    console.error('Dashboard stats error:', error)
    return NextResponse.json(
      { error: 'Dashboard istatistikleri alınamadı' },
      { status: 500 }
    )
  }
}
