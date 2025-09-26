// Gelişmiş analitik sistemi - Rakiplerden daha detaylı
export interface AnalyticsMetric {
  id: string
  name: string
  value: number
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  period: 'daily' | 'weekly' | 'monthly' | 'yearly'
  category: 'revenue' | 'users' | 'bookings' | 'services' | 'engagement'
  icon: string
  color: string
}

export interface UserAnalytics {
  totalUsers: number
  newUsers: number
  activeUsers: number
  userGrowth: number
  userRetention: number
  userSegments: {
    customers: number
    providers: number
    verified: number
    premium: number
  }
  userActivity: {
    dailyActiveUsers: number
    weeklyActiveUsers: number
    monthlyActiveUsers: number
  }
  userEngagement: {
    averageSessionDuration: number
    pagesPerSession: number
    bounceRate: number
    returnRate: number
  }
}

export interface RevenueAnalytics {
  totalRevenue: number
  monthlyRevenue: number
  revenueGrowth: number
  averageOrderValue: number
  revenueByCategory: Record<string, number>
  revenueByPaymentMethod: Record<string, number>
  revenueByRegion: Record<string, number>
  commissionEarned: number
  refunds: number
  chargebacks: number
}

export interface BookingAnalytics {
  totalBookings: number
  completedBookings: number
  cancelledBookings: number
  pendingBookings: number
  bookingGrowth: number
  averageBookingValue: number
  bookingCompletionRate: number
  bookingCancellationRate: number
  bookingsByCategory: Record<string, number>
  bookingsByStatus: Record<string, number>
  bookingsByTime: {
    hourly: Record<string, number>
    daily: Record<string, number>
    weekly: Record<string, number>
    monthly: Record<string, number>
  }
}

export interface ServiceAnalytics {
  totalServices: number
  activeServices: number
  inactiveServices: number
  newServices: number
  serviceGrowth: number
  averageServiceRating: number
  servicesByCategory: Record<string, number>
  topPerformingServices: Array<{
    id: string
    title: string
    category: string
    bookings: number
    revenue: number
    rating: number
  }>
  servicePerformance: {
    averageResponseTime: number
    averageCompletionTime: number
    customerSatisfaction: number
  }
}

export interface EngagementAnalytics {
  totalSessions: number
  averageSessionDuration: number
  pagesPerSession: number
  bounceRate: number
  returnRate: number
  topPages: Array<{
    path: string
    views: number
    uniqueViews: number
    averageTime: number
  }>
  trafficSources: {
    organic: number
    direct: number
    referral: number
    social: number
    paid: number
  }
  deviceBreakdown: {
    desktop: number
    mobile: number
    tablet: number
  }
  browserBreakdown: Record<string, number>
  countryBreakdown: Record<string, number>
}

export interface MarketAnalytics {
  marketShare: number
  competitorAnalysis: Array<{
    name: string
    marketShare: number
    strengths: string[]
    weaknesses: string[]
  }>
  pricingAnalysis: {
    averagePrice: number
    priceRange: {
      min: number
      max: number
    }
    priceCompetitiveness: number
  }
  categoryPerformance: Array<{
    category: string
    demand: number
    supply: number
    averagePrice: number
    growth: number
  }>
}

export class AdvancedAnalytics {
  private data: any

  constructor(data: any) {
    this.data = data
  }

  // Kullanıcı analitikleri
  getUserAnalytics(): UserAnalytics {
    return {
      totalUsers: this.data.users?.total || 0,
      newUsers: this.data.users?.new || 0,
      activeUsers: this.data.users?.active || 0,
      userGrowth: this.calculateGrowth(this.data.users?.previous, this.data.users?.current),
      userRetention: this.calculateRetention(this.data.users?.retention),
      userSegments: {
        customers: this.data.users?.segments?.customers || 0,
        providers: this.data.users?.segments?.providers || 0,
        verified: this.data.users?.segments?.verified || 0,
        premium: this.data.users?.segments?.premium || 0
      },
      userActivity: {
        dailyActiveUsers: this.data.users?.activity?.daily || 0,
        weeklyActiveUsers: this.data.users?.activity?.weekly || 0,
        monthlyActiveUsers: this.data.users?.activity?.monthly || 0
      },
      userEngagement: {
        averageSessionDuration: this.data.users?.engagement?.sessionDuration || 0,
        pagesPerSession: this.data.users?.engagement?.pagesPerSession || 0,
        bounceRate: this.data.users?.engagement?.bounceRate || 0,
        returnRate: this.data.users?.engagement?.returnRate || 0
      }
    }
  }

