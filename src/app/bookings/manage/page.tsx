'use client'

import { useState, useEffect } from 'react'
import { useSessionSafe } from '@/lib/session-utils'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  ChatBubbleLeftRightIcon,
  StarIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

interface Booking {
  id: string
  service: {
    id: string
    title: string
    category: string
    price: number
    duration: number
    location: string
    provider: {
      id: string
      name: string
      phone?: string
      image?: string
      rating: number
      reviewCount: number
    }
  }
  customer: {
    id: string
    name: string
    phone?: string
    image?: string
  }
  status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
  startDate: string
  endDate: string
  totalAmount: number
  notes?: string
  createdAt: string
  updatedAt: string
}

const statusConfig = {
  pending: {
    label: 'Beklemede',
    color: 'bg-yellow-100 text-yellow-800',
    icon: ExclamationTriangleIcon
  },
  confirmed: {
    label: 'Onaylandı',
    color: 'bg-blue-100 text-blue-800',
    icon: CheckCircleIcon
  },
  in_progress: {
    label: 'Devam Ediyor',
    color: 'bg-purple-100 text-purple-800',
    icon: ClockIcon
  },
  completed: {
    label: 'Tamamlandı',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircleIcon
  },
  cancelled: {
    label: 'İptal Edildi',
    color: 'bg-red-100 text-red-800',
    icon: XCircleIcon
  }
}

// Helper function to format names based on booking status
const formatNameForBooking = (fullName: string, bookingStatus: string) => {
  if (!fullName) return 'Bilinmiyor'
  
  // Show full name for confirmed, in-progress, or completed bookings
  if (bookingStatus === 'confirmed' || bookingStatus === 'in_progress' || bookingStatus === 'completed') {
    return fullName
  }
  
  // Show masked name for pending or cancelled bookings
  const nameParts = fullName.trim().split(' ')
  if (nameParts.length === 1) {
    return nameParts[0]
  }
  
  const firstName = nameParts[0]
  const lastName = nameParts[nameParts.length - 1]
  const lastNameInitial = lastName.charAt(0).toUpperCase()
  
  return `${firstName} ${lastNameInitial}.`
}

export default function ManageBookingsPage() {
  const { data: session, status } = useSessionSafe()
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'>('all')
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated') {
      fetchBookings()
    }
  }, [status, router])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/bookings/my-bookings')
      if (response.ok) {
        const data = await response.json()
        setBookings(data)
      }
    } catch (error) {
      console.error('Rezervasyonlar yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (bookingId: string, newStatus: Booking['status']) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        await fetchBookings()
        setSelectedBooking(null)
      }
    } catch (error) {
      console.error('Durum güncellenirken hata:', error)
    }
  }

  const filteredBookings = bookings.filter(booking => 
    filter === 'all' || booking.status === filter
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Rezervasyonlarım</h1>
            <button
              onClick={() => router.back()}
              className="text-gray-500 hover:text-gray-700"
            >
              ← Geri
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'Tümü' },
              { key: 'pending', label: 'Beklemede' },
              { key: 'confirmed', label: 'Onaylandı' },
              { key: 'in_progress', label: 'Devam Ediyor' },
              { key: 'completed', label: 'Tamamlandı' },
              { key: 'cancelled', label: 'İptal Edildi' }
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key as 'all' | 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === filterOption.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-sm p-8">
              <CalendarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {filter === 'all' ? 'Henüz rezervasyon yok' : 'Bu durumda rezervasyon yok'}
              </h3>
              <p className="text-gray-600 mb-6">
                {filter === 'all' 
                  ? 'Hizmet almak için rezervasyon yapın!'
                  : 'Bu durumda rezervasyon bulunmuyor.'
                }
              </p>
              {filter === 'all' && (
                <button
                  onClick={() => router.push('/services')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                  Hizmet Ara
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {booking.service.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {booking.service.category}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                        statusConfig[booking.status].color
                      }`}>
                        {statusConfig[booking.status].label}
                      </span>
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      {new Date(booking.startDate).toLocaleDateString('tr-TR')}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ClockIcon className="h-4 w-4 mr-2" />
                      {new Date(booking.startDate).toLocaleTimeString('tr-TR', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      {booking.service.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                      ₺{booking.totalAmount}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={booking.service.provider.image || '/placeholder-avatar.png'}
                        alt={booking.service.provider.name}
                        className="h-8 w-8 rounded-full object-cover mr-3"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {booking.service.provider.name}
                        </p>
                        <div className="flex items-center">
                          <StarSolidIcon className="h-3 w-3 text-yellow-400 mr-1" />
                          <span className="text-xs text-gray-600">
                            {booking.service.provider.rating.toFixed(1)} ({booking.service.provider.reviewCount})
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button className="text-blue-600 hover:text-blue-700 p-2">
                        <ChatBubbleLeftRightIcon className="h-5 w-5" />
                      </button>
                      {booking.service.provider.phone && (
                        <button className="text-green-600 hover:text-green-700 p-2">
                          <PhoneIcon className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Rezervasyon Detayları
                </h2>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                {/* Service Info */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {selectedBooking.service.title}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Kategori</label>
                      <p className="text-gray-900">{selectedBooking.service.category}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Süre</label>
                      <p className="text-gray-900">{selectedBooking.service.duration} dakika</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Konum</label>
                      <p className="text-gray-900">{selectedBooking.service.location}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-500">Toplam Tutar</label>
                      <p className="text-gray-900 font-semibold">₺{selectedBooking.totalAmount}</p>
                    </div>
                  </div>
                </div>

                {/* Provider Info - Full name for confirmed bookings */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Hizmet Sağlayıcı</h4>
                  <div className="flex items-center">
                    <img
                      src={selectedBooking.service.provider.image || '/placeholder-avatar.png'}
                      alt={selectedBooking.service.provider.name}
                      className="h-12 w-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {formatNameForBooking(selectedBooking.service.provider.name, selectedBooking.status)}
                      </p>
                      <div className="flex items-center">
                        <StarSolidIcon className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-sm text-gray-600">
                          {selectedBooking.service.provider.rating.toFixed(1)} ({selectedBooking.service.provider.reviewCount} değerlendirme)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Customer Info - Full name for confirmed bookings */}
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Müşteri</h4>
                  <div className="flex items-center">
                    <img
                      src={selectedBooking.customer.image || '/placeholder-avatar.png'}
                      alt={selectedBooking.customer.name}
                      className="h-12 w-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {formatNameForBooking(selectedBooking.customer.name, selectedBooking.status)}
                      </p>
                      {selectedBooking.customer.phone && (
                        <p className="text-sm text-gray-600">{selectedBooking.customer.phone}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status Actions */}
                {selectedBooking.status === 'pending' && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleStatusUpdate(selectedBooking.id, 'confirmed')}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                    >
                      Onayla
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedBooking.id, 'cancelled')}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                      İptal Et
                    </button>
                  </div>
                )}

                {selectedBooking.status === 'confirmed' && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleStatusUpdate(selectedBooking.id, 'in_progress')}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                    >
                      Başlat
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedBooking.id, 'cancelled')}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                    >
                      İptal Et
                    </button>
                  </div>
                )}

                {selectedBooking.status === 'in_progress' && (
                  <button
                    onClick={() => handleStatusUpdate(selectedBooking.id, 'completed')}
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Tamamla
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
