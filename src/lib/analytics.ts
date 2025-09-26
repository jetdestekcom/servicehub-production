import { prisma } from './prisma'

export interface AnalyticsData {
  overview: {
    totalUsers: number
    totalServices: number
    totalBookings: number
    totalRevenue: number
    activeUsers: number
    conversionRate: number
  }
  userGrowth: {
    period: string
    count: number
  }[]
  revenue: {
    period: string
    amount: number
  }[]
  topServices: {
    id: string
    title: string
    category: string
    bookings: number
    revenue: number
    rating: number
  }[]
  topCategories: {
    category: string
    count: number
    revenue: number
  }[]
  bookingStatus: {
    status: string
    count: number
    percentage: number
  }[]
  recentActivity: {
    id: string
    type: 'user' | 'service' | 'booking' | 'review'
    description: string
    timestamp: string
  }[]
}

export async function getAnalyticsData(
  startDate?: Date,
  endDate?: Date
): Promise<AnalyticsData> {
  try {
    const now = new Date()
    const defaultStartDate = startDate || new Date(now.getFullYear(), now.getMonth(), 1)
    const defaultEndDate = endDate || now

    // Overview data
    const [
      totalUsers,
      totalServices,
      totalBookings,
      totalRevenue,
      activeUsers
    ] = await Promise.all([
      prisma.user.count(),
      prisma.service.count({ where: { isActive: true } }),
      prisma.booking.count(),
      prisma.booking.aggregate({
        _sum: { totalAmount: true },
        where: { status: 'COMPLETED' }
      }),
      prisma.user.count({
        where: {
          updatedAt: {
            gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        }
      })
    ])

    const conversionRate = totalUsers > 0 ? (totalBookings / totalUsers) * 100 : 0

    // User growth (last 12 months)
    const userGrowth = await getUserGrowthData(defaultStartDate, defaultEndDate)

    // Revenue data (last 12 months)
    const revenue = await getRevenueData(defaultStartDate, defaultEndDate)

    // Top services
    const topServices = await getTopServicesData(defaultStartDate, defaultEndDate)

    // Top categories
    const topCategories = await getTopCategoriesData(defaultStartDate, defaultEndDate)

    // Booking status distribution
    const bookingStatus = await getBookingStatusData()

    // Recent activity
    const recentActivity = await getRecentActivityData()

    return {
      overview: {
        totalUsers,
        totalServices,
        totalBookings,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        activeUsers,
        conversionRate: Math.round(conversionRate * 100) / 100
      },
      userGrowth,
      revenue,
      topServices,
      topCategories,
      bookingStatus,
      recentActivity
    }
  } catch (error) {
    console.error('Analytics data fetch error:', error)
    throw error
  }
}

async function getUserGrowthData(startDate: Date, endDate: Date) {
  const months = []
  const current = new Date(startDate)
  
  while (current <= endDate) {
    const monthStart = new Date(current.getFullYear(), current.getMonth(), 1)
    const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0)
    
    const count = await prisma.user.count({
      where: {
        createdAt: {
          gte: monthStart,
          lte: monthEnd
        }
      }
    })
    
    months.push({
      period: current.toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' }),
      count
    })
    
    current.setMonth(current.getMonth() + 1)
  }
  
  return months
}

async function getRevenueData(startDate: Date, endDate: Date) {
  const months = []
  const current = new Date(startDate)
  
  while (current <= endDate) {
    const monthStart = new Date(current.getFullYear(), current.getMonth(), 1)
    const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0)
    
    const result = await prisma.booking.aggregate({
      _sum: { totalAmount: true },
      where: {
        status: 'COMPLETED',
        createdAt: {
          gte: monthStart,
          lte: monthEnd
        }
      }
    })
    
    months.push({
      period: current.toLocaleDateString('tr-TR', { month: 'short', year: 'numeric' }),
      amount: result._sum.totalAmount || 0
    })
    
    current.setMonth(current.getMonth() + 1)
  }
  
  return months
}

async function getTopServicesData(startDate: Date, endDate: Date) {
  const services = await prisma.service.findMany({
    where: {
      isActive: true,
      bookings: {
        some: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      }
    },
    include: {
      bookings: {
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      }
    },
    orderBy: {
      bookings: {
        _count: 'desc'
      }
    },
    take: 10
  })

  return services.map(service => ({
    id: service.id,
    title: service.title,
    category: service.category,
    bookings: service.bookings.length,
    revenue: service.bookings.reduce((sum, booking) => sum + booking.totalAmount, 0),
    rating: service.rating
  }))
}