  // Gelir analitikleri
  getRevenueAnalytics(): RevenueAnalytics {
    return {
      totalRevenue: this.data.revenue?.total || 0,
      monthlyRevenue: this.data.revenue?.monthly || 0,
      revenueGrowth: this.calculateGrowth(this.data.revenue?.previous, this.data.revenue?.current),
      averageOrderValue: this.data.revenue?.averageOrderValue || 0,
      revenueByCategory: this.data.revenue?.byCategory || {},
      revenueByPaymentMethod: this.data.revenue?.byPaymentMethod || {},
      revenueByRegion: this.data.revenue?.byRegion || {},
      commissionEarned: this.data.revenue?.commission || 0,
      refunds: this.data.revenue?.refunds || 0,
      chargebacks: this.data.revenue?.chargebacks || 0
    }
  }

  // Rezervasyon analitikleri
  getBookingAnalytics(): BookingAnalytics {
    return {
      totalBookings: this.data.bookings?.total || 0,
      completedBookings: this.data.bookings?.completed || 0,
      cancelledBookings: this.data.bookings?.cancelled || 0,
      pendingBookings: this.data.bookings?.pending || 0,
      bookingGrowth: this.calculateGrowth(this.data.bookings?.previous, this.data.bookings?.current),
      averageBookingValue: this.data.bookings?.averageValue || 0,
      bookingCompletionRate: this.calculateCompletionRate(this.data.bookings),
      bookingCancellationRate: this.calculateCancellationRate(this.data.bookings),
      bookingsByCategory: this.data.bookings?.byCategory || {},
      bookingsByStatus: this.data.bookings?.byStatus || {},
      bookingsByTime: {
        hourly: this.data.bookings?.byTime?.hourly || {},
        daily: this.data.bookings?.byTime?.daily || {},
        weekly: this.data.bookings?.byTime?.weekly || {},
        monthly: this.data.bookings?.byTime?.monthly || {}
      }
    }
  }

  // Hizmet analitikleri
  getServiceAnalytics(): ServiceAnalytics {
    return {
      totalServices: this.data.services?.total || 0,
      activeServices: this.data.services?.active || 0,
      inactiveServices: this.data.services?.inactive || 0,
      newServices: this.data.services?.new || 0,
      serviceGrowth: this.calculateGrowth(this.data.services?.previous, this.data.services?.current),
      averageServiceRating: this.data.services?.averageRating || 0,
      servicesByCategory: this.data.services?.byCategory || {},
      topPerformingServices: this.data.services?.topPerforming || [],
      servicePerformance: {
        averageResponseTime: this.data.services?.performance?.responseTime || 0,
        averageCompletionTime: this.data.services?.performance?.completionTime || 0,
        customerSatisfaction: this.data.services?.performance?.satisfaction || 0
      }
    }
  }

  // Etkileşim analitikleri
  getEngagementAnalytics(): EngagementAnalytics {
    return {
      totalSessions: this.data.engagement?.sessions || 0,
      averageSessionDuration: this.data.engagement?.sessionDuration || 0,
      pagesPerSession: this.data.engagement?.pagesPerSession || 0,
      bounceRate: this.data.engagement?.bounceRate || 0,
      returnRate: this.data.engagement?.returnRate || 0,
      topPages: this.data.engagement?.topPages || [],
      trafficSources: {
        organic: this.data.engagement?.trafficSources?.organic || 0,
        direct: this.data.engagement?.trafficSources?.direct || 0,
        referral: this.data.engagement?.trafficSources?.referral || 0,
        social: this.data.engagement?.trafficSources?.social || 0,
        paid: this.data.engagement?.trafficSources?.paid || 0
      },
      deviceBreakdown: {
        desktop: this.data.engagement?.devices?.desktop || 0,
        mobile: this.data.engagement?.devices?.mobile || 0,
        tablet: this.data.engagement?.devices?.tablet || 0
      },
      browserBreakdown: this.data.engagement?.browsers || {},
      countryBreakdown: this.data.engagement?.countries || {}
    }
  }

  // Pazar analitikleri
  getMarketAnalytics(): MarketAnalytics {
    return {
      marketShare: this.data.market?.share || 0,
      competitorAnalysis: this.data.market?.competitors || [],
      pricingAnalysis: {
        averagePrice: this.data.market?.pricing?.average || 0,
        priceRange: {
          min: this.data.market?.pricing?.min || 0,
          max: this.data.market?.pricing?.max || 0
        },
        priceCompetitiveness: this.data.market?.pricing?.competitiveness || 0
      },
      categoryPerformance: this.data.market?.categories || []
    }
  }

