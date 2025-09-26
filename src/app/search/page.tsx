'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { AdvancedSearch } from '@/components/AdvancedSearch'
import ServiceCard from '@/components/ServiceCard'
import { CityAutocomplete } from '@/components/CityAutocomplete'
import { CategoryAutocomplete } from '@/components/CategoryAutocomplete'
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  StarIcon,
  ClockIcon,
  CurrencyDollarIcon,
  EyeIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

interface Service {
  id: string
  title: string
  description: string
  category: string
  price: number
  rating: number
  reviewCount: number
  location: string
  images: string
  provider: {
    id: string
    name: string
    image?: string
    rating: number
  }
  duration?: number
  isVerified: boolean
  createdAt: string
}

interface SearchFilters {
  query: string
  category: string
  location: string
  minPrice: number
  maxPrice: number
  minRating: number
  sortBy: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest'
  availability: 'all' | 'today' | 'tomorrow' | 'this_week'
}

function SearchPageContent() {
  const searchParams = useSearchParams()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(false)
  const [totalResults, setTotalResults] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(true)
  const [filters, setFilters] = useState<SearchFilters>({
    query: searchParams.get('q') || '',
    category: searchParams.get('category') || '',
    location: searchParams.get('location') || '',
    minPrice: 0,
    maxPrice: 10000,
    minRating: 0,
    sortBy: 'relevance',
    availability: 'all'
  })

  const performSearch = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        q: filters.query,
        category: filters.category,
        location: filters.location,
        minPrice: filters.minPrice.toString(),
        maxPrice: filters.maxPrice.toString(),
        minRating: filters.minRating.toString(),
        sortBy: filters.sortBy === 'relevance' ? 'createdAt' : filters.sortBy,
        page: currentPage.toString(),
        limit: '50'
      })

      // Add special filter parameters
      if (filters.category === 'verified') {
        params.set('isVerified', 'true')
        params.delete('category')
      } else if (filters.category === 'premium') {
        params.set('isPremium', 'true')
        params.delete('category')
      } else if (filters.category === 'urgent') {
        params.set('isUrgent', 'true')
        params.delete('category')
      } else if (filters.category === 'warranty') {
        params.set('warranty', 'true')
        params.delete('category')
      }

      const response = await fetch(`/api/services?${params}`)
      if (response.ok) {
        const data = await response.json()
        console.log('Search results:', data) // Debug log
        if (data.success && data.data && data.data.services) {
          console.log('Setting services from data.data.services:', data.data.services.length)
          setServices(data.data.services)
          setTotalResults(data.data.total || 0)
        } else if (data.services) {
          console.log('Setting services from data.services:', data.services.length)
          setServices(data.services)
          setTotalResults(data.total || 0)
        } else {
          console.log('No services found in search results')
          setServices([])
          setTotalResults(0)
        }
      }
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setLoading(false)
    }
  }, [filters, currentPage])

  useEffect(() => {
    performSearch()
  }, [performSearch])

  const handleSearch = (newFilters: SearchFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
  }

  const handleClear = () => {
    setFilters({
      query: '',
      category: '',
      location: '',
      minPrice: 0,
      maxPrice: 10000,
      minRating: 0,
      sortBy: 'relevance',
      availability: 'all'
    })
    setCurrentPage(1)
  }

  const renderStars = (rating: number = 0) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarSolidIcon
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  const formatPrice = (price: number = 0) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price)
  }

  const formatDuration = (minutes?: number) => {
    if (!minutes || minutes < 60) return `${minutes || 0} dk`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}s ${remainingMinutes}dk` : `${hours}s`
  }

  const formatProviderName = (fullName: string) => {
    if (!fullName) return 'Provider'
    
    const nameParts = fullName.trim().split(' ')
    if (nameParts.length === 1) {
      return nameParts[0]
    }
    
    const firstName = nameParts[0]
    const lastName = nameParts[nameParts.length - 1]
    const lastNameInitial = lastName.charAt(0).toUpperCase()
    
    return `${firstName} ${lastNameInitial}.`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Hizmet Ara
          </h1>
          <p className="text-gray-600">
            {totalResults > 0 ? `${totalResults} hizmet bulundu` : 'Aradığınız hizmeti bulun'}
          </p>
        </div>

        {/* Filters - Horizontal Layout */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Filtreler</h2>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
            >
              <FunnelIcon className="h-5 w-5" />
            </button>
          </div>
          
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block`}>
            <AdvancedSearch
              onSearch={handleSearch}
              onClear={handleClear}
              initialFilters={filters}
            />
          </div>
        </div>

        {/* Results */}
        <div className="w-full">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {totalResults} sonuç
              </span>
              <div className="flex items-center gap-2">
                <AdjustmentsHorizontalIcon className="h-4 w-4 text-gray-400" />
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({...filters, sortBy: e.target.value as 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest'})}
                  className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="relevance">En İlgili</option>
                  <option value="price_low">Fiyat (Düşük → Yüksek)</option>
                  <option value="price_high">Fiyat (Yüksek → Düşük)</option>
                  <option value="rating">En Yüksek Puan</option>
                  <option value="newest">En Yeni</option>
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

          {/* Results Grid */}
          {!loading && services.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {services.map((service) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                >
                  <Link href={`/services/${service.id}`}>
                    <div className="relative">
                      <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                        <Image
                          src={service.images && Array.isArray(service.images) && service.images.length > 0 
                            ? service.images[0] 
                            : '/api/placeholder/400/300'}
                          alt={service.title}
                          width={400}
                          height={300}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                      {service.isVerified === true && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          Doğrulanmış
                        </div>
                      )}
                    </div>
                  </Link>

                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                        {service.title || 'Hizmet'}
                      </h3>
                        <div className="flex items-center gap-1 ml-2">
                          {renderStars(service.rating || 0)}
                          <span className="text-sm text-gray-600 ml-1">
                            ({service.reviewCount || 0})
                          </span>
                        </div>
                    </div>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {service.description || 'Açıklama mevcut değil'}
                      </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <MapPinIcon className="h-4 w-4" />
                        <span>{service.location || 'Konum belirtilmemiş'}</span>
                      </div>
                        <div className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4" />
                          <span>{formatDuration(service.duration || 60)}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Image
                          src={service.provider?.image || '/api/placeholder/32/32'}
                          alt={service.provider?.name || 'Provider'}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {formatProviderName(service.provider?.name || 'Provider')}
                          </p>
                          <div className="flex items-center gap-1">
                            {renderStars(service.provider?.rating || 0)}
                            <span className="text-xs text-gray-500">
                              ({(service.provider?.rating || 0).toFixed(1)})
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-blue-600">
                          {formatPrice(service.price || 0)}
                        </p>
                        <p className="text-xs text-gray-500">başlangıç</p>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Link
                        href={`/services/${service.id}`}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-center text-sm font-medium"
                      >
                        Detayları Gör
                      </Link>
                      <Link
                        href={`/booking?serviceId=${service.id}`}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors text-center text-sm font-medium"
                      >
                        Hemen Al
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {/* No Results */}
          {!loading && services.length === 0 && (
            <div className="text-center py-12">
              <MagnifyingGlassIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Hiç hizmet bulunamadı
              </h3>
              <p className="text-gray-600 mb-4">
                Arama kriterlerinizi değiştirerek tekrar deneyin
              </p>
              <button
                onClick={handleClear}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Filtreleri Temizle
              </button>
            </div>
          )}

          {/* Pagination */}
          {totalResults > 12 && (
            <div className="mt-8 flex justify-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Önceki
                </button>
                <span className="px-3 py-2 text-sm text-gray-700">
                  Sayfa {currentPage} / {Math.ceil(totalResults / 12)}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(Math.ceil(totalResults / 12), currentPage + 1))}
                  disabled={currentPage >= Math.ceil(totalResults / 12)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sonraki
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchPageContent />
    </Suspense>
  )
}