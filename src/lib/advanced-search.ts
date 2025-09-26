// Gelişmiş arama ve filtreleme sistemi - Rakiplerden daha kapsamlı
export interface SearchFilters {
  query?: string
  category?: string
  subcategory?: string
  location?: string
  radius?: number // km
  priceMin?: number
  priceMax?: number
  rating?: number
  availability?: string[]
  features?: string[]
  urgency?: 'normal' | 'urgent' | 'emergency'
  experience?: 'beginner' | 'intermediate' | 'expert' | 'master'
  languages?: string[]
  verified?: boolean
  premium?: boolean
  insurance?: boolean
  warranty?: boolean
  responseTime?: number // dakika
  completionRate?: number // yüzde
  sortBy?: 'relevance' | 'price' | 'rating' | 'distance' | 'availability' | 'experience'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface SearchResult {
  id: string
  title: string
  description: string
  category: string
  subcategory?: string
  price: number
  priceType: string
  rating: number
  reviewCount: number
  location: string
  distance?: number
  provider: {
    id: string
    name: string
    image?: string
    rating: number
    reviewCount: number
    isVerified: boolean
    experience: number
    responseTime: number
    completionRate: number
  }
  features: string[]
  availability: string[]
  images: string[]
  aiScore?: number
  reason?: string
  isUrgent: boolean
  isPremium: boolean
  isPackage: boolean
  warranty?: number
  insurance: boolean
  responseTime: number
  completionRate: number
  lastBooked?: string
  createdAt: string
}

// Gelişmiş arama algoritması
export class AdvancedSearchEngine {
  private services: any[]
  private userLocation?: { lat: number; lng: number }

  constructor(services: any[], userLocation?: { lat: number; lng: number }) {
    this.services = services
    this.userLocation = userLocation
  }

  search(filters: SearchFilters): SearchResult[] {
    let results = [...this.services]

    // Metin araması
    if (filters.query) {
      results = this.textSearch(results, filters.query)
    }

    // Kategori filtresi
    if (filters.category) {
      results = results.filter(service => service.category === filters.category)
    }

    // Alt kategori filtresi
    if (filters.subcategory) {
      results = results.filter(service => service.subcategory === filters.subcategory)
    }

    // Konum filtresi
    if (filters.location || filters.radius) {
      results = this.locationFilter(results, filters.location, filters.radius)
    }

    // Fiyat filtresi
    if (filters.priceMin !== undefined || filters.priceMax !== undefined) {
      results = this.priceFilter(results, filters.priceMin, filters.priceMax)
    }

    // Puan filtresi
    if (filters.rating) {
      results = results.filter(service => service.rating >= filters.rating)
    }

    // Özellik filtresi
    if (filters.features && filters.features.length > 0) {
      results = this.featureFilter(results, filters.features)
    }

    // Aciliyet filtresi
    if (filters.urgency) {
      results = this.urgencyFilter(results, filters.urgency)
    }

    // Deneyim filtresi
    if (filters.experience) {
      results = this.experienceFilter(results, filters.experience)
    }

    // Dil filtresi
    if (filters.languages && filters.languages.length > 0) {
      results = this.languageFilter(results, filters.languages)
    }

    // Doğrulanmış filtresi
    if (filters.verified) {
      results = results.filter(service => service.isVerified)
    }

    // Premium filtresi
    if (filters.premium) {
      results = results.filter(service => service.isPremium)
    }

    // Sigorta filtresi
    if (filters.insurance) {
      results = results.filter(service => service.insurance)
    }

    // Garanti filtresi
    if (filters.warranty) {
      results = results.filter(service => service.warranty && service.warranty >= filters.warranty)
    }

    // Yanıt süresi filtresi
    if (filters.responseTime) {
      results = results.filter(service => service.responseTime <= filters.responseTime)
    }

    // Tamamlanma oranı filtresi
    if (filters.completionRate) {
      results = results.filter(service => service.completionRate >= filters.completionRate)
    }

    // AI skorlama
    results = this.calculateAIScores(results, filters)

    // Sıralama
    results = this.sortResults(results, filters.sortBy, filters.sortOrder)

    // Sayfalama
    const page = filters.page || 1
    const limit = filters.limit || 20
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit

    return results.slice(startIndex, endIndex)
  }

  private textSearch(services: any[], query: string): any[] {
    const searchTerms = query.toLowerCase().split(' ')
    
    return services.filter(service => {
      const searchableText = [
        service.title,
        service.description,
        service.tags,
        service.category,
        service.subcategory,
        service.provider?.name
      ].join(' ').toLowerCase()

      return searchTerms.every(term => searchableText.includes(term))
    })
  }

  private locationFilter(services: any[], location?: string, radius?: number): any[] {
    if (!location && !radius) return services

    return services.filter(service => {
      if (service.location && location) {
        // Basit konum eşleştirmesi (gerçek uygulamada mesafe hesaplaması yapılmalı)
        return service.location.toLowerCase().includes(location.toLowerCase())
      }
      return true
    })
  }

  private priceFilter(services: any[], min?: number, max?: number): any[] {
    return services.filter(service => {
      if (min !== undefined && service.price < min) return false
      if (max !== undefined && service.price > max) return false
      return true
    })
  }

