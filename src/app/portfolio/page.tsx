'use client'

import { useState, useEffect } from 'react'
import { EyeIcon, CalendarIcon, CurrencyDollarIcon, StarIcon } from '@heroicons/react/24/outline'

interface ProjectPortfolio {
  id: string
  title: string
  description: string
  images: string
  category: string
  budget: number
  duration: number
  status: string
  provider: {
    id: string
    name: string
    image: string
    rating: number
    reviewCount: number
  }
}

export default function PortfolioPage() {
  const [portfolios, setPortfolios] = useState<ProjectPortfolio[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchPortfolios()
  }, [selectedCategory])

  const fetchPortfolios = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory)
      }
      
      const response = await fetch(`/api/portfolio?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setPortfolios(data.data)
      }
    } catch (error) {
      console.error('Proje portföyü yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    'all',
    'Ev Renovasyonu',
    'Bahçe Düzenleme',
    'Mutfak Tadilatı',
    'Banyo Tadilatı',
    'Elektrik İşleri',
    'Su Tesisatı',
    'Boyama',
    'Zemin Döşeme',
    'Diğer'
  ]

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Proje Portföyü
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Hizmet sağlayıcılarımızın tamamladığı projeleri inceleyin. Porch ve HomeAdvisor'dan daha detaylı proje portföyü.
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

        {/* Projeler */}
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Projeler yükleniyor...</p>
          </div>
        ) : portfolios.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolios.map((portfolio) => (
              <div key={portfolio.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                {/* Proje Görseli */}
                <div className="relative h-48 bg-gray-200">
                  {portfolio.images ? (
                    <img
                      src={portfolio.images.split(',')[0]}
                      alt={portfolio.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <EyeIcon className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                      {portfolio.status}
                    </span>
                  </div>
                </div>

                {/* Proje Bilgileri */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {portfolio.title}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">
                        {portfolio.description}
                      </p>
                    </div>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                      {portfolio.category}
                    </span>
                  </div>

                  {/* Proje Detayları */}
                  <div className="space-y-2 mb-4">
                    {portfolio.budget && (
                      <div className="flex items-center text-sm text-gray-600">
                        <CurrencyDollarIcon className="w-4 h-4 mr-2" />
                        <span>Bütçe: {formatCurrency(portfolio.budget)}</span>
                      </div>
                    )}
                    {portfolio.duration && (
                      <div className="flex items-center text-sm text-gray-600">
                        <CalendarIcon className="w-4 h-4 mr-2" />
                        <span>Süre: {portfolio.duration} gün</span>
                      </div>
                    )}
                  </div>

                  {/* Hizmet Sağlayıcı */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center">
                      <img
                        src={portfolio.provider.image || '/default-avatar.png'}
                        alt={portfolio.provider.name}
                        className="w-8 h-8 rounded-full mr-3"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {portfolio.provider.name}
                        </p>
                        <div className="flex items-center">
                          <StarIcon className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-sm text-gray-600">
                            {portfolio.provider.rating.toFixed(1)} ({portfolio.provider.reviewCount})
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                      Detayları Gör
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <EyeIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-gray-600 mb-2">
              Bu kategoride henüz proje bulunmuyor
            </p>
            <p className="text-sm text-gray-500">
              Yakında bu alanda projeler eklenecek
            </p>
          </div>
        )}

        {/* Özellikler */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Proje Portföyü Avantajları
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <EyeIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Görsel Kanıt
              </h3>
              <p className="text-gray-600">
                Tamamlanan projelerin fotoğrafları ile kalite kanıtı
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CurrencyDollarIcon className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Şeffaf Fiyatlandırma
              </h3>
              <p className="text-gray-600">
                Proje bütçeleri ve süreleri hakkında net bilgi
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <StarIcon className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Deneyim Kanıtı
              </h3>
              <p className="text-gray-600">
                Hizmet sağlayıcıların geçmiş projelerini inceleyin
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

