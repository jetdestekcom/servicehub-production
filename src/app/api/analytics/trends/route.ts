import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET - Trend-Analyse
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Nur Admins können Trend-Analysen sehen
    if (session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30d' // 7d, 30d, 90d, 1y

    // Zeitraum berechnen
    const now = new Date()
    let startDate = new Date()
    
    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '90d':
        startDate.setDate(now.getDate() - 90)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    // Benutzer-Trends
    const userTrends = await prisma.user.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: startDate }
      },
      _count: { id: true }
    })

    // Service-Trends
    const serviceTrends = await prisma.service.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: startDate },
        isActive: true
      },
      _count: { id: true }
    })

    // Buchungs-Trends
    const bookingTrends = await prisma.booking.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: startDate }
      },
      _count: { id: true },
      _sum: { totalPrice: true }
    })

    // Kategorie-Trends
    const categoryTrends = await prisma.service.groupBy({
      by: ['category'],
      where: {
        createdAt: { gte: startDate },
        isActive: true
      },
      _count: { category: true }
    })

    // Bewertungs-Trends
    const reviewTrends = await prisma.review.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: startDate }
      },
      _count: { id: true },
      _avg: { rating: true }
    })

    // Tägliche Aktivität (letzte 30 Tage)
    const dailyActivity = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      date.setHours(0, 0, 0, 0)
      
      const nextDate = new Date(date)
      nextDate.setDate(nextDate.getDate() + 1)

      const [users, services, bookings, revenue] = await Promise.all([
        prisma.user.count({
          where: {
            createdAt: { gte: date, lt: nextDate }
          }
        }),
        prisma.service.count({
          where: {
            createdAt: { gte: date, lt: nextDate },
            isActive: true
          }
        }),
        prisma.booking.count({
          where: {
            createdAt: { gte: date, lt: nextDate }
          }
        }),
        prisma.booking.aggregate({
          where: {
            createdAt: { gte: date, lt: nextDate },
            status: 'COMPLETED'
          },
          _sum: { totalPrice: true }
        })
      ])

      dailyActivity.push({
        date: date.toISOString().split('T')[0],
        users,
        services,
        bookings,
        revenue: revenue._sum.totalPrice || 0
      })
    }

    // Wachstumsraten berechnen
    const calculateGrowthRate = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0
      return Math.round(((current - previous) / previous) * 100)
    }

    const currentPeriod = dailyActivity.slice(-7) // Letzte 7 Tage
    const previousPeriod = dailyActivity.slice(-14, -7) // Vorherige 7 Tage

    const currentUsers = currentPeriod.reduce((sum, day) => sum + day.users, 0)
    const previousUsers = previousPeriod.reduce((sum, day) => sum + day.users, 0)
    
    const currentServices = currentPeriod.reduce((sum, day) => sum + day.services, 0)
    const previousServices = previousPeriod.reduce((sum, day) => sum + day.services, 0)
    
    const currentBookings = currentPeriod.reduce((sum, day) => sum + day.bookings, 0)
    const previousBookings = previousPeriod.reduce((sum, day) => sum + day.bookings, 0)
    
    const currentRevenue = currentPeriod.reduce((sum, day) => sum + day.revenue, 0)
    const previousRevenue = previousPeriod.reduce((sum, day) => sum + day.revenue, 0)

    return NextResponse.json({
      success: true,
      data: {
        period,
        dailyActivity,
        growthRates: {
          users: calculateGrowthRate(currentUsers, previousUsers),
          services: calculateGrowthRate(currentServices, previousServices),
          bookings: calculateGrowthRate(currentBookings, previousBookings),
          revenue: calculateGrowthRate(currentRevenue, previousRevenue)
        },
        categoryTrends: categoryTrends.map(cat => ({
          category: cat.category,
          count: cat._count.category
        })),
        reviewTrends: reviewTrends.map(review => ({
          date: review.createdAt,
          count: review._count.id,
          averageRating: review._avg.rating
        }))
      }
    })

  } catch (error) {
    console.error('Trends analysis error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch trends analysis' 
    }, { status: 500 })
  }
}

