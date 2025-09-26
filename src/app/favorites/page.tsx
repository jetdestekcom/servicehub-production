'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import ServiceCard from '@/components/ServiceCard'
import { useSessionSafe } from '@/lib/session-utils'

interface FavoriteService {
  id: string
  service: {
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
  }
  createdAt: string
}

export default function FavoritesPage() {
  const { data: session } = useSessionSafe()
  const [favorites, setFavorites] = useState<FavoriteService[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user?.id) {
      fetchFavorites()
    }
  }, [session])

  const fetchFavorites = async () => {
    try {
      const response = await fetch('/api/services/favorites')
      const data = await response.json()
      if (data.success) {
        setFavorites(data.data)
      }
    } catch (error) {
      console.error('Favoriler yüklenemedi:', error)
    } finally {
      setLoading(false)
    }
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
        // Favori listesini güncelle
        if (!isFavorite) {
          setFavorites(prev => prev.filter(fav => fav.service.id !== serviceId))
        }
      }
    } catch (error) {
      console.error('Favori işlemi hatası:', error)
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <HeartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Giriş Yapın
          </h2>
          <p className="text-gray-600 mb-4">
            Favori hizmetlerinizi görmek için giriş yapmanız gerekiyor
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <HeartSolidIcon className="w-8 h-8 text-red-500" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Favori Hizmetlerim
              </h1>
              <p className="mt-1 text-gray-600">
                Beğendiğiniz hizmetleri buradan takip edebilirsiniz
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                <div className="h-48 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map(favorite => (
              <ServiceCard
                key={favorite.id}
                service={favorite.service}
                isFavorite={true}
                onFavoriteToggle={handleFavoriteToggle}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <HeartIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Henüz favori hizmetiniz yok
            </h3>
            <p className="text-gray-600 mb-4">
              Beğendiğiniz hizmetleri kalp ikonuna tıklayarak favorilere ekleyebilirsiniz
            </p>
            <Link
              href="/services"
              className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Hizmetleri Keşfet
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
