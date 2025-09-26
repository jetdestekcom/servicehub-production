import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withSecurity } from '@/lib/api-middleware'

async function getMyServices(request: NextRequest, context: any) {
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
        description: service.description,
        category: service.category,
        price: service.price,
        duration: 60, // Default duration since not in schema
        location: service.location,
        images: service.images ? JSON.parse(service.images) : [],
        tags: service.tags ? JSON.parse(service.tags) : [],
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
        isActive: service.isActive,
        createdAt: service.createdAt.toISOString(),
        updatedAt: service.updatedAt.toISOString()
      }
    })

    return NextResponse.json(formattedServices)

  } catch (error) {
    console.error('My services error:', error)
    return NextResponse.json(
      { error: 'Hizmetler alınamadı' },
      { status: 500 }
    )
  }
}

export const GET = withSecurity(getMyServices, {
  requireAuth: true,
  rateLimit: true
})