  private featureFilter(services: any[], features: string[]): any[] {
    return services.filter(service => {
      const serviceFeatures = service.tags?.split(',').map((tag: string) => tag.trim()) || []
      return features.every(feature => 
        serviceFeatures.some((serviceFeature: string) => 
          serviceFeature.toLowerCase().includes(feature.toLowerCase())
        )
      )
    })
  }

  private urgencyFilter(services: any[], urgency: string): any[] {
    switch (urgency) {
      case 'urgent':
        return services.filter(service => service.isUrgent)
      case 'emergency':
        return services.filter(service => service.isUrgent && service.responseTime <= 30)
      default:
        return services
    }
  }

  private experienceFilter(services: any[], experience: string): any[] {
    const experienceMap = {
      'beginner': 0,
      'intermediate': 2,
      'expert': 5,
      'master': 10
    }

    const minExperience = experienceMap[experience as keyof typeof experienceMap] || 0
    
    return services.filter(service => 
      service.provider?.experience >= minExperience
    )
  }

  private languageFilter(services: any[], languages: string[]): any[] {
    return services.filter(service => {
      const serviceLanguages = service.languages?.split(',').map((lang: string) => lang.trim()) || []
      return languages.some(lang => 
        serviceLanguages.some((serviceLang: string) => 
          serviceLang.toLowerCase().includes(lang.toLowerCase())
        )
      )
    })
  }

  private calculateAIScores(services: any[], filters: SearchFilters): any[] {
    return services.map(service => {
      let score = 0

      // Temel skorlar
      score += service.rating * 20 // 0-100 puan
      score += Math.min(service.reviewCount * 2, 50) // Maksimum 50 puan
      score += service.isVerified ? 10 : 0
      score += service.isPremium ? 15 : 0
      score += service.completionRate ? service.completionRate * 10 : 0

      // Yanıt süresi bonusu
      if (service.responseTime && service.responseTime < 60) {
        score += 10
      }

      // Aciliyet bonusu
      if (filters.urgency === 'urgent' && service.isUrgent) {
        score += 20
      }

      // Paket varlığı bonusu
      if (service.packages && service.packages.length > 0) {
        score += 5
      }

      // Deneyim bonusu
      if (service.provider?.experience) {
        score += Math.min(service.provider.experience * 2, 20)
      }

      // Fiyat uygunluğu
      if (filters.priceMax && service.price <= filters.priceMax) {
        score += 10
      }

      return {
        ...service,
        aiScore: Math.min(score, 100),
        reason: this.getRecommendationReason(service, filters)
      }
    })
  }

  private getRecommendationReason(service: any, filters: SearchFilters): string {
    const reasons = []

    if (service.rating >= 4.5) {
      reasons.push('Yüksek puanlı')
    }

    if (service.reviewCount >= 50) {
      reasons.push('Çok değerlendirilmiş')
    }

    if (service.isVerified) {
      reasons.push('Doğrulanmış')
    }

    if (service.isPremium) {
      reasons.push('Premium hizmet')
    }

    if (service.completionRate && service.completionRate >= 95) {
      reasons.push('Yüksek tamamlanma oranı')
    }

    if (service.responseTime && service.responseTime < 30) {
      reasons.push('Hızlı yanıt')
    }

    if (service.insurance) {
      reasons.push('Sigortalı')
    }

    if (service.warranty) {
      reasons.push(`${service.warranty} gün garanti`)
    }

    return reasons.join(', ') || 'Kaliteli hizmet'
  }

  private sortResults(services: any[], sortBy?: string, sortOrder?: string): any[] {
    const order = sortOrder === 'desc' ? -1 : 1

    switch (sortBy) {
      case 'price':
        return services.sort((a, b) => (a.price - b.price) * order)
      case 'rating':
        return services.sort((a, b) => (a.rating - b.rating) * order)
      case 'distance':
        return services.sort((a, b) => ((a.distance || 0) - (b.distance || 0)) * order)
      case 'availability':
        return services.sort((a, b) => (a.availability?.length || 0) - (b.availability?.length || 0) * order)
      case 'experience':
        return services.sort((a, b) => ((a.provider?.experience || 0) - (b.provider?.experience || 0)) * order)
      default: // relevance
        return services.sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0))
    }
  }
}

// Arama önerileri
export const getSearchSuggestions = (query: string, categories: any[]) => {
  const suggestions = []
  
  // Kategori önerileri
  categories.forEach(category => {
    if (category.name.toLowerCase().includes(query.toLowerCase())) {
      suggestions.push({
        type: 'category',
        text: category.name,
        icon: category.icon
      })
    }
  })

  // Popüler aramalar
  const popularSearches = [
    'Ev temizliği',
    'Elektrik tamiri',
    'Su tesisatı',
    'Boyama',
    'Mobilya montajı',
    'Nakliyat',
    'Teknik destek',
    'Güzellik hizmetleri'
  ]

  popularSearches.forEach(search => {
    if (search.toLowerCase().includes(query.toLowerCase())) {
      suggestions.push({
        type: 'popular',
        text: search,
        icon: '🔥'
      })
    }
  })

  return suggestions.slice(0, 5)
}

