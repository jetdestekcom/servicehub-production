import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withSecurity, APISecurityMiddleware } from '@/lib/api-middleware'
import { createError, ErrorHandler } from '@/lib/error-handler'
import { SecurityUtils } from '@/lib/security-config'
import { z } from 'zod'

// GET - Rezervasyonları listele
const getBookingsSchema = z.object({
  userId: z.string().optional(),
  status: z.enum(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional(),
  offset: z.string().transform(Number).pipe(z.number().min(0)).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional()
})

async function getBookingsHandler(request: NextRequest, context: any) {
  const { searchParams } = new URL(request.url)
  const params = Object.fromEntries(searchParams.entries())
  
  // Input validation
  const validationResult = getBookingsSchema.safeParse(params)
  if (!validationResult.success) {
    throw createError.validation('Geçersiz arama parametreleri', validationResult.error.errors)
  }

  const { userId, status, limit = 20, offset = 0, startDate, endDate } = validationResult.data
  const currentUserId = context.user.id
  const userRole = context.user.role

  // Where clause oluştur
  const where: any = {}

  // Kullanıcı yetkisi kontrolü
  if (userRole === 'ADMIN') {
    // Admin tüm rezervasyonları görebilir
    if (userId) {
      where.OR = [
        { customerId: userId },
        { service: { providerId: userId } }
      ]
    }
  } else if (userRole === 'PROVIDER') {
    // Hizmet veren sadece kendi hizmetlerinin rezervasyonlarını görebilir
    where.service = { providerId: currentUserId }
  } else {
    // Müşteri sadece kendi rezervasyonlarını görebilir
    where.customerId = currentUserId
  }

  // Durum filtresi
  if (status) {
    where.status = status
  }

  // Tarih filtresi
  if (startDate || endDate) {
    where.startDate = {}
    if (startDate) where.startDate.gte = new Date(startDate)
    if (endDate) where.startDate.lte = new Date(endDate)
  }

  // Veritabanı sorguları
  const [bookings, total] = await Promise.all([
    prisma.booking.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { createdAt: 'desc' },
      include: {
        service: {
          select: {
            id: true,
            title: true,
            description: true,
            price: true,
            priceType: true,
            category: true,
            images: true,
            provider: {
              select: {
                id: true,
                name: true,
                image: true,
                phone: true,
                email: true
              }
            }
          }
        },
        customer: {
          select: {
            id: true,
            name: true,
            image: true,
            phone: true,
            email: true
          }
        },
        reviews: {
          select: {
            id: true,
            rating: true,
            comment: true,
            createdAt: true
          }
        }
      }
    }),
    prisma.booking.count({ where })
  ])

  // Güvenlik için hassas verileri maskele
  const sanitizedBookings = bookings.map(booking => ({
    ...booking,
    customer: {
      ...booking.customer,
      email: SecurityUtils.maskSensitiveData(booking.customer.email, 2),
      phone: booking.customer.phone ? SecurityUtils.maskSensitiveData(booking.customer.phone, 3) : null
    },
    service: {
      ...booking.service,
      provider: {
        ...booking.service.provider,
        email: SecurityUtils.maskSensitiveData(booking.service.provider.email, 2),
        phone: booking.service.provider.phone ? SecurityUtils.maskSensitiveData(booking.service.provider.phone, 3) : null
      }
    }
  }))

  return APISecurityMiddleware.createSuccessResponse({
    bookings: sanitizedBookings,
    total,
    pagination: {
      limit,
      offset,
      hasMore: offset + limit < total
    }
  })
}

// POST - Yeni rezervasyon oluştur
const createBookingSchema = z.object({
  serviceId: z.string().min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  totalAmount: z.number().min(0).max(1000000),
  notes: z.string().max(1000).optional(),
  address: z.string().max(500).optional(),
  specialRequests: z.string().max(1000).optional(),
  contactPhone: z.string().max(20).optional(),
  contactEmail: z.string().email().optional()
})

