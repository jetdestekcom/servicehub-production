import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    const category = searchParams.get('category') || ''
    const location = searchParams.get('location') || ''
    const minPrice = parseInt(searchParams.get('minPrice') || '0')
    const maxPrice = parseInt(searchParams.get('maxPrice') || '100000')
    const minRating = parseFloat(searchParams.get('minRating') || '0')
    const sortBy = searchParams.get('sortBy') || 'relevance'
    const availability = searchParams.get('availability') || 'all'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    // Build where clause
    const where: {
      isActive: boolean
      OR?: Array<{
        title?: { contains: string; mode: 'insensitive' }
        description?: { contains: string; mode: 'insensitive' }
        tags?: { contains: string; mode: 'insensitive' }
      }>
      category?: string
      location?: { contains: string; mode: 'insensitive' }
      price?: { gte: number; lte: number }
      rating?: { gte: number }
    } = {
      isActive: true
    }

    // Text search
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { tags: { contains: query, mode: 'insensitive' } }
      ]
    }

    // Category filter
    if (category) {
      where.category = category
    }

    // Location filter
    if (location) {
      where.location = { contains: location, mode: 'insensitive' }
    }

    // Price range filter
    if (minPrice > 0 || maxPrice < 100000) {
      where.price = {
        gte: minPrice,
        lte: maxPrice
      }
    }

    // Rating filter
    if (minRating > 0) {
      where.rating = { gte: minRating }
    }

    // Availability filter (simplified - in real app, check actual availability)
    if (availability === 'today') {
      // For now, just return all services
      // In real app, check booking availability for today
    }

    // Build orderBy clause
    let orderBy: Record<string, 'asc' | 'desc'> | Array<Record<string, 'asc' | 'desc'>> = {}
    switch (sortBy) {
      case 'price_low':
        orderBy = { price: 'asc' }
        break
      case 'price_high':
        orderBy = { price: 'desc' }
        break
      case 'rating':
        orderBy = { rating: 'desc' }
        break
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      case 'relevance':
      default:
        // For relevance, we'll use a combination of rating and review count
        orderBy = [
          { rating: 'desc' },
          { reviewCount: 'desc' },
          { createdAt: 'desc' }
        ]
        break
    }

    const [services, total] = await Promise.all([
      prisma.service.findMany({
        where,
        include: {
          provider: {
            select: {
              id: true,
              name: true,
              image: true,
              rating: true,
              reviewCount: true,
              isVerified: true
            }
          },
          reviews: {
            select: {
              rating: true,
              comment: true,
              createdAt: true,
              customer: {
                select: {
                  name: true,
                  image: true
                }
              }
            },
            orderBy: {
              createdAt: 'desc'
            },
            take: 3
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.service.count({ where })
    ])

    // Calculate additional metrics
    const servicesWithMetrics = services.map(service => ({
      ...service,
      // Add distance calculation if location is provided
      distance: location && service.location ? calculateDistance(location, service.location) : null,
      // Add availability status
      isAvailable: checkAvailability(service, availability),
      // Format tags
      tagsArray: service.tags ? service.tags.split(',').map(tag => tag.trim()) : [],
      // Format images
      imagesArray: service.images ? service.images.split(',').map(img => img.trim()) : []
    }))

    return NextResponse.json({
      services: servicesWithMetrics,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      filters: {
        query,
        category,
        location,
        minPrice,
        maxPrice,
        minRating,
        sortBy,
        availability
      }
    })
  } catch (error) {
    console.error('Service search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Helper function to calculate distance (simplified)
function calculateDistance(userLocation: string, serviceLocation: string): number | null {
  // In a real app, you'd use a geocoding service to get coordinates
  // and calculate actual distance
  // For now, return null
  return null
}

// Helper function to check availability (simplified)
function checkAvailability(_service: { id: string; title: string }, _availability: string): boolean {
  // In a real app, you'd check actual booking availability
  // For now, return true for all services
  return true
}
