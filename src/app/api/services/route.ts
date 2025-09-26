import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withSecurity, APISecurityMiddleware } from '@/lib/api-middleware'
import { createError, ErrorHandler } from '@/lib/error-handler'
import { SecurityUtils } from '@/lib/security-config'
import { z } from 'zod'

// GET - Hizmetleri listele
const getServicesSchema = z.object({
  category: z.string().optional().transform(val => val === '' ? undefined : val),
  q: z.string().optional().transform(val => val === '' ? undefined : val),
  limit: z.string().optional().transform(val => val ? Number(val) : 20).pipe(z.number().min(1).max(100)),
  offset: z.string().optional().transform(val => val ? Number(val) : 0).pipe(z.number().min(0)),
  minPrice: z.string().optional().transform(val => val ? Number(val) : undefined).pipe(z.number().min(0).optional()),
  maxPrice: z.string().optional().transform(val => val ? Number(val) : undefined).pipe(z.number().min(0).optional()),
  rating: z.string().optional().transform(val => val ? Number(val) : undefined).pipe(z.number().min(0).max(5).optional()),
  location: z.string().optional().transform(val => val === '' ? undefined : val),
  isPremium: z.string().optional().transform(val => val === 'true' ? true : undefined),
  isUrgent: z.string().optional().transform(val => val === 'true' ? true : undefined),
  isVerified: z.string().optional().transform(val => val === 'true' ? true : undefined),
  warranty: z.string().optional().transform(val => val === 'true' ? true : undefined),
  sortBy: z.enum(['price', 'createdAt', 'rating', 'popularity', 'relevance', 'price-low', 'price-high', 'reviews']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.string().optional().transform(val => val ? Number(val) : 1).pipe(z.number().min(1))
})

async function getServicesHandler(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const params = Object.fromEntries(searchParams.entries())
  
  // Input validation
  const validationResult = getServicesSchema.safeParse(params)
  if (!validationResult.success) {
    throw createError.validation('Geçersiz arama parametreleri', validationResult.error.errors)
  }

    const {
      category,
      q,
      limit,
      offset,
      minPrice,
      maxPrice,
      rating,
      location,
      isPremium,
      isUrgent,
      isVerified,
      warranty,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page
    } = validationResult.data

  // Calculate offset from page
  const actualOffset = page ? (page - 1) * limit : offset

  // Where clause oluştur
  const where: any = {
    isActive: true
  }

  // Kategori filtresi
  if (category) {
    where.category = SecurityUtils.sanitizeInput(category)
  }

  // Metin araması
  if (q) {
    const sanitizedQuery = SecurityUtils.sanitizeInput(q)
    where.OR = [
      { title: { contains: sanitizedQuery, mode: 'insensitive' } },
      { description: { contains: sanitizedQuery, mode: 'insensitive' } },
      { tags: { contains: sanitizedQuery, mode: 'insensitive' } }
    ]
  }

  // Fiyat filtresi
  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {}
    if (minPrice !== undefined) where.price.gte = minPrice
    if (maxPrice !== undefined) where.price.lte = maxPrice
  }

  // Puan filtresi
  if (rating !== undefined) {
    where.rating = { gte: rating }
  }

  // Konum filtresi
  if (location) {
    where.location = { contains: SecurityUtils.sanitizeInput(location), mode: 'insensitive' }
  }

  // Premium filtresi - nur anwenden wenn explizit gesetzt
  if (isPremium === true) {
    where.isPremium = isPremium
  }

  // Acil filtresi - nur anwenden wenn explizit gesetzt
  if (isUrgent === true) {
    where.isUrgent = isUrgent
  }

  // Doğrulanmış filtresi - nur anwenden wenn explizit gesetzt
  if (isVerified === true) {
    where.isVerified = isVerified
  }

  // Garanti filtresi - nur anwenden wenn explizit gesetzt
  if (warranty === true) {
    where.warranty = { gt: 0 }
  }

  // Sıralama
  const orderBy: any = {}
  if (sortBy === 'popularity' || sortBy === 'reviews') {
    orderBy.reviewCount = sortOrder
  } else if (sortBy === 'relevance') {
    orderBy.createdAt = sortOrder
  } else if (sortBy === 'price-low') {
    orderBy.price = 'asc'
  } else if (sortBy === 'price-high') {
    orderBy.price = 'desc'
  } else if (sortBy) {
    orderBy[sortBy] = sortOrder
  }

  // Veritabanı sorguları
  const [services, total] = await Promise.all([
    prisma.service.findMany({
      where,
      take: limit,
      skip: actualOffset,
      orderBy,
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
            createdAt: true
          },
          take: 3,
          orderBy: { createdAt: 'desc' }
        }
      }
    }),
    prisma.service.count({ where })
  ])

  // Calculate ratings and review counts
  const servicesWithStats = await Promise.all(
    services.map(async (service) => {
      const reviews = await prisma.review.findMany({
        where: { serviceId: service.id },
        select: { rating: true }
      })
      
      const avgRating = reviews.length > 0 
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
        : 0
      
      return {
        ...service,
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: reviews.length,
        images: service.images ? JSON.parse(service.images) : [],
        tags: service.tags ? JSON.parse(service.tags) : [],
        provider: {
          ...service.provider,
          rating: service.provider.rating || 0,
          reviewCount: service.provider.reviewCount || 0
        }
      }
    })
  )

  // Güvenlik için hassas verileri temizle
  const sanitizedServices = servicesWithStats.map(service => ({
    ...service,
    description: service.description?.substring(0, 200) + (service.description && service.description.length > 200 ? '...' : ''),
    provider: {
      ...service.provider
      // Name wird nicht maskiert - Frontend übernimmt die Formatierung
    }
  }))

  return APISecurityMiddleware.createSuccessResponse({
    services: sanitizedServices,
    total,
    pagination: {
      limit,
      offset,
      hasMore: offset + limit < total
    }
  })
}

