'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  HomeIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

interface DashboardStats {
  totalBookings: number
  completedBookings: number
  pendingBookings: number
  totalEarnings: number
  averageRating: number
  totalReviews: number
}

interface Booking {
  id: string
  serviceName: string
  customerName: string
  customerAvatar: string
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'
  price: number
  location: string
}

interface Service {
  id: string
  title: string
  category: string
  price: number
  rating: number
  reviewCount: number
  views: number
  isActive: boolean
  image: string
}

// Mock data removed - will fetch from API

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const [statsRes, bookingsRes, servicesRes] = await Promise.all([
        fetch('/api/dashboard/stats'),
        fetch('/api/dashboard/bookings'),
        fetch('/api/dashboard/services')
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json()
        setBookings(bookingsData)
      }

      if (servicesRes.ok) {
        const servicesData = await servicesRes.json()
        setServices(servicesData)
      }
    } catch (error) {
      console.error('Dashboard data fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'in-progress': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <ClockIcon className="h-4 w-4" />
      case 'confirmed': return <CheckCircleIcon className="h-4 w-4" />
      case 'in-progress': return <ExclamationTriangleIcon className="h-4 w-4" />
      case 'completed': return <CheckCircleIcon className="h-4 w-4" />
      case 'cancelled': return <XCircleIcon className="h-4 w-4" />
      default: return <ClockIcon className="h-4 w-4" />
    }
  }

  const tabs = [
    { id: 'overview', name: 'Genel Bakış', icon: HomeIcon },
    { id: 'bookings', name: 'Rezervasyonlar', icon: ClipboardDocumentListIcon },
    { id: 'services', name: 'Hizmetlerim', icon: UserIcon },
    { id: 'messages', name: 'Mesajlar', icon: ChatBubbleLeftRightIcon },
    { id: 'reviews', name: 'Değerlendirmeler', icon: StarIcon },
    { id: 'earnings', name: 'Kazançlar', icon: CurrencyDollarIcon }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Hizmet veren panelinize hoş geldiniz</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-2xl shadow-sm p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-2xl shadow-sm p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Toplam Rezervasyon</p>
                        <p className="text-3xl font-bold text-gray-900">{stats?.totalBookings || 0}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <ClipboardDocumentListIcon className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white rounded-2xl shadow-sm p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Tamamlanan İş</p>
                        <p className="text-3xl font-bold text-gray-900">{stats?.completedBookings}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircleIcon className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl shadow-sm p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Toplam Kazanç</p>
                        <p className="text-3xl font-bold text-gray-900">₺{stats?.totalEarnings.toLocaleString()}</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl shadow-sm p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Ortalama Puan</p>
                        <p className="text-3xl font-bold text-gray-900">{stats?.averageRating}</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <StarSolidIcon className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl shadow-sm p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Bekleyen İş</p>
                        <p className="text-3xl font-bold text-gray-900">{stats?.pendingBookings}</p>
                      </div>
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <ClockIcon className="h-6 w-6 text-orange-600" />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-2xl shadow-sm p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Değerlendirme</p>
                        <p className="text-3xl font-bold text-gray-900">{stats?.totalReviews}</p>
                      </div>
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <StarIcon className="h-6 w-6 text-indigo-600" />
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Recent Bookings */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Son Rezervasyonlar</h2>
                    <button
                      onClick={() => setActiveTab('bookings')}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                      Tümünü Gör
                    </button>
                  </div>
                  <div className="space-y-4">
                    {bookings.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-4">
                          <img
                            src={booking.customerAvatar}
                            alt={booking.customerName}
                            className="w-12 h-12 rounded-full"
                          />
                          <div>
                            <h3 className="font-semibold text-gray-900">{booking.serviceName}</h3>
                            <p className="text-sm text-gray-600">{booking.customerName}</p>
                            <p className="text-sm text-gray-500">{booking.date} - {booking.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            {booking.status === 'pending' && 'Bekliyor'}
                            {booking.status === 'confirmed' && 'Onaylandı'}
                            {booking.status === 'in-progress' && 'Devam Ediyor'}
                            {booking.status === 'completed' && 'Tamamlandı'}
                            {booking.status === 'cancelled' && 'İptal Edildi'}
                          </span>
                          <span className="font-semibold text-gray-900">₺{booking.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Rezervasyonlar</h2>
                  <div className="flex gap-2">
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option>Tümü</option>
                      <option>Bekleyen</option>
                      <option>Onaylanan</option>
                      <option>Tamamlanan</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={booking.customerAvatar}
                            alt={booking.customerName}
                            className="w-16 h-16 rounded-full"
                          />
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{booking.serviceName}</h3>
                            <p className="text-gray-600">
                              {booking.status === 'confirmed' || booking.status === 'in_progress' || booking.status === 'completed'
                                ? booking.customerName  // Full name for confirmed bookings
                                : booking.customerName.split(' ')[0] + ' ' + booking.customerName.split(' ').pop()?.charAt(0) + '.'  // Masked name for pending
                              }
                            </p>
                            <p className="text-sm text-gray-500">{booking.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">₺{booking.price}</p>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            {booking.status === 'pending' && 'Bekliyor'}
                            {booking.status === 'confirmed' && 'Onaylandı'}
                            {booking.status === 'in-progress' && 'Devam Ediyor'}
                            {booking.status === 'completed' && 'Tamamlandı'}
                            {booking.status === 'cancelled' && 'İptal Edildi'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">{booking.date} - {booking.time}</p>
                        <div className="flex gap-2">
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                            Onayla
                          </button>
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                            Mesaj
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Hizmetlerim</h2>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <PlusIcon className="h-5 w-5" />
                    Yeni Hizmet
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <div key={service.id} className="bg-white rounded-2xl shadow-sm p-6">
                      <div className="flex items-start justify-between mb-4">
                        <img
                          src={service.image}
                          alt={service.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {service.isActive ? 'Aktif' : 'Pasif'}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{service.category}</p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1">
                          <StarSolidIcon className="h-4 w-4 text-yellow-500" />
                          <span className="text-sm font-medium">{service.rating}</span>
                          <span className="text-sm text-gray-500">({service.reviewCount})</span>
                        </div>
                        <span className="text-lg font-bold text-blue-600">₺{service.price}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>{service.views} görüntüleme</span>
                      </div>
                      <div className="flex gap-2">
                        <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-1">
                          <EyeIcon className="h-4 w-4" />
                          Görüntüle
                        </button>
                        <button className="flex-1 bg-blue-100 text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-1">
                          <PencilIcon className="h-4 w-4" />
                          Düzenle
                        </button>
                        <button className="bg-red-100 text-red-700 py-2 px-3 rounded-lg hover:bg-red-200 transition-colors">
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Mesajlar</h2>
                <div className="text-center py-12">
                  <ChatBubbleLeftRightIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz mesaj yok</h3>
                  <p className="text-gray-600">Müşterilerinizden gelen mesajlar burada görünecek.</p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Değerlendirmeler</h2>
                <div className="text-center py-12">
                  <StarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Henüz değerlendirme yok</h3>
                  <p className="text-gray-600">Müşterilerinizin değerlendirmeleri burada görünecek.</p>
                </div>
              </div>
            )}

            {activeTab === 'earnings' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Kazançlar</h2>
                <div className="text-center py-12">
                  <CurrencyDollarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Kazanç geçmişi</h3>
                  <p className="text-gray-600">Kazanç detaylarınız burada görünecek.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

