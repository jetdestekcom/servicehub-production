import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

// Escrow ödeme oluştur
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { 
      bookingId, 
      amount, 
      currency = 'TRY',
      description,
      metadata = {}
    }: {
      bookingId: string;
      amount: number;
      currency?: string;
      description?: string;
      metadata?: Record<string, unknown>;
    } = await request.json()

    // Booking'i kontrol et
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        service: {
          include: {
            provider: true
          }
        },
        customer: true
      }
    })

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    if (booking.customerId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Stripe Payment Intent oluştur
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Kuruş cinsinden
      currency: currency.toLowerCase(),
      description: description || `Hizmet: ${booking.service.title}`,
      metadata: {
        bookingId,
        serviceId: booking.service.id,
        providerId: booking.service.providerId,
        customerId: booking.customerId,
        type: 'escrow',
        ...metadata
      },
      automatic_payment_methods: {
        enabled: true
      },
      capture_method: 'manual' // Manuel yakalama (escrow için)
    })

    // Escrow kaydı oluştur
    const escrow = await prisma.escrow.create({
      data: {
        bookingId,
        paymentIntentId: paymentIntent.id,
        amount,
        currency,
        status: 'PENDING',
        customerId: booking.customerId,
        providerId: booking.service.providerId,
        description
      }
    })

    return NextResponse.json({
      success: true,
      escrowId: escrow.id,
      clientSecret: paymentIntent.client_secret,
      message: 'Escrow payment created successfully'
    })

  } catch (error) {
    console.error('Escrow creation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Escrow ödemeyi serbest bırak
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { escrowId, action } = await request.json()

    const escrow = await prisma.escrow.findUnique({
      where: { id: escrowId },
      include: {
        booking: {
          include: {
            service: true
          }
        }
      }
    })

    if (!escrow) {
      return NextResponse.json({ error: 'Escrow not found' }, { status: 404 })
    }

    // Yetki kontrolü
    if (escrow.customerId !== session.user.id && escrow.providerId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (escrow.status !== 'PENDING') {
      return NextResponse.json({ error: 'Escrow already processed' }, { status: 400 })
    }

    let newStatus: string
    let stripeAction: string

    switch (action) {
      case 'release':
        newStatus = 'RELEASED'
        stripeAction = 'capture'
        break
      case 'refund':
        newStatus = 'REFUNDED'
        stripeAction = 'cancel'
        break
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Stripe işlemi
    if (stripeAction === 'capture') {
      await stripe.paymentIntents.capture(escrow.paymentIntentId)
    } else if (stripeAction === 'cancel') {
      await stripe.paymentIntents.cancel(escrow.paymentIntentId)
    }

    // Escrow durumunu güncelle
    const updatedEscrow = await prisma.escrow.update({
      where: { id: escrowId },
      data: {
        status: newStatus as 'PENDING' | 'RELEASED' | 'REFUNDED' | 'DISPUTED',
        processedAt: new Date(),
        processedBy: session.user.id
      }
    })

    // Booking durumunu güncelle
    if (action === 'release') {
      await prisma.booking.update({
        where: { id: escrow.bookingId },
        data: {
          status: 'COMPLETED'
        }
      })
    }

    // Bildirim gönder
    const notificationUserId = action === 'release' ? escrow.providerId : escrow.customerId
    await prisma.notification.create({
      data: {
        userId: notificationUserId,
        type: 'PAYMENT',
        title: action === 'release' ? 'Ödeme Serbest Bırakıldı' : 'Ödeme İade Edildi',
        content: action === 'release' 
          ? 'Escrow ödemeniz serbest bırakıldı.' 
          : 'Escrow ödemeniz iade edildi.',
        data: JSON.stringify({ escrowId, action })
      }
    })

    return NextResponse.json({
      success: true,
      escrow: updatedEscrow,
      message: `Escrow ${action === 'release' ? 'released' : 'refunded'} successfully`
    })

  } catch (error) {
    console.error('Escrow processing error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
