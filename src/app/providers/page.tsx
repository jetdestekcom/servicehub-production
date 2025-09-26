'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { 
  StarIcon,
  MapPinIcon,
  ClockIcon,
  CheckCircleIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

interface Provider {
  id: string
  name: string
  email: string
  image?: string
  bio: string
  location: string
  rating: number
  reviewCount: number
  completedJobs: number
  joinDate: string
  isVerified: boolean
  services: {
    id: string
    title: string
    category: string
    price: number
    rating: number
    reviewCount: number
  }[]
  specialties: string[]
}

export default function ProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [locationFilter, setLocationFilter] = useState('')
  const [ratingFilter, setRatingFilter] = useState(0)
  const [sortBy, setSortBy] = useState<'rating' | 'newest' | 'jobs'>('rating')

  const fetchProviders = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        location: locationFilter,
        minRating: ratingFilter.toString(),
        sortBy: sortBy,
        limit: '20'
      })

      const response = await fetch(`/api/providers?${params}`)
      if (response.ok) {
        const data = await response.json()
        setProviders(data.providers || [])
      }
    } catch (error) {
      console.error('Providers fetch error:', error)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, locationFilter, ratingFilter, sortBy])

  useEffect(() => {
    fetchProviders()
  }, [fetchProviders])

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarSolidIcon
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hizmet Verenler
          </h1>
          <p className="text-gray-600">
            Güvenilir ve profesyonel hizmet verenlerimizi keşfedin
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Hizmet veren ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <input
                type="text"
                placeholder="Konum"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <select
                value={ratingFilter}
                onChange={(e) => setRatingFilter(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={0}>Tüm Puanlar</option>
                <option value={4}>4+ Yıldız</option>
                <option value={4.5}>4.5+ Yıldız</option>
                <option value={4.8}>4.8+ Yıldız</option>
              </select>
            </div>

            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'rating' | 'newest' | 'jobs')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="rating">En Yüksek Puan</option>
                <option value="newest">En Yeni</option>
                <option value="jobs">En Çok İş</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Providers Grid */}
        {!loading && providers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <motion.div
                key={provider.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                <div className="p-6">
                  {/* Provider Header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <Image
                        src={provider.image || '/api/placeholder/80/80'}
                        alt={provider.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 rounded-full object-cover"
                      />
                      {provider.isVerified && (
                        <div className="absolute -bottom-1 -right-1 bg-green-500 text-white p-1 rounded-full">
                          <CheckCircleIcon className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {provider.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center gap-1">
                          {renderStars(provider.rating)}
                        </div>
                        <span className="text-sm text-gray-600">
                          {provider.rating.toFixed(1)} ({provider.reviewCount} değerlendirme)
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPinIcon className="h-4 w-4" />
                        <span>{provider.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bio */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {provider.bio}
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {provider.completedJobs}
                      </div>
                      <div className="text-xs text-gray-600">Tamamlanan İş</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {provider.services.length}
                      </div>
                      <div className="text-xs text-gray-600">Aktif Hizmet</div>
                    </div>
                  </div>

                  {/* Specialties */}
                  {provider.specialties && provider.specialties.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Uzmanlık Alanları</h4>
                      <div className="flex flex-wrap gap-2">
                        {provider.specialties.slice(0, 3).map((specialty, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                          >
                            {specialty}
                          </span>
                        ))}
                        {provider.specialties.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            +{provider.specialties.length - 3} daha
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Top Services */}
                  {provider.services.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Popüler Hizmetler</h4>
                      <div className="space-y-2">
                        {provider.services.slice(0, 2).map((service) => (
                          <div key={service.id} className="flex items-center justify-between text-sm">
                            <span className="text-gray-700 truncate">{service.title}</span>
                            <span className="text-blue-600 font-medium">
                              ₺{service.price}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Join Date */}
                  <div className="text-xs text-gray-500 mb-4">
                    {formatJoinDate(provider.joinDate)} tarihinde katıldı
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/providers/${provider.id}`}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center text-sm font-medium"
                    >
                      Profili Gör
                    </Link>
                    <Link
                      href={`/providers/${provider.id}/services`}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-center text-sm font-medium"
                    >
                      Hizmetleri
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && providers.length === 0 && (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Hiç hizmet veren bulunamadı
            </h3>
            <p className="text-gray-600 mb-4">
              Arama kriterlerinizi değiştirerek tekrar deneyin
            </p>
            <button
              onClick={() => {
                setSearchQuery('')
                setLocationFilter('')
                setRatingFilter(0)
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
