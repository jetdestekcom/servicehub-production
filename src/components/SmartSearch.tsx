'use client'

import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon, FunnelIcon, MapPinIcon, CurrencyDollarIcon, ClockIcon } from '@heroicons/react/24/outline'
import ServiceCard from './ServiceCard'

interface SearchFilters {
  query: string
  location: string
  budget: number | null
  urgency: string
  category: string
  features: string[]
}

interface Service {
  id: string
  title: string
  description: string
  price: number
  rating: number
  reviewCount: number
  location?: string
  duration?: number
  isVerified: boolean
  isPremium: boolean
  isUrgent: boolean
  isPackage: boolean
  warranty?: number
  insurance: boolean
  responseTime?: number
  completionRate?: number
  images?: string
  provider: {
    id: string
    name: string
    image?: string
    rating: number
    reviewCount: number
    isVerified: boolean
  }
  aiScore?: number
  reason?: string
}

const FEATURES = [
  'Sigortalı',
  'Garantili',
  'Hızlı yanıt',
  'Premium',
  'Acil',
  'Paket hizmet',
  'Doğrulanmış',
  'Deneyimli'
]

const CATEGORIES = [
  'Temizlik',
  'Tamir',
  'Montaj',
  'Nakliyat',
  'Güzellik',
  'Eğitim',
  'Teknoloji',
  'Sağlık',
  'Diğer'
]

export default function SmartSearch() {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    location: '',
    budget: null,
    urgency: '',
    category: '',
    features: []
  })
  
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.query) params.append('query', filters.query)
      if (filters.location) params.append('location', filters.location)
      if (filters.budget) params.append('budget', filters.budget.toString())
      if (filters.urgency) params.append('urgency', filters.urgency)
      if (filters.category) params.append('category', filters.category)
      if (filters.features.length > 0) params.append('features', filters.features.join(','))

      const response = await fetch(`/api/services/smart-search?${params}`)
      console.log('Smart-Search API URL:', `/api/services/smart-search?${params}`) // Debug log

      const data = await response.json()
      console.log('Smart-Search API Response:', data) // Debug log
      if (data.success && data.data && data.data.services) {
        setServices(data.data.services)
        console.log('Smart-Search services loaded:', data.data.services.length) // Debug log
      } else {
        console.log('Smart-Search API failed:', data) // Debug log
        setServices([])
      }
    } catch (error) {
      console.error('Arama hatası:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const toggleFeature = (feature: string) => {
    setFilters(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }))
  }

  const handleFavoriteToggle = async (serviceId: string, isFavorite: boolean) => {
    try {
      const response = await fetch('/api/services/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          serviceId,
          action: isFavorite ? 'add' : 'remove'
        })
      })

      if (response.ok) {
        // Favori durumu güncellendi
      }
    } catch (error) {
      console.error('Favori işlemi hatası:', error)
    }
  }

  useEffect(() => {
    handleSearch()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Arama Çubuğu */}
      <div className="mb-8">
        <div className="flex gap-4 mb-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Ne arıyorsunuz? (örn: ev temizliği, bilgisayar tamiri)"
              value={filters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FunnelIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Gelişmiş Filtreler */}
        {showFilters && (
          <div className="bg-gray-50 rounded-lg p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Konum */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konum
                </label>
                <div className="relative">
                  <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Şehir, ilçe"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Bütçe */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maksimum Bütçe
                </label>
                <div className="relative">
                  <CurrencyDollarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    placeholder="₺"
                    value={filters.budget || ''}
                    onChange={(e) => handleFilterChange('budget', e.target.value ? Number(e.target.value) : null)}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Aciliyet */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Aciliyet
                </label>
                <select
                  value={filters.urgency}
                  onChange={(e) => handleFilterChange('urgency', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Seçiniz</option>
                  <option value="urgent">Acil (Bugün)</option>
                  <option value="normal">Normal (1-3 gün)</option>
                  <option value="flexible">Esnek (1 hafta+)</option>
                </select>
              </div>

              {/* Kategori */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Tümü</option>
                  {CATEGORIES.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Özellikler */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Özellikler
              </label>
              <div className="flex flex-wrap gap-2">
                {FEATURES.map(feature => (
                  <button
                    key={feature}
                    onClick={() => toggleFeature(feature)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      filters.features.includes(feature)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {feature}
                  </button>
                ))}
              </div>
            </div>

            {/* Arama Butonu */}
            <div className="flex justify-end">
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
              >
                {loading ? 'Aranıyor...' : 'Ara'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sonuçlar */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {loading ? 'Aranıyor...' : `${services.length} hizmet bulundu`}
        </h2>
        {filters.query && (
          <p className="text-gray-600">
            "<span className="font-medium">{filters.query}</span>" için sonuçlar
          </p>
        )}
      </div>

      {/* Hizmet Listesi */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
              <div className="h-48 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : services.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map(service => (
            <ServiceCard
              key={service.id}
              service={service}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MagnifyingGlassIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Hizmet bulunamadı
          </h3>
          <p className="text-gray-600 mb-4">
            Arama kriterlerinizi değiştirerek tekrar deneyin
          </p>
          <button
            onClick={() => setFilters({
              query: '',
              location: '',
              budget: null,
              urgency: '',
              category: '',
              features: []
            })}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Filtreleri Temizle
          </button>
        </div>
      )}
    </div>
  )
}

