'use client'

import { useState, useEffect } from 'react'
import { MapPinIcon, UsersIcon, ClockIcon, StarIcon } from '@heroicons/react/24/outline'
import { COMPETITOR_FEATURES } from '@/lib/competitor-features'

interface NeighborhoodService {
  id: string
  name: string
  description: string
  category: string
  location: string
  radius: number
  provider: {
    id: string
    name: string
    image: string
    rating: number
    reviewCount: number
  }
}

export default function NeighborhoodPage() {
  const [services, setServices] = useState<NeighborhoodService[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchServices()
  }, [selectedCategory])

  const fetchServices = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory)
      }
      
      const response = await fetch(`/api/neighborhood?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setServices(data.data)
      }
    } catch (error) {
      console.error('Mahalle hizmetleri yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    'all',
    'Ev Temizliği',
    'Bahçe Bakımı',
    'Pet Hizmetleri',
    'Güvenlik',
    'Nakliyat',
    'Teknik Destek',
    'Diğer'
  ]

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Mahalle Hizmetleri
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Yakınınızdaki güvenilir hizmet sağlayıcıları bulun. Nextdoor ve Neighborly'den daha kapsamlı mahalle odaklı hizmetler.
          </p>
        </div>

        {/* Kategori Filtresi */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {category === 'all' ? 'Tümü' : category}
              </button>
            ))}
          </div>
        </div>

        {/* Hizmetler */}
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Mahalle hizmetleri yükleniyor...</p>
          </div>
        ) : services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      {service.description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPinIcon className="w-4 h-4 mr-1" />
                      <span>{service.location}</span>
                    </div>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                    {service.category}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <img
                      src={service.provider.image || '/default-avatar.png'}
                      alt={service.provider.name}
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {service.provider.name}
                      </p>
                      <div className="flex items-center">
                        <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-600">
                          {service.provider.rating.toFixed(1)} ({service.provider.reviewCount} değerlendirme)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <UsersIcon className="w-4 h-4 mr-1" />
                    <span>{service.radius} km yarıçap</span>
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    İletişime Geç
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <MapPinIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-gray-600 mb-2">
              Bu kategoride henüz hizmet bulunmuyor
            </p>
            <p className="text-sm text-gray-500">
              Yakında bu alanda hizmetler eklenecek
            </p>
          </div>
        )}

        {/* Özellikler */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Mahalle Hizmetleri Avantajları
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPinIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Yakın Konum
              </h3>
              <p className="text-gray-600">
                Sadece yakınınızdaki hizmet sağlayıcıları gösterilir
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UsersIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Güvenilir Referanslar
              </h3>
              <p className="text-gray-600">
                Mahalle sakinlerinden gelen öneriler ve yorumlar
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Hızlı Hizmet
              </h3>
              <p className="text-gray-600">
                Yakın konum sayesinde daha hızlı hizmet alımı
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

