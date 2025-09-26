import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const {
      query,
      categoryId,
      subcategoryId,
      minPrice,
      maxPrice,
      minRating,
      maxRating,
      location,
      radius,
      availability,
      sortBy,
      page = 1,
      limit = 20,
      features,
      priceRange,
      providerType,
      verifiedOnly = false
    } = await request.json()

    const skip = (page - 1) * limit

    // Arama kriterleri
    const where: any = {
      isActive: true,
      status: 'ACTIVE'
    }

    // Metin araması
    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { tags: { contains: query, mode: 'insensitive' } }
      ]
    }

    // Kategori filtresi
    if (categoryId) {
      where.categoryId = categoryId
    }

    if (subcategoryId) {
      where.subcategoryId = subcategoryId
    }

    // Fiyat filtresi
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {} as { gte?: number; lte?: number }
      if (minPrice !== undefined) where.price.gte = minPrice
      if (maxPrice !== undefined) where.price.lte = maxPrice
    }

    // Rating filtresi
    if (minRating !== undefined) {
      where.rating = { gte: minRating }
    }

    if (maxRating !== undefined) {
      where.rating = { ...where.rating, lte: maxRating }
    }

    // Konum filtresi
    if (location && radius) {
      // Bu kısım gerçek konum hesaplaması için geliştirilebilir
      where.location = { contains: location, mode: 'insensitive' }
    }

    // Özellik filtresi
    if (features && features.length > 0) {
      where.features = {
        hasSome: features
      }
    }

    // Fiyat aralığı filtresi
    if (priceRange) {
      switch (priceRange) {
        case 'budget':
          where.price = { lte: 100 }
          break
        case 'moderate':
          where.price = { gte: 100, lte: 500 }
          break
        case 'premium':
          where.price = { gte: 500 }
          break
      }
    }

    // Sağlayıcı tipi filtresi
    if (providerType) {
      where.provider = {
        type: providerType
      }
    }

    // Doğrulanmış sağlayıcılar
    if (verifiedOnly) {
      where.provider = {
        ...where.provider,
        isVerified: true
      }
    }

    // Sıralama
    let orderBy: Record<string, string> | Array<Record<string, string>> = { createdAt: 'desc' }
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
      case 'popular':
        orderBy = { viewCount: 'desc' }
        break
      case 'relevance':
        // Metin araması için relevance sıralaması
        if (query) {
          orderBy = [
            { rating: 'desc' },
            { viewCount: 'desc' },
            { createdAt: 'desc' }
          ]
        }
        break
    }

    // Hizmetleri getir
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
              isVerified: true,
              responseTime: true,
              completionRate: true
            }
          },
          category: {
            select: {
              id: true,
              name: true,
              icon: true
            }
          },
          subcategory: {
            select: {
              id: true,
              name: true
            }
          },
          _count: {
            select: {
              bookings: true,
              reviews: true
            }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.service.count({ where })
    ])

    // Arama istatistikleri
    const stats = {
      total,
      page,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total
    }

    return NextResponse.json({
      success: true,
      services,
      stats,
      filters: {
        query,
        categoryId,
        subcategoryId,
        minPrice,
        maxPrice,
        minRating,
        maxRating,
        location,
        radius,
        availability,
        sortBy,
        features,
        priceRange,
        providerType,
        verifiedOnly
      }
    })

  } catch (error) {
    console.error('Advanced search error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