// POST - Yeni hizmet oluştur
const createServiceSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(2000),
  category: z.string().min(1).max(100),
  subcategory: z.string().max(100).optional(),
  price: z.number().min(0).max(1000000),
  priceType: z.enum(['FIXED', 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'PACKAGE', 'CUSTOM']).default('FIXED'),
  duration: z.number().min(1).max(10080).optional(), // 1 dakika - 1 hafta
  location: z.string().max(500).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  images: z.array(z.string().url()).max(10).optional(),
  tags: z.array(z.string().max(50)).max(20).optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  isPremium: z.boolean().default(false),
  isUrgent: z.boolean().default(false),
  isPackage: z.boolean().default(false),
  requirements: z.string().max(1000).optional(),
  toolsProvided: z.string().max(1000).optional(),
  warranty: z.number().min(0).max(365).optional(),
  insurance: z.boolean().default(false),
  certification: z.string().max(500).optional(),
  experience: z.number().min(0).max(50).optional(),
  languages: z.array(z.string().max(50)).max(10).optional(),
  workingHours: z.string().max(200).optional(),
  responseTime: z.number().min(1).max(1440).optional(), // 1 dakika - 24 saat
  serviceRadius: z.number().min(1).max(1000).optional() // 1 km - 1000 km
})

async function createServiceHandler(request: NextRequest, context: any) {
  const body = await request.json()
  
  // Input validation
  const validationResult = createServiceSchema.safeParse(body)
  if (!validationResult.success) {
    throw createError.validation('Geçersiz hizmet verisi', validationResult.error.errors)
  }

  const data = validationResult.data
  const userId = context.user.id

  // Kullanıcı yetkisi kontrolü
  if (context.user.role !== 'PROVIDER' && context.user.role !== 'ADMIN') {
    throw createError.forbidden('Sadece hizmet verenler hizmet oluşturabilir')
  }

  // Veri sanitization
  const sanitizedData = {
    title: SecurityUtils.sanitizeInput(data.title),
    description: SecurityUtils.sanitizeInput(data.description),
    category: SecurityUtils.sanitizeInput(data.category),
    subcategory: data.subcategory ? SecurityUtils.sanitizeInput(data.subcategory) : null,
    price: data.price,
    priceType: data.priceType,
    duration: data.duration,
    location: data.location ? SecurityUtils.sanitizeInput(data.location) : null,
    latitude: data.latitude,
    longitude: data.longitude,
    images: data.images ? data.images.join(',') : null,
    tags: data.tags ? data.tags.join(',') : null,
    minPrice: data.minPrice,
    maxPrice: data.maxPrice,
    isPremium: data.isPremium,
    isUrgent: data.isUrgent,
    isPackage: data.isPackage,
    requirements: data.requirements ? SecurityUtils.sanitizeInput(data.requirements) : null,
    toolsProvided: data.toolsProvided ? SecurityUtils.sanitizeInput(data.toolsProvided) : null,
    warranty: data.warranty,
    insurance: data.insurance,
    certification: data.certification ? SecurityUtils.sanitizeInput(data.certification) : null,
    experience: data.experience,
    languages: data.languages ? data.languages.join(',') : null,
    workingHours: data.workingHours ? SecurityUtils.sanitizeInput(data.workingHours) : null,
    responseTime: data.responseTime,
    serviceRadius: data.serviceRadius,
    providerId: userId
  }

  // Hizmet oluştur
  const service = await prisma.service.create({
    data: sanitizedData,
    include: {
      provider: {
        select: {
          id: true,
          name: true,
          image: true,
          rating: true
        }
      }
    }
  })

  // Güvenlik logu
  console.log(`[SERVICE] Yeni hizmet oluşturuldu: ${service.id} - ${service.title} - ${service.provider.name}`)

  return APISecurityMiddleware.createSuccessResponse({
    service,
    message: 'Hizmet başarıyla oluşturuldu'
  }, 201)
}

// Güvenli wrapper'lar
export const GET = withSecurity(getServicesHandler, {
  requireAuth: false,
  rateLimit: true
})

export const POST = withSecurity(createServiceHandler, {
  requireAuth: true,
  allowedRoles: ['PROVIDER', 'ADMIN'],
  rateLimit: true
})