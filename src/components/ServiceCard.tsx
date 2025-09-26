'use client'

import { useState } from 'react'
import { StarIcon, HeartIcon, MapPinIcon, ClockIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon, HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'
import Image from 'next/image'

interface ServiceCardProps {
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
    images?: string | string[]
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
  showFavorite?: boolean
  onFavoriteToggle?: (serviceId: string, isFavorite: boolean) => void
  isFavorite?: boolean
}

export default function ServiceCard({ 
  service, 
  showFavorite = true, 
  onFavoriteToggle,
  isFavorite = false 
}: ServiceCardProps) {
  const [favorite, setFavorite] = useState(isFavorite)

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (onFavoriteToggle) {
      const newFavorite = !favorite
      setFavorite(newFavorite)
      onFavoriteToggle(service.id, newFavorite)
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price)
  }

  const formatDuration = (minutes?: number) => {
    if (!minutes) return ''
    if (minutes < 60) return `${minutes} dk`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}s ${mins}dk` : `${hours}s`
  }

  const formatProviderName = (fullName: string, showFullName: boolean = false) => {
    if (!fullName) return 'Provider'
    
    // Wenn vollständiger Name angezeigt werden soll (z.B. bei bestätigten Buchungen)
    if (showFullName) {
      return fullName
    }
    
    const nameParts = fullName.trim().split(' ')
    if (nameParts.length === 1) {
      return nameParts[0]
    }
    
    const firstName = nameParts[0]
    const lastName = nameParts[nameParts.length - 1]
    const lastNameInitial = lastName.charAt(0).toUpperCase()
    
    return `${firstName} ${lastNameInitial}.`
  }

  const getImageUrl = () => {
    if (service.images) {
      // Handle both string and array formats
      if (Array.isArray(service.images)) {
        return service.images[0] || '/api/placeholder/300/200'
      } else if (typeof service.images === 'string') {
        // Handle JSON string format
        try {
          const parsedImages = JSON.parse(service.images)
          if (Array.isArray(parsedImages)) {
            return parsedImages[0] || '/api/placeholder/300/200'
          }
        } catch {
          // If not JSON, treat as comma-separated string
          const images = service.images.split(',')
          return images[0] || '/api/placeholder/300/200'
        }
      }
    }
    return '/api/placeholder/300/200'
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <Link href={`/services/${service.id}`}>
        <div className="relative">
          <div className="aspect-w-16 aspect-h-9 h-48 bg-gray-200 relative">
            <Image
              src={getImageUrl()}
              alt={service.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
          
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {service.isPremium && (
              <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Premium
              </span>
            )}
            {service.isUrgent && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Acil
              </span>
            )}
            {service.isPackage && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Paket
              </span>
            )}
          </div>

          {/* Favorite Button */}
          {showFavorite && (
            <button
              onClick={handleFavoriteToggle}
              className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
            >
              {favorite ? (
                <HeartSolidIcon className="w-5 h-5 text-red-500" />
              ) : (
                <HeartIcon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          )}

          {/* AI Score */}
          {service.aiScore && (
            <div className="absolute bottom-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
              AI: {service.aiScore}%
            </div>
          )}
        </div>

        <div className="p-4">
          {/* Title and Provider */}
          <div className="mb-2">
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
              {service.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-600">{formatProviderName(service.provider.name)}</span>
              {service.provider.isVerified && (
                <ShieldCheckIcon className="w-4 h-4 text-blue-500" />
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm line-clamp-2 mb-3">
            {service.description}
          </p>

          {/* Rating and Reviews */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center">
              <StarSolidIcon className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium ml-1">{service.rating.toFixed(1)}</span>
            </div>
            <span className="text-sm text-gray-500">({service.reviewCount})</span>
            {service.completionRate && (
              <span className="text-sm text-green-600 font-medium">
                %{service.completionRate} tamamlanma
              </span>
            )}
          </div>

          {/* Features */}
          <div className="flex flex-wrap gap-2 mb-3">
            {service.warranty && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                {service.warranty} gün garanti
              </span>
            )}
            {service.insurance && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Sigortalı
              </span>
            )}
            {service.responseTime && service.responseTime < 60 && (
              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                {service.responseTime}dk yanıt
              </span>
            )}
          </div>

          {/* Location and Duration */}
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            {service.location && (
              <div className="flex items-center gap-1">
                <MapPinIcon className="w-4 h-4" />
                <span className="line-clamp-1">{service.location}</span>
              </div>
            )}
            {service.duration && (
              <div className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4" />
                <span>{formatDuration(service.duration)}</span>
              </div>
            )}
          </div>

          {/* Price */}
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-900">
              {formatPrice(service.price)}
            </div>
            {service.reason && (
              <div className="text-xs text-gray-500 text-right max-w-32">
                {service.reason}
              </div>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}

