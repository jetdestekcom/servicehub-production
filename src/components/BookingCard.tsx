'use client'

import { useState } from 'react'
import { StarIcon, MapPinIcon, ClockIcon, UserIcon, PhoneIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import Image from 'next/image'

interface BookingCardProps {
  booking: {
    id: string
    service: {
      id: string
      title: string
      description: string
      price: number
      category: string
      location: string
      duration?: number
      provider: {
        id: string
        name: string
        image?: string
        phone?: string
        rating: number
        reviewCount: number
        isVerified: boolean
      }
    }
    customer: {
      id: string
      name: string
      image?: string
      phone?: string
    }
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
    startDate: string
    endDate: string
    totalAmount: number
    notes?: string
    createdAt: string
  }
  userRole: 'customer' | 'provider'
  onStatusUpdate?: (bookingId: string, newStatus: string) => void
}

export default function BookingCard({ 
  booking, 
  userRole,
  onStatusUpdate 
}: BookingCardProps) {
  const [showDetails, setShowDetails] = useState(false)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(price)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatDuration = (minutes?: number) => {
    if (!minutes) return ''
    if (minutes < 60) return `${minutes} dk`
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return mins > 0 ? `${hours}s ${mins}dk` : `${hours}s`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-gray-100 text-gray-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Beklemede'
      case 'confirmed': return 'Onaylandı'
      case 'in_progress': return 'Devam Ediyor'
      case 'completed': return 'Tamamlandı'
      case 'cancelled': return 'İptal Edildi'
      default: return 'Bilinmiyor'
    }
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

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 overflow-hidden">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {booking.service.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              {booking.service.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <MapPinIcon className="h-4 w-4" />
                <span>{booking.service.location}</span>
              </div>
              {booking.service.duration && (
                <div className="flex items-center gap-1">
                  <ClockIcon className="h-4 w-4" />
                  <span>{formatDuration(booking.service.duration)}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                <span>{formatDate(booking.startDate)}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {formatPrice(booking.totalAmount)}
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
              {getStatusText(booking.status)}
            </span>
          </div>
        </div>

        {/* Contact Information - Only show for confirmed bookings */}
        {booking.status === 'confirmed' && (
          <div className="border-t border-gray-200 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Provider Info (for customers) */}
              {userRole === 'customer' && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Hizmet Sağlayıcı</h4>
                  <div className="flex items-center gap-3">
                    <Image
                      src={booking.service.provider.image || '/api/placeholder/40/40'}
                      alt={booking.service.provider.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {booking.service.provider.name}
                      </p>
                      <div className="flex items-center gap-1">
                        {renderStars(booking.service.provider.rating)}
                        <span className="text-sm text-gray-600 ml-1">
                          ({booking.service.provider.reviewCount})
                        </span>
                      </div>
                      {booking.service.provider.phone && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <PhoneIcon className="h-4 w-4" />
                          {booking.service.provider.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Customer Info (for providers) */}
              {userRole === 'provider' && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Müşteri</h4>
                  <div className="flex items-center gap-3">
                    <Image
                      src={booking.customer.image || '/api/placeholder/40/40'}
                      alt={booking.customer.name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {booking.customer.name}
                      </p>
                      {booking.customer.phone && (
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <PhoneIcon className="h-4 w-4" />
                          {booking.customer.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes */}
        {booking.notes && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Notlar</h4>
            <p className="text-sm text-gray-600">{booking.notes}</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            {showDetails ? 'Detayları Gizle' : 'Detayları Göster'}
          </button>
          
          {onStatusUpdate && booking.status === 'pending' && userRole === 'provider' && (
            <div className="flex gap-2">
              <button
                onClick={() => onStatusUpdate(booking.id, 'confirmed')}
                className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
              >
                Onayla
              </button>
              <button
                onClick={() => onStatusUpdate(booking.id, 'cancelled')}
                className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
              >
                İptal Et
              </button>
            </div>
          )}
        </div>

        {/* Additional Details */}
        {showDetails && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Rezervasyon ID:</span>
                <p className="text-gray-600">{booking.id}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Oluşturulma:</span>
                <p className="text-gray-600">{formatDate(booking.createdAt)}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Başlangıç:</span>
                <p className="text-gray-600">{formatDate(booking.startDate)}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Bitiş:</span>
                <p className="text-gray-600">{formatDate(booking.endDate)}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

