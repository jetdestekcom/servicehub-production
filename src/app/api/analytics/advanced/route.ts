import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { AdvancedAnalytics } from '@/lib/advanced-analytics'

// Gelişmiş analitik verileri
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'monthly'
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // Tarih aralığını hesapla
    const now = new Date()
    const start = startDate ? new Date(startDate) : getStartDate(period, now)
    const end = endDate ? new Date(endDate) : now

    // Kullanıcı verileri
    const users = await prisma.user.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end
        }
      },
      include: {
        services: true,
        bookings: true
      }
    })

    // Rezervasyon verileri
    const bookings = await prisma.booking.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end
        }
      },
      include: {
        service: true,
        customer: true
      }
    })

    // Hizmet verileri
    const services = await prisma.service.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end
        }
      },
      include: {
        provider: true,
        bookings: true,
        reviews: true
      }
    })

    // Gelir verileri
    const revenue = bookings.reduce((total, booking) => total + booking.totalAmount, 0)

    // Analitik verilerini hazırla
    const analyticsData = {
      users: {
        total: users.length,
        new: users.filter(u => u.createdAt >= start).length,
        active: users.filter(u => u.lastActive && u.lastActive >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length,
        segments: {
          customers: users.filter(u => u.role === 'CUSTOMER').length,
          providers: users.filter(u => u.role === 'PROVIDER').length,
          verified: users.filter(u => u.isVerified).length,
          premium: users.filter(u => u.isPremium).length
        }
      },
      bookings: {
        total: bookings.length,
        completed: bookings.filter(b => b.status === 'COMPLETED').length,
        cancelled: bookings.filter(b => b.status === 'CANCELLED').length,
        pending: bookings.filter(b => b.status === 'PENDING').length,
        averageValue: bookings.length > 0 ? revenue / bookings.length : 0
      },
      services: {
        total: services.length,
        active: services.filter(s => s.isActive).length,
        inactive: services.filter(s => !s.isActive).length,
        averageRating: services.length > 0 ? services.reduce((sum, s) => sum + s.rating, 0) / services.length : 0
      },
      revenue: {
        total: revenue,
        monthly: revenue,
        averageOrderValue: bookings.length > 0 ? revenue / bookings.length : 0
      }
    }

    // Gelişmiş analitik hesaplamaları
    const analytics = new AdvancedAnalytics(analyticsData)
    
    const result = {
      period,
      startDate: start,
      endDate: end,
      userAnalytics: analytics.getUserAnalytics(),
      revenueAnalytics: analytics.getRevenueAnalytics(),
      bookingAnalytics: analytics.getBookingAnalytics(),
      serviceAnalytics: analytics.getServiceAnalytics(),
      kpis: analytics.getKPIs(),
      trends: {
        userGrowth: calculateTrend(users, 'createdAt', period),
        revenueGrowth: calculateTrend(bookings, 'createdAt', period),
        bookingGrowth: calculateTrend(bookings, 'createdAt', period)
      }
    }

    return NextResponse.json({ success: true, data: result })
  } catch (error) {
    console.error('Analitik veri hatası:', error)
    return NextResponse.json({ error: 'Analitik veriler yüklenemedi' }, { status: 500 })
  }
}

// Yardımcı fonksiyonlar
function getStartDate(period: string, date: Date): Date {
  switch (period) {
    case 'daily':
      return new Date(date.getFullYear(), date.getMonth(), date.getDate())
    case 'weekly':
      const weekStart = new Date(date)
      weekStart.setDate(date.getDate() - date.getDay())
      return new Date(weekStart.getFullYear(), weekStart.getMonth(), weekStart.getDate())
    case 'monthly':
      return new Date(date.getFullYear(), date.getMonth(), 1)
    case 'yearly':
      return new Date(date.getFullYear(), 0, 1)
    default:
      return new Date(date.getFullYear(), date.getMonth(), 1)
  }
}

function calculateTrend(data: any[], field: string, period: string): number {
  if (data.length < 2) return 0

  const now = new Date()
  const currentPeriod = getStartDate(period, now)
  const previousPeriod = getStartDate(period, new Date(currentPeriod.getTime() - getPeriodDuration(period)))

  const currentCount = data.filter(item => 
    new Date(item[field]) >= currentPeriod
  ).length

  const previousCount = data.filter(item => 
    new Date(item[field]) >= previousPeriod && 
    new Date(item[field]) < currentPeriod
  ).length

  if (previousCount === 0) return 0
  return ((currentCount - previousCount) / previousCount) * 100
}

function getPeriodDuration(period: string): number {
  switch (period) {
    case 'daily':
      return 24 * 60 * 60 * 1000
    case 'weekly':
      return 7 * 24 * 60 * 60 * 1000
    case 'monthly':
      return 30 * 24 * 60 * 60 * 1000
    case 'yearly':
      return 365 * 24 * 60 * 60 * 1000
    default:
      return 30 * 24 * 60 * 60 * 1000
  }
}