  // KPI'ları hesapla
  getKPIs(): AnalyticsMetric[] {
    const userAnalytics = this.getUserAnalytics()
    const revenueAnalytics = this.getRevenueAnalytics()
    const bookingAnalytics = this.getBookingAnalytics()
    const serviceAnalytics = this.getServiceAnalytics()

    return [
      {
        id: 'total_revenue',
        name: 'Toplam Gelir',
        value: revenueAnalytics.totalRevenue,
        change: revenueAnalytics.revenueGrowth,
        changeType: this.getChangeType(revenueAnalytics.revenueGrowth),
        period: 'monthly',
        category: 'revenue',
        icon: '💰',
        color: 'green'
      },
      {
        id: 'total_users',
        name: 'Toplam Kullanıcı',
        value: userAnalytics.totalUsers,
        change: userAnalytics.userGrowth,
        changeType: this.getChangeType(userAnalytics.userGrowth),
        period: 'monthly',
        category: 'users',
        icon: '👥',
        color: 'blue'
      },
      {
        id: 'total_bookings',
        name: 'Toplam Rezervasyon',
        value: bookingAnalytics.totalBookings,
        change: bookingAnalytics.bookingGrowth,
        changeType: this.getChangeType(bookingAnalytics.bookingGrowth),
        period: 'monthly',
        category: 'bookings',
        icon: '📅',
        color: 'purple'
      },
      {
        id: 'completion_rate',
        name: 'Tamamlanma Oranı',
        value: bookingAnalytics.bookingCompletionRate,
        change: 0,
        changeType: 'neutral',
        period: 'monthly',
        category: 'bookings',
        icon: '✅',
        color: 'green'
      },
      {
        id: 'average_rating',
        name: 'Ortalama Puan',
        value: serviceAnalytics.averageServiceRating,
        change: 0,
        changeType: 'neutral',
        period: 'monthly',
        category: 'services',
        icon: '⭐',
        color: 'yellow'
      },
      {
        id: 'active_services',
        name: 'Aktif Hizmet',
        value: serviceAnalytics.activeServices,
        change: serviceAnalytics.serviceGrowth,
        changeType: this.getChangeType(serviceAnalytics.serviceGrowth),
        period: 'monthly',
        category: 'services',
        icon: '🔧',
        color: 'orange'
      }
    ]
  }

  // Büyüme hesapla
  private calculateGrowth(previous: number, current: number): number {
    if (!previous || previous === 0) return 0
    return ((current - previous) / previous) * 100
  }

  // Değişim tipini belirle
  private getChangeType(change: number): 'increase' | 'decrease' | 'neutral' {
    if (change > 0) return 'increase'
    if (change < 0) return 'decrease'
    return 'neutral'
  }

  // Tamamlanma oranını hesapla
  private calculateCompletionRate(bookings: any): number {
    if (!bookings?.total || bookings.total === 0) return 0
    return (bookings.completed / bookings.total) * 100
  }

  // İptal oranını hesapla
  private calculateCancellationRate(bookings: any): number {
    if (!bookings?.total || bookings.total === 0) return 0
    return (bookings.cancelled / bookings.total) * 100
  }

  // Geri dönüş oranını hesapla
  private calculateRetention(retention: any): number {
    return retention || 0
  }

  // Trend analizi
  getTrendAnalysis(metric: string, period: 'daily' | 'weekly' | 'monthly'): {
    trend: 'up' | 'down' | 'stable'
    strength: 'weak' | 'moderate' | 'strong'
    forecast: number[]
  } {
    // Basit trend analizi implementasyonu
    const data = this.data.trends?.[metric]?.[period] || []
    const recent = data.slice(-7)
    const previous = data.slice(-14, -7)
    
    const recentAvg = recent.reduce((a: number, b: number) => a + b, 0) / recent.length
    const previousAvg = previous.reduce((a: number, b: number) => a + b, 0) / previous.length
    
    const change = ((recentAvg - previousAvg) / previousAvg) * 100
    
    let trend: 'up' | 'down' | 'stable' = 'stable'
    let strength: 'weak' | 'moderate' | 'strong' = 'weak'
    
    if (Math.abs(change) > 10) {
      trend = change > 0 ? 'up' : 'down'
      strength = Math.abs(change) > 25 ? 'strong' : 'moderate'
    }
    
    // Basit tahmin (son 3 değerin ortalaması)
    const forecast = recent.slice(-3).map((value: number) => value * 1.1)
    
    return { trend, strength, forecast }
  }

  // Anomali tespiti
  detectAnomalies(metric: string): Array<{
    date: string
    value: number
    expected: number
    deviation: number
    severity: 'low' | 'medium' | 'high'
  }> {
    const data = this.data.metrics?.[metric] || []
    const anomalies = []
    
    for (let i = 7; i < data.length; i++) {
      const recent = data.slice(i - 7, i)
      const average = recent.reduce((a: number, b: number) => a + b, 0) / recent.length
      const current = data[i]
      const deviation = Math.abs(current - average) / average
      
      if (deviation > 0.3) {
        anomalies.push({
          date: new Date(Date.now() - (data.length - i) * 24 * 60 * 60 * 1000).toISOString(),
          value: current,
          expected: average,
          deviation: deviation * 100,
          severity: deviation > 0.5 ? 'high' : deviation > 0.4 ? 'medium' : 'low'
        })
      }
    }
    
    return anomalies
  }
}

