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
  ArrowLeftIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import ServiceCard from '@/components/ServiceCard'

interface Provider {
  id: string
  name: string
  image?: string
  rating: number
  reviewCount: number
  isVerified: boolean
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

export default function ProviderServicesPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const [provider, setProvider] = useState<Provider | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProviderServices()
  }, [resolvedParams.id])

  const fetchProviderServices = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/providers/${resolvedParams.id}`)
      const data = await response.json()
      
      if (data.success) {
        setProvider(data.data.provider)
        setServices(data.data.provider.services)
      } else {
        setError(data.error || 'Provider bulunamadı')
      }
    } catch (err) {
      setError('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Hizmetler yükleniyor...</p>
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
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Geri
            </button>
            <div className="flex items-center gap-4">
              <img
                src={provider.image || '/placeholder-avatar.png'}
                alt={provider.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{provider.name}</h1>
                <div className="flex items-center gap-1">
                  <StarSolidIcon className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-gray-600">{provider.rating} ({provider.reviewCount})</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Hizmetler</h2>
            <p className="text-gray-600 mt-2">{services.length} hizmet bulundu</p>
          </div>
        </div>

        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
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
      </div>
    </div>
  )
}
