import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withSecurity } from '@/lib/api-middleware'

async function getDashboardServices(request: NextRequest, context: any) {
  const userId = context.user.id

  try {
    // Get user's services with reviews
    const services = await prisma.service.findMany({
      where: { providerId: userId },
      include: {
        reviews: {
          select: { rating: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate ratings and format services
    const formattedServices = services.map(service => {
      const reviews = service.reviews
      const avgRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0

      return {
        id: service.id,
        title: service.title,
        category: service.category,
        price: service.price,
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
        views: 0, // You might want to add view tracking
        isActive: service.isActive,
        image: service.images ? JSON.parse(service.images)[0] : '/api/placeholder/64/64'
      }
    })

    return NextResponse.json(formattedServices)

  } catch (error) {
    console.error('Dashboard services error:', error)
    return NextResponse.json(
      { error: 'Hizmetler alınamadı' },
      { status: 500 }
    )
  }
}

export const GET = withSecurity(getDashboardServices, {
  requireAuth: true,
  rateLimit: true
})