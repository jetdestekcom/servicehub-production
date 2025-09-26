// Gelişmiş fiyatlandırma modelleri - Rakiplerden daha esnek
export const PRICING_MODELS = {
  FIXED: {
    id: 'FIXED',
    name: 'Sabit Fiyat',
    description: 'Hizmet için önceden belirlenmiş sabit fiyat',
    icon: '💰',
    features: ['Şeffaf fiyatlandırma', 'Önceden bilinen maliyet', 'Sürpriz yok']
  },
  HOURLY: {
    id: 'HOURLY',
    name: 'Saatlik',
    description: 'Saat başına ücretlendirme',
    icon: '⏰',
    features: ['Esnek süre', 'Gerçek zamanlı takip', 'Adil ücretlendirme']
  },
  DAILY: {
    id: 'DAILY',
    name: 'Günlük',
    description: 'Gün başına ücretlendirme',
    icon: '📅',
    features: ['Tam gün hizmet', 'Sabit günlük ücret', 'Uzun süreli projeler']
  },
  WEEKLY: {
    id: 'WEEKLY',
    name: 'Haftalık',
    description: 'Hafta başına ücretlendirme',
    icon: '📆',
    features: ['Haftalık paket', 'İndirimli fiyat', 'Düzenli hizmet']
  },
  MONTHLY: {
    id: 'MONTHLY',
    name: 'Aylık',
    description: 'Ay başına ücretlendirme',
    icon: '🗓️',
    features: ['Aylık abonelik', 'En iyi değer', 'Sürekli hizmet']
  },
  PACKAGE: {
    id: 'PACKAGE',
    name: 'Paket',
    description: 'Birden fazla hizmeti içeren paket',
    icon: '📦',
    features: ['Çoklu hizmet', 'İndirimli fiyat', 'Kolay seçim']
  },
  CUSTOM: {
    id: 'CUSTOM',
    name: 'Özel',
    description: 'Müşteriye özel fiyatlandırma',
    icon: '🎯',
    features: ['Kişiselleştirilmiş', 'Esnek', 'Müzakere edilebilir']
  },
  AUCTION: {
    id: 'AUCTION',
    name: 'Açık Artırma',
    description: 'Teklif verme sistemi',
    icon: '🔨',
    features: ['Rekabetçi fiyat', 'En iyi teklif', 'Şeffaf süreç']
  },
  SUBSCRIPTION: {
    id: 'SUBSCRIPTION',
    name: 'Abonelik',
    description: 'Düzenli abonelik hizmeti',
    icon: '🔄',
    features: ['Düzenli hizmet', 'İndirimli fiyat', 'Otomatik yenileme']
  },
  ESCROW: {
    id: 'ESCROW',
    name: 'Escrow',
    description: 'Güvenli ödeme sistemi',
    icon: '🔒',
    features: ['Güvenli ödeme', 'Hizmet sonrası ödeme', 'Güvenlik garantisi']
  }
}

export const getPricingModel = (id: string) => {
  return PRICING_MODELS[id as keyof typeof PRICING_MODELS]
}

export const getAllPricingModels = () => {
  return Object.values(PRICING_MODELS)
}

// Fiyatlandırma hesaplayıcıları
export const calculatePrice = (model: string, basePrice: number, options: any) => {
  switch (model) {
    case 'HOURLY':
      return basePrice * (options.hours || 1)
    case 'DAILY':
      return basePrice * (options.days || 1)
    case 'WEEKLY':
      return basePrice * (options.weeks || 1)
    case 'MONTHLY':
      return basePrice * (options.months || 1)
    case 'PACKAGE':
      return basePrice * (options.discount || 1)
    case 'CUSTOM':
      return options.customPrice || basePrice
    default:
      return basePrice
  }
}

// Dinamik fiyatlandırma faktörleri
export const PRICING_FACTORS = {
  URGENCY: {
    NORMAL: 1.0,
    URGENT: 1.5,
    EMERGENCY: 2.0
  },
  LOCATION: {
    SAME_CITY: 1.0,
    NEARBY_CITY: 1.2,
    DISTANT: 1.5
  },
  TIME: {
    WEEKDAY: 1.0,
    WEEKEND: 1.2,
    HOLIDAY: 1.5,
    NIGHT: 1.3
  },
  EXPERIENCE: {
    BEGINNER: 0.8,
    INTERMEDIATE: 1.0,
    EXPERT: 1.5,
    MASTER: 2.0
  }
}

export const calculateDynamicPrice = (basePrice: number, factors: any) => {
  let price = basePrice
  
  if (factors.urgency) {
    price *= PRICING_FACTORS.URGENCY[factors.urgency as keyof typeof PRICING_FACTORS.URGENCY] || 1.0
  }
  
  if (factors.location) {
    price *= PRICING_FACTORS.LOCATION[factors.location as keyof typeof PRICING_FACTORS.LOCATION] || 1.0
  }
  
  if (factors.time) {
    price *= PRICING_FACTORS.TIME[factors.time as keyof typeof PRICING_FACTORS.TIME] || 1.0
  }
  
  if (factors.experience) {
    price *= PRICING_FACTORS.EXPERIENCE[factors.experience as keyof typeof PRICING_FACTORS.EXPERIENCE] || 1.0
  }
  
  return Math.round(price)
}