async function getTopCategoriesData(startDate: Date, endDate: Date) {
  // First get services grouped by category
  const categories = await prisma.service.groupBy({
    by: ['category'],
    where: {
      isActive: true
    },
    _count: {
      id: true
    }
  })

  // Then get booking revenue for each category
  const categoryRevenue = await Promise.all(
    categories.map(async (category) => {
      const revenue = await prisma.booking.aggregate({
        _sum: { totalAmount: true },
        where: {
          service: { category: category.category },
          status: 'COMPLETED',
          createdAt: {
            gte: startDate,
            lte: endDate
          }
        }
      })
      
      return {
        category: category.category,
        count: category._count.id,
        revenue: revenue._sum.totalAmount || 0
      }
    })
  )

  return categoryRevenue.sort((a, b) => b.count - a.count)
}

async function getBookingStatusData() {
  const statuses = await prisma.booking.groupBy({
    by: ['status'],
    _count: {
      id: true
    }
  })

  const total = statuses.reduce((sum, status) => sum + status._count.id, 0)

  return statuses.map(status => ({
    status: status.status,
    count: status._count.id,
    percentage: total > 0 ? Math.round((status._count.id / total) * 100) : 0
  }))
}

async function getRecentActivityData() {
  const activities: { id: string; type: 'user' | 'service' | 'booking' | 'review'; description: string; timestamp: string }[] = []

  // Recent users
  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      createdAt: true
    }
  })

  recentUsers.forEach(user => {
    activities.push({
      id: `user-${user.id}`,
      type: 'user' as const,
      description: `Yeni kullanıcı kaydı: ${user.name}`,
      timestamp: user.createdAt.toISOString()
    })
  })

  // Recent services
  const recentServices = await prisma.service.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      createdAt: true
    }
  })

  recentServices.forEach(service => {
    activities.push({
      id: `service-${service.id}`,
      type: 'service' as const,
      description: `Yeni hizmet eklendi: ${service.title}`,
      timestamp: service.createdAt.toISOString()
    })
  })

  // Recent bookings
  const recentBookings = await prisma.booking.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      status: true,
      totalAmount: true,
      createdAt: true,
      service: {
        select: {
          title: true
        }
      }
    }
  })

  recentBookings.forEach(booking => {
    activities.push({
      id: `booking-${booking.id}`,
      type: 'booking' as const,
      description: `Yeni rezervasyon: ${booking.service.title} (₺${booking.totalAmount})`,
      timestamp: booking.createdAt.toISOString()
    })
  })

  // Recent reviews
  const recentReviews = await prisma.review.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      rating: true,
      createdAt: true,
      service: {
        select: {
          title: true
        }
      }
    }
  })

  recentReviews.forEach(review => {
    activities.push({
      id: `review-${review.id}`,
      type: 'review' as const,
      description: `Yeni değerlendirme: ${review.service.title} (${review.rating} yıldız)`,
      timestamp: review.createdAt.toISOString()
    })
  })

  // Sort by timestamp and take the most recent 20
  return activities
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 20)
}

export async function trackEvent(
  userId: string,
  event: string,
  properties?: Record<string, unknown>
) {
  try {
    // In a real app, you'd send this to an analytics service like Mixpanel, Amplitude, etc.
    console.log('Analytics Event:', { userId, event, properties, timestamp: new Date() })
    
    // For now, we'll just log it
    // In production, you'd want to:
    // 1. Send to analytics service
    // 2. Store in database for custom analytics
    // 3. Send to monitoring service
    
    return true
  } catch (error) {
    console.error('Event tracking error:', error)
    return false
  }
}

export async function trackPageView(
  userId: string,
  page: string,
  properties?: Record<string, unknown>
) {
  return trackEvent(userId, 'page_view', { page, ...properties })
}

export async function trackServiceView(
  userId: string,
  serviceId: string,
  properties?: Record<string, unknown>
) {
  return trackEvent(userId, 'service_view', { serviceId, ...properties })
}

export async function trackBookingCreated(
  userId: string,
  bookingId: string,
  serviceId: string,
  amount: number
) {
  return trackEvent(userId, 'booking_created', { 
    bookingId, 
    serviceId, 
    amount,
    currency: 'TRY'
  })
}

export async function trackReviewSubmitted(
  userId: string,
  reviewId: string,
  serviceId: string,
  rating: number
) {
  return trackEvent(userId, 'review_submitted', { 
    reviewId, 
    serviceId, 
    rating 
  })
}
