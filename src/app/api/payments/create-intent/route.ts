import { NextRequest, NextResponse } from 'next/server'
import { withSecurity, APISecurityMiddleware } from '@/lib/api-middleware'
import { createError, ErrorHandler } from '@/lib/error-handler'
import { SecurityUtils } from '@/lib/security-config'
import { env } from '@/lib/env'
import { z } from 'zod'

const createPaymentIntentSchema = z.object({
  amount: z.number().min(100).max(1000000), // 1 TL - 10,000 TL
  currency: z.string().length(3).default('try'),
  bookingId: z.string().min(1),
  description: z.string().max(500).optional(),
  metadata: z.record(z.string()).optional()
})

async function createPaymentIntentHandler(request: NextRequest, context: any) {
  const body = await request.json()
  
  // Input validation
  const validationResult = createPaymentIntentSchema.safeParse(body)
  if (!validationResult.success) {
    throw createError.validation('Geçersiz ödeme verisi', validationResult.error.errors)
  }

  const { amount, currency, bookingId, description, metadata } = validationResult.data
  const userId = context.user.id

  // Stripe konfigürasyon kontrolü
  if (!env.features.stripeConfigured) {
    throw createError.external('Stripe', 'Ödeme sistemi henüz konfigüre edilmemiş')
  }

  // Rezervasyon kontrolü
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      service: {
        select: {
          id: true,
          title: true,
          providerId: true
        }
      },
      customer: {
        select: {
          id: true,
          name: true
        }
      }
    }
  })

  if (!booking) {
    throw createError.notFound('Rezervasyon bulunamadı')
  }

  // Yetki kontrolü
  if (booking.customerId !== userId && context.user.role !== 'ADMIN') {
    throw createError.forbidden('Bu rezervasyon için ödeme yapma yetkiniz yok')
  }

  // Rezervasyon durumu kontrolü
  if (booking.status !== 'PENDING' && booking.status !== 'CONFIRMED') {
    throw createError.forbidden('Bu rezervasyon için ödeme yapılamaz')
  }

  // Ödeme tutarı kontrolü
  if (Math.abs(booking.totalAmount - amount) > 0.01) { // Kuruş farkına kadar tolerans
    throw createError.validation('Ödeme tutarı rezervasyon tutarı ile eşleşmiyor')
  }

  // Daha önce ödeme yapılmış mı kontrolü
  const existingPayment = await prisma.escrow.findFirst({
    where: {
      bookingId,
      status: { in: ['PENDING', 'HELD', 'RELEASED'] }
    }
  })

  if (existingPayment) {
    throw createError.conflict('Bu rezervasyon için zaten bir ödeme mevcut')
  }

  try {
    // Stripe PaymentIntent oluştur
    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16'
    })

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Kuruş cinsinden
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true
      },
      metadata: {
        bookingId,
        customerId: userId,
        serviceId: booking.service.id,
        providerId: booking.service.providerId,
        ...metadata
      },
      description: description || `Rezervasyon ödemesi - ${booking.service.title}`,
      statement_descriptor: 'JetDestek.com',
      receipt_email: context.user.email
    })

    // Escrow kaydı oluştur
    const escrow = await prisma.escrow.create({
      data: {
        bookingId,
        customerId: userId,
        providerId: booking.service.providerId,
        amount,
        currency: currency.toLowerCase(),
        stripePaymentIntentId: paymentIntent.id,
        status: 'PENDING',
        description: description || `Rezervasyon ödemesi - ${booking.service.title}`
      }
    })

    // Güvenlik logu
    console.log(`[PAYMENT] PaymentIntent oluşturuldu: ${paymentIntent.id} - ${amount} ${currency} - ${userId}`)

    return APISecurityMiddleware.createSuccessResponse({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      escrowId: escrow.id,
      amount,
      currency: currency.toLowerCase()
    })
  } catch (error) {
    console.error('[PAYMENT] Stripe error:', error)
    throw createError.external('Stripe', 'Ödeme işlemi başlatılamadı')
  }
}

// Güvenli wrapper
export const POST = withSecurity(createPaymentIntentHandler, {
  requireAuth: true,
  allowedRoles: ['CUSTOMER', 'ADMIN'],
  rateLimit: true
})