async function createBookingHandler(request: NextRequest, context: any) {
  const body = await request.json()
  
  // Input validation
  const validationResult = createBookingSchema.safeParse(body)
  if (!validationResult.success) {
    throw createError.validation('Geçersiz rezervasyon verisi', validationResult.error.errors)
  }

  const data = validationResult.data
  const customerId = context.user.id

  // Kullanıcı yetkisi kontrolü
  if (context.user.role !== 'CUSTOMER' && context.user.role !== 'ADMIN') {
    throw createError.forbidden('Sadece müşteriler rezervasyon oluşturabilir')
  }

  // Hizmet varlık kontrolü
  const service = await prisma.service.findUnique({
    where: { id: data.serviceId },
    include: { provider: true }
  })

  if (!service) {
    throw createError.notFound('Hizmet bulunamadı')
  }

  if (!service.isActive) {
    throw createError.forbidden('Bu hizmet şu anda aktif değil')
  }

  // Kendi hizmetini rezerve edemez
  if (service.providerId === customerId) {
    throw createError.forbidden('Kendi hizmetinizi rezerve edemezsiniz')
  }

  // Tarih kontrolü
  const startDate = new Date(data.startDate)
  const now = new Date()
  
  if (startDate <= now) {
    throw createError.validation('Rezervasyon tarihi gelecekte olmalıdır')
  }

  // End date kontrolü
  let endDate = data.endDate ? new Date(data.endDate) : null
  if (endDate && endDate <= startDate) {
    throw createError.validation('Bitiş tarihi başlangıç tarihinden sonra olmalıdır')
  }

  // Hizmet süresi kontrolü
  if (service.duration && !endDate) {
    endDate = new Date(startDate.getTime() + service.duration * 60000) // dakika -> milisaniye
  }

  // Çakışan rezervasyon kontrolü
  const conflictingBooking = await prisma.booking.findFirst({
    where: {
      serviceId: data.serviceId,
      status: { in: ['PENDING', 'CONFIRMED', 'IN_PROGRESS'] },
      OR: [
        {
          startDate: { lte: startDate },
          endDate: { gte: startDate }
        },
        {
          startDate: { lte: endDate },
          endDate: { gte: endDate }
        },
        {
          startDate: { gte: startDate },
          endDate: { lte: endDate }
        }
      ]
    }
  })

  if (conflictingBooking) {
    throw createError.conflict('Bu tarih aralığında zaten bir rezervasyon mevcut')
  }

  // Rezervasyon oluştur
  const booking = await prisma.booking.create({
    data: {
      serviceId: data.serviceId,
      customerId,
      startDate,
      endDate,
      totalAmount: data.totalAmount,
      notes: data.notes ? SecurityUtils.sanitizeInput(data.notes) : null,
      address: data.address ? SecurityUtils.sanitizeInput(data.address) : null,
      specialRequests: data.specialRequests ? SecurityUtils.sanitizeInput(data.specialRequests) : null,
      contactPhone: data.contactPhone ? SecurityUtils.sanitizeInput(data.contactPhone) : null,
      contactEmail: data.contactEmail ? SecurityUtils.sanitizeInput(data.contactEmail.toLowerCase()) : null,
      status: 'PENDING'
    },
    include: {
      service: {
        select: {
          id: true,
          title: true,
          provider: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      },
      customer: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  })

  // Bildirim oluştur (hizmet veren için)
  await prisma.notification.create({
    data: {
      userId: service.providerId,
      type: 'BOOKING',
      title: 'Yeni Rezervasyon',
      content: `${booking.customer.name} sizin "${service.title}" hizmetinizi rezerve etti.`,
      data: { bookingId: booking.id }
    }
  })

  // Güvenlik logu
  console.log(`[BOOKING] Yeni rezervasyon oluşturuldu: ${booking.id} - ${service.title} - ${booking.customer.name}`)

  return APISecurityMiddleware.createSuccessResponse({
    booking,
    message: 'Rezervasyon başarıyla oluşturuldu'
  }, 201)
}

// Güvenli wrapper'lar
export const GET = withSecurity(getBookingsHandler, {
  requireAuth: true,
  rateLimit: true
})

export const POST = withSecurity(createBookingHandler, {
  requireAuth: true,
  allowedRoles: ['CUSTOMER', 'ADMIN'],
  rateLimit: true
})