'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  SparklesIcon,
  StarIcon,
  ClockIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  UserIcon,
  HeartIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'

interface Recommendation {
  id: string
  title: string
  provider: string
  category: string
  price: number
  rating: number
  reviewCount: number
  image: string
  reason: string
  confidence: number
  distance?: number
  isLiked: boolean
  views: number
}

// Mock data removed - will fetch from API

export function AIRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchRecommendations()
  }, [])

  const fetchRecommendations = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/recommendations')
      if (response.ok) {
        const data = await response.json()
        console.log('Fetched recommendations:', data) // Debug log
        console.log('Recommendations count:', data.length)
        setRecommendations(data)
      }
    } catch (error) {
      console.error('Recommendations fetch error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleLike = (id: string) => {
    setRecommendations(prev =>
      prev.map(rec =>
        rec.id === id ? { ...rec, isLiked: !rec.isLiked } : rec
      )
    )
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600 bg-green-100'
    if (confidence >= 80) return 'text-blue-600 bg-blue-100'
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-gray-600 bg-gray-100'
  }

  const getConfidenceText = (confidence: number) => {
    if (confidence >= 90) return 'Çok Yüksek'
    if (confidence >= 80) return 'Yüksek'
    if (confidence >= 70) return 'Orta'
    return 'Düşük'
  }

  const filteredRecommendations = recommendations.filter(rec => {
    if (filter === 'liked') return rec.isLiked
    if (filter === 'high-confidence') return rec.confidence >= 85
    return true
  })

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <SparklesIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">AI Önerileri</h2>
            <p className="text-sm text-gray-600">Size özel seçilmiş hizmetler</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Tümü</option>
            <option value="liked">Beğenilenler</option>
            <option value="high-confidence">Yüksek Güven</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredRecommendations.map((rec, index) => (
            <motion.div
              key={rec.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={rec.image}
                  alt={rec.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(rec.confidence)}`}>
                    {getConfidenceText(rec.confidence)} Güven
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => toggleLike(rec.id)}
                    className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                  >
                    {rec.isLiked ? (
                      <HeartSolidIcon className="h-5 w-5 text-red-500" />
                    ) : (
                      <HeartIcon className="h-5 w-5 text-gray-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {rec.title}
                  </h3>
                  <div className="flex items-center gap-1 ml-2">
                    <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900">{rec.rating.toFixed(1)}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-600 mb-3">{rec.provider}</p>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full">
                    {rec.category}
                  </span>
                  {rec.distance && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPinIcon className="h-3 w-3" />
                      {rec.distance.toFixed(1)} km
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <CurrencyDollarIcon className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-gray-900">₺{rec.price}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <EyeIcon className="h-3 w-3" />
                    {rec.views.toLocaleString()}
                  </div>
                </div>

                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                  <p className="text-xs text-purple-800 font-medium mb-1">AI Öneri Sebebi:</p>
                  <p className="text-xs text-purple-700">{rec.reason}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-500">{rec.reviewCount} değerlendirme</span>
                  </div>
                  <Link 
                    href={`/services/${rec.id}`}
                    className="text-xs bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg transition-colors inline-block"
                  >
                    Detayları Gör
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredRecommendations.length === 0 && (
        <div className="text-center py-12">
          <SparklesIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Öneri bulunamadı</h3>
          <p className="text-gray-600">Filtre ayarlarınızı değiştirmeyi deneyin.</p>
        </div>
      )}

      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg">
        <div className="flex items-center gap-3">
          <SparklesIcon className="h-5 w-5 text-purple-600" />
          <div>
            <h4 className="font-semibold text-purple-900 text-sm">AI Nasıl Çalışıyor?</h4>
            <p className="text-xs text-purple-700 mt-1">
              Önerilerimiz arama geçmişiniz, konumunuz, bütçeniz ve tercihlerinize göre kişiselleştirilmiştir.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

