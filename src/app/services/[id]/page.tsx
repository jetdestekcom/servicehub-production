'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  StarIcon,
  MapPinIcon,
  ClockIcon,
  CurrencyDollarIcon,
  ShieldCheckIcon,
  PhoneIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  ShareIcon,
  CalendarDaysIcon,
  UserIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

interface ServiceDetail {
  id: string
  title: string
  description: string
  fullDescription: string
  category: string
  subcategory: string
  price: number
  priceType: string
  duration: string
  location: string
  rating: number
  reviewCount: number
  images: string[]
  provider: {
    id: string
    name: string
    rating: number
    avatar: string
    reviewCount: number
    joinedDate: string
    isVerified: boolean
    isOnline: boolean
    responseTime: string
    completedJobs: number
  }
  tags: string[]
  isVerified: boolean
  isOnline: boolean
  responseTime: string
  features: string[]
  requirements: string[]
  availability: {
    weekdays: string[]
    weekends: string[]
    holidays: boolean
  }
  reviews: {
    id: string
    customerName: string
    customerAvatar: string
    rating: number
    comment: string
    date: string
    service: string
  }[]
}

const mockService: ServiceDetail = {
  id: '1',
  title: 'Profesyonel Ev Temizliği',
  description: 'Deneyimli ekibimizle evinizi tertemiz yapıyoruz. Tüm odalar, banyo, mutfak dahil.',
  fullDescription: 'Profesyonel ev temizliği hizmetimiz ile evinizi en ince detayına kadar temizliyoruz. 5 yıllık deneyimimiz ve uzman ekibimizle hizmet veriyoruz. Organik temizlik ürünleri kullanarak hem sağlığınızı hem de çevreyi koruyoruz.',
  category: 'Ev Temizliği',
  subcategory: 'Genel Temizlik',
  price: 150,
  priceType: 'FIXED',
  duration: '2-3 saat',
  location: 'Kadıköy, İstanbul',
  rating: 4.9,
  reviewCount: 127,
  images: [
    '/api/placeholder/600/400',
    '/api/placeholder/600/400',
    '/api/placeholder/600/400',
    '/api/placeholder/600/400'
  ],
  provider: {
    id: '1',
    name: 'Temizlik Uzmanı Ahmet',
    rating: 4.8,
    avatar: '/api/placeholder/100/100',
    reviewCount: 234,
    joinedDate: '2020-03-15',
    isVerified: true,
    isOnline: true,
    responseTime: '5 dk',
    completedJobs: 456
  },
  tags: ['Organik', 'Hızlı', 'Güvenilir', 'Profesyonel'],
  isVerified: true,
  isOnline: true,
  responseTime: '5 dk',
  features: [
    'Organik temizlik ürünleri',
    'Tüm odalar dahil',
    'Banyo ve mutfak detay temizliği',
    'Cam temizliği',
    'Zemin temizliği ve cilalama',
    'Toz alma ve süpürme'
  ],
  requirements: [
    'Temizlik malzemeleri tarafımızdan getirilir',
    'Müşteri evde bulunmalıdır',
    'Su ve elektrik erişimi gerekli'
  ],
  availability: {
    weekdays: ['09:00-18:00'],
    weekends: ['10:00-16:00'],
    holidays: true
  },
  reviews: [
    {
      id: '1',
      customerName: 'Ayşe Yılmaz',
      customerAvatar: '/api/placeholder/50/50',
      rating: 5,
      comment: 'Çok memnun kaldım. Evim tertemiz oldu. Ahmet bey çok profesyonel.',
      date: '2024-01-15',
      service: 'Genel Temizlik'
    },
    {
      id: '2',
      customerName: 'Mehmet Kaya',
      customerAvatar: '/api/placeholder/50/50',
      rating: 5,
      comment: 'Organik ürünler kullanması çok güzel. Ailem için güvenli.',
      date: '2024-01-10',
      service: 'Genel Temizlik'
    },
    {
      id: '3',
      customerName: 'Fatma Demir',
      customerAvatar: '/api/placeholder/50/50',
      rating: 4,
      comment: 'İyi hizmet, zamanında geldi. Fiyat uygun.',
      date: '2024-01-05',
      service: 'Genel Temizlik'
    }
  ]
}

