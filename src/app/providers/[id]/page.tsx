'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  StarIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  CalendarIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import ServiceCard from '@/components/ServiceCard'

interface Provider {
  id: string
  name: string
  email: string
  image?: string
  bio?: string
  location?: string
  rating: number
  reviewCount: number
  isVerified: boolean
  responseTime?: number
  completionRate?: number
  services: Service[]
}

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

export default function ProviderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const [provider, setProvider] = useState<Provider | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    fetchProvider()
  }, [resolvedParams.id])

  const fetchProvider = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/providers/${resolvedParams.id}`)
      const data = await response.json()
      
      if (data.success) {
        setProvider(data.data.provider)
      } else {
        setError(data.error || 'Provider bulunamadı')
      }
    } catch (err) {
      setError('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite)
    // TODO: Implement favorite functionality
  }

  const handleContact = () => {
    // Show contact options modal or redirect to contact page
    const contactOptions = confirm(
      `${provider.name} ile iletişime geçmek istiyorsunuz.\n\nTamam'a basarsanız mesaj gönderebilirsiniz.\nİptal'e basarsanız telefon numarası gösterilir.`
    )
    
    if (contactOptions) {
      // Navigate to messages
      router.push(`/messages?provider=${provider.id}`)
    } else {
      // Show phone number
      alert(`Telefon: +90 555 123 4567\n\n${provider.name} ile doğrudan iletişime geçebilirsiniz.`)
    }
  }

  const handleBookService = (serviceId: string) => {
    router.push(`/booking?serviceId=${serviceId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Provider bilgileri yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error || !provider) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Provider Bulunamadı</h1>
          <p className="text-gray-600 mb-6">{error || 'Aradığınız provider bulunamadı.'}</p>
          <button
            onClick={() => router.push('/providers')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Provider Listesine Dön
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center text-gray-500 hover:text-gray-700"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Geri
            </button>
            <button
              onClick={handleFavoriteToggle}
              className="flex items-center text-gray-500 hover:text-gray-700"
            >
              {isFavorite ? (
                <HeartSolidIcon className="h-6 w-6 text-red-500" />
              ) : (
                <HeartIcon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Provider Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm p-6"
            >
              {/* Provider Avatar */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <img
                    src={provider.image || '/placeholder-avatar.png'}
                    alt={provider.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto"
                  />
                  {provider.isVerified && (
                    <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-1">
                      <ShieldCheckIcon className="h-4 w-4" />
                    </div>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mt-4">{provider.name}</h1>
                {provider.isVerified && (
                  <div className="flex items-center justify-center gap-1 mt-2">
                    <ShieldCheckIcon className="h-4 w-4 text-blue-600" />
                    <span className="text-sm text-blue-600 font-medium">Doğrulanmış Provider</span>
                  </div>
                )}
              </div>

              {/* Rating */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <StarSolidIcon
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(provider.rating) ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-gray-900">{provider.rating}</span>
                <span className="text-sm text-gray-500">({provider.reviewCount} değerlendirme)</span>
              </div>

              {/* Bio */}
              {provider.bio && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Hakkında</h3>
                  <p className="text-gray-600">{provider.bio}</p>
                </div>
              )}

              {/* Location */}
              {provider.location && (
                <div className="flex items-center gap-2 mb-4">
                  <MapPinIcon className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">{provider.location}</span>
                </div>
              )}

              {/* Stats */}
              <div className="space-y-3 mb-6">
                {provider.responseTime && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Yanıt Süresi</span>
                    <span className="text-sm font-medium text-gray-900">{provider.responseTime} dakika</span>
                  </div>
                )}
                {provider.completionRate && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Tamamlanma Oranı</span>
                    <span className="text-sm font-medium text-gray-900">%{provider.completionRate}</span>
                  </div>
                )}
              </div>

              {/* Contact Buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleContact}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  İletişime Geç
                </button>
                <button
                  onClick={() => router.push(`/providers/${provider.id}/services`)}
                  className="w-full border border-blue-600 text-blue-600 py-3 px-4 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  Tüm Hizmetleri Gör
                </button>
              </div>
            </motion.div>
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Hizmetler</h2>
                <span className="text-sm text-gray-600">{provider.services.length} hizmet</span>
              </div>

              {provider.services.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {provider.services.map((service, index) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <ServiceCard service={service} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">🔧</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz hizmet bulunmuyor</h3>
                  <p className="text-gray-600">Bu provider henüz hizmet eklememiş.</p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
