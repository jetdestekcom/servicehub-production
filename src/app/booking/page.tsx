'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  StarIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  UserIcon,
  CalendarIcon,
  CheckIcon
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

function BookingPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const serviceId = searchParams.get('serviceId')
  
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    duration: 1,
    notes: '',
    contactPhone: '',
    contactEmail: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [prefilledData, setPrefilledData] = useState(false)

  useEffect(() => {
    if (serviceId) {
      fetchService()
      
      // Pre-fill form data from URL parameters
      const date = searchParams.get('date')
      const time = searchParams.get('time')
      const notes = searchParams.get('notes')
      
      if (date || time || notes) {
        setBookingData(prev => ({
          ...prev,
          ...(date && { date }),
          ...(time && { time }),
          ...(notes && { notes })
        }))
        setPrefilledData(true)
      }
    } else {
      setError('Hizmet ID gerekli')
      setLoading(false)
    }
  }, [serviceId, searchParams])

  const fetchService = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/services/${serviceId}`)
      const data = await response.json()
      
      if (data.success && data.data && data.data.service) {
        setService(data.data.service)
      } else {
        setError(data.error || 'Hizmet bulunamadı')
      }
    } catch (err) {
      setError('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Create booking
      const startDate = new Date(`${bookingData.date}T${bookingData.time}`)
      const endDate = new Date(startDate.getTime() + bookingData.duration * 60 * 60 * 1000)
      
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId: serviceId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          totalAmount: service!.price * bookingData.duration,
          notes: bookingData.notes,
          contactPhone: bookingData.contactPhone,
          contactEmail: bookingData.contactEmail
        })
      })

      const data = await response.json()
      
      if (response.ok) {
        alert('Rezervasyon başarıyla oluşturuldu!')
        router.push('/dashboard')
      } else {
        alert(data.error || 'Rezervasyon oluşturulurken bir hata oluştu')
      }
    } catch (err) {
      console.error('Booking error:', err)
      alert('Rezervasyon oluşturulurken bir hata oluştu')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Hizmet bilgileri yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Hizmet Bulunamadı</h1>
          <p className="text-gray-600 mb-6">{error || 'Aradığınız hizmet bulunamadı.'}</p>
          <button
            onClick={() => router.push('/services')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Hizmet Listesine Dön
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
            <h1 className="text-2xl font-bold text-gray-900">Rezervasyon Yap</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Info */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-sm p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-4">Hizmet Detayları</h2>
              
              {/* Service Image */}
              <div className="mb-4">
                <img
                  src={service.images ? (typeof service.images === 'string' ? service.images.split(',')[0] : service.images[0]) : '/placeholder-service.jpg'}
                  alt={service.title}
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>

              {/* Service Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
              
              {/* Category */}
              <div className="mb-3">
                <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {service.category}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-4">{service.description}</p>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <StarSolidIcon
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(service.rating) ? 'text-yellow-500' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-900">{service.rating}</span>
                <span className="text-sm text-gray-500">({service.reviewCount} değerlendirme)</span>
              </div>

              {/* Provider Info */}
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={service.provider.image || '/placeholder-avatar.png'}
                  alt={service.provider.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium text-gray-900">{service.provider.name}</div>
                  <div className="text-sm text-gray-500">Provider</div>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 mb-4">
                <MapPinIcon className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{service.location}</span>
              </div>

              {/* Duration */}
              {service.duration && (
                <div className="flex items-center gap-2 mb-4">
                  <ClockIcon className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{service.duration} dakika</span>
                </div>
              )}

              {/* Price */}
              <div className="flex items-center gap-2 mb-4">
                <CurrencyDollarIcon className="h-4 w-4 text-green-600" />
                <span className="text-2xl font-bold text-gray-900">₺{service.price}</span>
              </div>
            </motion.div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl shadow-sm p-6"
            >
              <h2 className="text-xl font-bold text-gray-900 mb-6">Rezervasyon Bilgileri</h2>
              
              {prefilledData && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <CheckIcon className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-green-800">
                      Form daha önceki girişlerinizle önceden dolduruldu
                    </span>
                  </div>
                </div>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tarih
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={bookingData.date}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Time */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Saat
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={bookingData.time}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Süre (saat)
                  </label>
                  <select
                    name="duration"
                    value={bookingData.duration}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={1}>1 saat</option>
                    <option value={2}>2 saat</option>
                    <option value={3}>3 saat</option>
                    <option value={4}>4 saat</option>
                    <option value={8}>8 saat</option>
                  </select>
                </div>

                {/* Contact Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon Numarası
                  </label>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={bookingData.contactPhone}
                    onChange={handleInputChange}
                    required
                    placeholder="+90 555 123 45 67"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Contact Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta
                  </label>
                  <input
                    type="email"
                    name="contactEmail"
                    value={bookingData.contactEmail}
                    onChange={handleInputChange}
                    required
                    placeholder="ornek@email.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notlar (isteğe bağlı)
                  </label>
                  <textarea
                    name="notes"
                    value={bookingData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Özel isteklerinizi buraya yazabilirsiniz..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Total Price */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-medium text-gray-900">Toplam Tutar:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ₺{service.price * bookingData.duration}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {service.price} ₺ × {bookingData.duration} saat
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Rezervasyon Yapılıyor...
                    </div>
                  ) : (
                    'Rezervasyon Yap'
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <BookingPageContent />
    </Suspense>
  )
}