export default function ServiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const [selectedImage, setSelectedImage] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [notes, setNotes] = useState('')
  const [service, setService] = useState<ServiceDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load service data from API
  useEffect(() => {
    const loadService = async () => {
      try {
        const resolvedParams = await params
        const response = await fetch(`/api/services/${resolvedParams.id}`)
        const data = await response.json()
        
        if (data.success && data.data && data.data.service) {
          const apiService = data.data.service
          // Transform API data to match ServiceDetail interface
          const transformedService: ServiceDetail = {
            id: apiService.id,
            title: apiService.title,
            description: apiService.description,
            fullDescription: apiService.description,
            category: apiService.category,
            subcategory: apiService.category,
            price: apiService.price,
            priceType: 'FIXED',
            duration: apiService.duration ? `${apiService.duration} dakika` : '2-3 saat',
            location: apiService.location,
            rating: apiService.rating,
            reviewCount: apiService.reviewCount,
            images: Array.isArray(apiService.images) ? apiService.images : [apiService.images || '/placeholder-service.jpg'],
            provider: {
              id: apiService.provider.id,
              name: apiService.provider.name,
              rating: apiService.provider.rating || 4.5,
              avatar: apiService.provider.image || '/placeholder-avatar.png',
              reviewCount: apiService.provider.reviewCount || 0,
              joinedDate: '2020-01-01',
              isVerified: apiService.isVerified,
              isOnline: true,
              responseTime: '5 dk',
              completedJobs: 100
            },
            tags: Array.isArray(apiService.tags) ? apiService.tags : [],
            isVerified: apiService.isVerified,
            isOnline: true,
            responseTime: '5 dk',
            features: ['Profesyonel hizmet', 'Güvenilir', 'Hızlı'],
            requirements: ['Müşteri evde bulunmalıdır'],
            availability: {
              weekdays: ['09:00-18:00'],
              weekends: ['10:00-16:00'],
              holidays: true
            },
            reviews: (apiService.reviews || []).map((review: any, index: number) => ({
              id: review.id || `review-${index}`,
              customerName: review.customer?.name || 'Anonim',
              customerAvatar: review.customer?.image || '/placeholder-avatar.png',
              rating: review.rating,
              comment: review.comment,
              date: new Date(review.createdAt).toLocaleDateString('tr-TR'),
              service: apiService.category
            }))
          }
          setService(transformedService)
        } else {
          setError(data.error || 'Hizmet bulunamadı')
        }
      } catch (err) {
        setError('Bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    loadService()
  }, [params])

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

  // Handler functions for Ara and Mesaj buttons
  const handleCall = () => {
    // For demo purposes, we'll show an alert
    // In a real app, this would initiate a phone call or show contact info
    const maskedName = service.provider.name.split(' ')[0] + ' ' + service.provider.name.split(' ').pop()?.charAt(0) + '.'
    alert(`Arama yapılıyor: ${maskedName}\nTelefon: +90 555 123 4567`)
  }

  const handleMessage = () => {
    // Navigate to messages page with the provider
    router.push(`/messages?provider=${service.provider.id}&service=${service.id}`)
  }

  const handleBooking = async () => {
    // Redirect to booking page with service ID and pre-filled data
    if (service) {
      const bookingData = {
        date: selectedDate,
        time: selectedTime,
        notes: notes
      }
      
      // Encode the booking data as URL parameters
      const params = new URLSearchParams({
        serviceId: service.id,
        ...(selectedDate && { date: selectedDate }),
        ...(selectedTime && { time: selectedTime }),
        ...(notes && { notes: notes })
      })
      
      router.push(`/booking?${params.toString()}`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Images */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative">
                <img
                  src={service.images[selectedImage]}
                  alt={service.title}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setIsFavorite(!isFavorite)}
                    className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                      isFavorite ? 'bg-red-500 text-white' : 'bg-white/80 text-gray-600 hover:bg-white'
                    }`}
                  >
                    <HeartIcon className="h-6 w-6" />
                  </button>
                  <button className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white transition-colors">
                    <ShareIcon className="h-6 w-6" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex gap-2 overflow-x-auto">
                  {service.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                      }`}
                    >
                      <img src={image} alt={`${service.title} ${index + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Service Info */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {service.category}
                    </span>
                    {service.isVerified && (
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                        <CheckCircleIcon className="h-4 w-4" />
                        Doğrulanmış
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    {service.title}
                  </h1>
                  <div className="flex items-center gap-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <StarSolidIcon className="h-5 w-5 text-yellow-500" />
                      <span className="font-semibold">{service.rating}</span>
                      <span>({service.reviewCount} değerlendirme)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPinIcon className="h-5 w-5" />
                      <span>{service.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="h-5 w-5" />
                      <span>{service.duration}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-4xl font-bold text-blue-600">
                    ₺{service.price}
                  </div>
                  <div className="text-gray-500">
                    {service.priceType === 'FIXED' ? 'Sabit fiyat' : 'Saatlik'}
                  </div>
                </div>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                {service.fullDescription}
              </p>

              {/* Features */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Hizmet Özellikleri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {service.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Requirements */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Gereksinimler</h3>
                <div className="space-y-3">
                  {service.requirements.map((requirement, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mt-0.5" />
                      <span className="text-gray-700">{requirement}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Etiketler</h3>
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">
                Müşteri Yorumları ({service.reviews.length})
              </h3>
              <div className="space-y-6">
                {service.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start gap-4">
                      <img
                        src={review.customerAvatar}
                        alt={review.customerName}
                        className="w-12 h-12 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-gray-900">{review.customerName}</h4>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <StarSolidIcon
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? 'text-yellow-500' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Provider Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hizmet Veren</h3>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={service.provider.avatar}
                  alt={service.provider.name.split(' ')[0] + ' ' + service.provider.name.split(' ').pop()?.charAt(0) + '.'}
                  className="w-16 h-16 rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {service.provider.name.split(' ')[0]} {service.provider.name.split(' ').pop()?.charAt(0)}.
                  </h4>
                  <div className="flex items-center gap-1 mb-1">
                    <StarSolidIcon className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">{service.provider.rating}</span>
                    <span className="text-sm text-gray-500">({service.provider.reviewCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {service.provider.isVerified && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        Doğrulanmış
                      </span>
                    )}
                    {service.provider.isOnline && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Online
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600">{service.provider.completedJobs}</div>
                  <div className="text-sm text-gray-500">Tamamlanan İş</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{service.provider.responseTime}</div>
                  <div className="text-sm text-gray-500">Yanıt Süresi</div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button 
                  onClick={handleCall}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  <PhoneIcon className="h-4 w-4" />
                  Ara
                </button>
                <button 
                  onClick={handleMessage}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ChatBubbleLeftRightIcon className="h-4 w-4" />
                  Mesaj
                </button>
              </div>
            </div>

            {/* Booking Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Hizmet Al</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tarih Seç
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Saat Seç
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Saat seçin</option>
                    <option value="09:00">09:00</option>
                    <option value="10:00">10:00</option>
                    <option value="11:00">11:00</option>
                    <option value="14:00">14:00</option>
                    <option value="15:00">15:00</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notlar (Opsiyonel)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Özel istekleriniz..."
                  />
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-700">Toplam:</span>
                    <span className="text-2xl font-bold text-blue-600">₺{service.price}</span>
                  </div>
                  <button
                    onClick={handleBooking}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    Hizmet Al
                  </button>
                </div>
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Müsaitlik</h3>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-gray-900">Hafta İçi</h4>
                  <p className="text-sm text-gray-600">{service.availability.weekdays.join(', ')}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Hafta Sonu</h4>
                  <p className="text-sm text-gray-600">{service.availability.weekends.join(', ')}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Resmi Tatiller</h4>
                  <p className="text-sm text-gray-600">
                    {service.availability.holidays ? 'Hizmet verilir' : 'Hizmet verilmez'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Rezervasyon Onayı</h3>
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-700">Hizmet:</span>
                <span className="font-semibold">{service.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Tarih:</span>
                <span className="font-semibold">{selectedDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Saat:</span>
                <span className="font-semibold">{selectedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Fiyat:</span>
                <span className="font-semibold">₺{service.price}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleBooking}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Onayla
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

