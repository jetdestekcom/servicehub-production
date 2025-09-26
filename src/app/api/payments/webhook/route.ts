import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { prisma } from '@/lib/prisma'
import { createError, ErrorHandler } from '@/lib/error-handler'
import { SecurityUtils } from '@/lib/security-config'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Stripe konfigürasyon kontrolü
    if (!env.features.stripeConfigured || !env.STRIPE_WEBHOOK_SECRET) {
      throw createError.external('Stripe', 'Webhook konfigürasyonu eksik')
    }

    const Stripe = (await import('stripe')).default
    const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16'
    })

    // Raw body al
    const rawBody = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      throw createError.security('Stripe signature eksik')
    }

    // Webhook doğrulama
    let event
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        env.STRIPE_WEBHOOK_SECRET!
      )
    } catch (err) {
      console.error('[WEBHOOK] Signature verification failed:', err)
      throw createError.security('Geçersiz webhook imzası')
    }

    // Event işleme
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object)
        break

      case 'payment_intent.canceled':
        await handlePaymentIntentCanceled(event.data.object)
        break

      case 'payment_intent.requires_action':
        await handlePaymentIntentRequiresAction(event.data.object)
        break

      default:
        console.log(`[WEBHOOK] Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[WEBHOOK] Error:', error)
    
    if (error instanceof Error && error.message.includes('security')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

// Payment Intent başarılı
async function handlePaymentIntentSucceeded(paymentIntent: any) {
  try {
    const { id: paymentIntentId, metadata, amount, currency } = paymentIntent
    const { bookingId, customerId, providerId } = metadata

    if (!bookingId || !customerId || !providerId) {
      console.error('[WEBHOOK] Missing metadata in payment_intent.succeeded')
      return
    }

    // Escrow kaydını güncelle
    const escrow = await prisma.escrow.findFirst({
      where: { stripePaymentIntentId: paymentIntentId }
    })

    if (!escrow) {
      console.error(`[WEBHOOK] Escrow not found for payment intent: ${paymentIntentId}`)
      return
    }

    // Escrow durumunu güncelle
    await prisma.escrow.update({
      where: { id: escrow.id },
      data: {
        status: 'HELD',
        paidAt: new Date(),
        stripePaymentIntentId: paymentIntentId
      }
    })

    // Rezervasyon durumunu güncelle
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CONFIRMED' }
    })

    // Bildirimler oluştur
    await Promise.all([
      // Müşteriye bildirim
      prisma.notification.create({
        data: {
          userId: customerId,
          type: 'PAYMENT',
          title: 'Ödeme Başarılı',
          content: 'Rezervasyon ödemeniz başarıyla alındı.',
          data: { bookingId, escrowId: escrow.id }
        }
      }),
      // Hizmet verene bildirim
      prisma.notification.create({
        data: {
          userId: providerId,
          type: 'PAYMENT',
          title: 'Ödeme Alındı',
          content: 'Rezervasyon ödemesi alındı. Hizmeti başlatabilirsiniz.',
          data: { bookingId, escrowId: escrow.id }
        }
      })
    ])

    console.log(`[WEBHOOK] Payment succeeded: ${paymentIntentId} - ${bookingId}`)
  } catch (error) {
    console.error('[WEBHOOK] Error handling payment_intent.succeeded:', error)
  }
}

// Payment Intent başarısız
async function handlePaymentIntentFailed(paymentIntent: any) {
  try {
    const { id: paymentIntentId, metadata } = paymentIntent
    const { bookingId, customerId } = metadata

    if (!bookingId || !customerId) {
      console.error('[WEBHOOK] Missing metadata in payment_intent.payment_failed')
      return
    }

    // Escrow kaydını güncelle
    const escrow = await prisma.escrow.findFirst({
      where: { stripePaymentIntentId: paymentIntentId }
    })

    if (escrow) {
      await prisma.escrow.update({
        where: { id: escrow.id },
        data: {
          status: 'FAILED',
          failedAt: new Date()
        }
      })
    }

    // Rezervasyon durumunu güncelle
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' }
    })

    // Müşteriye bildirim
    await prisma.notification.create({
      data: {
        userId: customerId,
        type: 'PAYMENT',
        title: 'Ödeme Başarısız',
        content: 'Rezervasyon ödemeniz başarısız oldu. Lütfen tekrar deneyin.',
        data: { bookingId }
      }
    })

    console.log(`[WEBHOOK] Payment failed: ${paymentIntentId} - ${bookingId}`)
  } catch (error) {
    console.error('[WEBHOOK] Error handling payment_intent.payment_failed:', error)
  }
}

// Payment Intent iptal edildi
async function handlePaymentIntentCanceled(paymentIntent: any) {
  try {
    const { id: paymentIntentId, metadata } = paymentIntent
    const { bookingId, customerId } = metadata

    if (!bookingId || !customerId) {
      console.error('[WEBHOOK] Missing metadata in payment_intent.canceled')
      return
    }

    // Escrow kaydını güncelle
    const escrow = await prisma.escrow.findFirst({
      where: { stripePaymentIntentId: paymentIntentId }
    })

    if (escrow) {
      await prisma.escrow.update({
        where: { id: escrow.id },
        data: {
          status: 'CANCELLED',
          cancelledAt: new Date()
        }
      })
    }

    // Rezervasyon durumunu güncelle
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' }
    })

    console.log(`[WEBHOOK] Payment canceled: ${paymentIntentId} - ${bookingId}`)
  } catch (error) {
    console.error('[WEBHOOK] Error handling payment_intent.canceled:', error)
  }
}

// Payment Intent ek aksiyon gerektiriyor
async function handlePaymentIntentRequiresAction(paymentIntent: any) {
  try {
    const { id: paymentIntentId, metadata } = paymentIntent
    const { bookingId, customerId } = metadata

    if (!bookingId || !customerId) {
      console.error('[WEBHOOK] Missing metadata in payment_intent.requires_action')
      return
    }

    // Müşteriye bildirim
    await prisma.notification.create({
      data: {
        userId: customerId,
        type: 'PAYMENT',
        title: 'Ödeme Onayı Gerekli',
        content: 'Ödemenizi tamamlamak için ek onay gerekli.',
        data: { bookingId, paymentIntentId }
      }
    })

    console.log(`[WEBHOOK] Payment requires action: ${paymentIntentId} - ${bookingId}`)
  } catch (error) {
    console.error('[WEBHOOK] Error handling payment_intent.requires_action:', error)
  }
}