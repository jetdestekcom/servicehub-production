import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { withSecurity } from '@/lib/api-middleware'

async function getDashboardBookings(request: NextRequest, context: any) {
  const userId = context.user.id

  try {
    // Get user's services
    const userServices = await prisma.service.findMany({
      where: { providerId: userId },
      select: { id: true }
    })
    
    const serviceIds = userServices.map(service => service.id)

    // Get bookings with related data
    const bookings = await prisma.booking.findMany({
      where: { serviceId: { in: serviceIds } },
      include: {
        service: {
          select: {
            title: true,
            price: true
          }
        },
        customer: {
          select: {
            name: true,
            image: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    })

    // Format bookings for frontend
    const formattedBookings = bookings.map(booking => ({
      id: booking.id,
      serviceName: booking.service.title,
      customerName: booking.customer.name || 'Anonim',
      customerAvatar: booking.customer.image || '/api/placeholder/32/32',
      date: booking.startDate.toLocaleDateString('tr-TR'),
      time: booking.startDate.toLocaleTimeString('tr-TR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      status: booking.status.toLowerCase(),
      price: booking.totalPrice,
      location: booking.service.title // You might want to add location to service
    }))

    return NextResponse.json(formattedBookings)

  } catch (error) {
    console.error('Dashboard bookings error:', error)
    return NextResponse.json(
      { error: 'Rezervasyonlar alınamadı' },
      { status: 500 }
    )
  }
}

export const GET = withSecurity(getDashboardBookings, {
  requireAuth: true,
  rateLimit: true
})