import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || undefined
    const location = searchParams.get('location') || undefined
    const minRating = Number(searchParams.get('minRating') || 0)
    const sortBy = searchParams.get('sortBy') || 'rating'
    const take = Number(searchParams.get('limit') || 20)
    const skip = Number(searchParams.get('offset') || 0)

    const where = {
      AND: [
        { role: 'PROVIDER' as const },
        q
          ? {
              OR: [
                { name: { contains: q, mode: 'insensitive' as const } },
                { bio: { contains: q, mode: 'insensitive' as const } }
              ]
            }
          : {},
        location
          ? { location: { contains: location, mode: 'insensitive' as const } }
          : {},
        minRating > 0 ? { rating: { gte: minRating } } : {}
      ]
    }

    const orderBy = (() => {
      switch (sortBy) {
        case 'newest':
          return { createdAt: 'desc' as const }
        case 'jobs':
          return { reviewCount: 'desc' as const }
        case 'rating':
        default:
          return { rating: 'desc' as const }
      }
    })()

    const [providers, total] = await Promise.all([
      prisma.user.findMany({
        where,
        take,
        skip,
        orderBy,
        include: {
          services: {
            select: {
              id: true,
              title: true,
              category: true,
              price: true
            },
            take: 5,
            orderBy: { createdAt: 'desc' }
          }
        }
      }),
      prisma.user.count({ where })
    ])

    // Transform data for frontend
    const transformedProviders = providers.map(provider => ({
      id: provider.id,
      name: provider.name,
      email: provider.email,
      image: provider.image,
      bio: provider.bio || 'Hizmet veren hakkında bilgi bulunmuyor.',
      location: provider.location || 'Konum belirtilmemiş',
      rating: provider.rating,
      reviewCount: provider.reviewCount,
      completedJobs: provider.reviewCount,
      joinDate: provider.createdAt,
      isVerified: provider.isVerified || false,
      services: provider.services,
      specialties: provider.services.map(s => s.category).slice(0, 5)
    }))

    return NextResponse.json({
      success: true,
      providers: transformedProviders,
      total,
      pagination: {
        page: Math.floor(skip / take) + 1,
        limit: take,
        total,
        totalPages: Math.ceil(total / take)
      }
    })
  } catch (error) {
    console.error('Providers GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
