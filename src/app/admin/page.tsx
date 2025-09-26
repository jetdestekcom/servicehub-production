'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  UsersIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard'

interface AdminStats {
  totalUsers: number
  totalServices: number
  totalBookings: number
  totalRevenue: number
  pendingApprovals: number
  activeUsers: number
}

interface User {
  id: string
  name: string
  email: string
  role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN'
  status: 'active' | 'suspended' | 'pending'
  joinDate: string
  lastActive: string
  totalBookings: number
  rating: number
  avatar: string
}

interface Service {
  id: string
  title: string
  provider: string
  category: string
  price: number
  status: 'active' | 'pending' | 'rejected'
  createdAt: string
  views: number
  bookings: number
  rating: number
}

// Mock data removed - will fetch from API

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('overview')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAdminData()
  }, [])

  const fetchAdminData = async () => {
    try {
      setLoading(true)
      const [statsRes, usersRes, servicesRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/users'),
        fetch('/api/admin/services')
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json()
        setUsers(usersData)
      }

      if (servicesRes.ok) {
        const servicesData = await servicesRes.json()
        setServices(servicesData)
      }
    } catch (error) {
      console.error('Admin data fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircleIcon className="h-4 w-4" />
      case 'pending': return <ExclamationTriangleIcon className="h-4 w-4" />
      case 'suspended': return <XCircleIcon className="h-4 w-4" />
      case 'rejected': return <XCircleIcon className="h-4 w-4" />
      default: return <ExclamationTriangleIcon className="h-4 w-4" />
    }
  }

  const tabs = [
    { id: 'overview', name: 'Genel Bakış', icon: ChartBarIcon },
    { id: 'analytics', name: 'Analitik', icon: ChartBarIcon },
    { id: 'users', name: 'Kullanıcılar', icon: UsersIcon },
    { id: 'services', name: 'Hizmetler', icon: ClipboardDocumentListIcon },
    { id: 'bookings', name: 'Rezervasyonlar', icon: ClipboardDocumentListIcon },
    { id: 'revenue', name: 'Gelirler', icon: CurrencyDollarIcon },
    { id: 'security', name: 'Güvenlik', icon: ShieldCheckIcon },
    { id: 'demo', name: 'Demo Veriler', icon: ClipboardDocumentListIcon }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Paneli</h1>
          <p className="text-gray-600 mt-2">JetDestek.com yönetim paneli</p>
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
            {activeTab === 'analytics' && (
              <AnalyticsDashboard />
            )}

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
                        <p className="text-sm text-gray-600">Toplam Kullanıcı</p>
                        <p className="text-3xl font-bold text-gray-900">{stats?.totalUsers.toLocaleString()}</p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <UsersIcon className="h-6 w-6 text-blue-600" />
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
                        <p className="text-sm text-gray-600">Toplam Hizmet</p>
                        <p className="text-3xl font-bold text-gray-900">{stats?.totalServices.toLocaleString()}</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <ClipboardDocumentListIcon className="h-6 w-6 text-green-600" />
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
                        <p className="text-sm text-gray-600">Toplam Rezervasyon</p>
                        <p className="text-3xl font-bold text-gray-900">{stats?.totalBookings.toLocaleString()}</p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <ClipboardDocumentListIcon className="h-6 w-6 text-purple-600" />
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
                        <p className="text-sm text-gray-600">Toplam Gelir</p>
                        <p className="text-3xl font-bold text-gray-900">₺{stats?.totalRevenue.toLocaleString()}</p>
                      </div>
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <CurrencyDollarIcon className="h-6 w-6 text-yellow-600" />
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
                        <p className="text-sm text-gray-600">Bekleyen Onaylar</p>
                        <p className="text-3xl font-bold text-gray-900">{stats?.pendingApprovals}</p>
                      </div>
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <ExclamationTriangleIcon className="h-6 w-6 text-orange-600" />
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
                        <p className="text-sm text-gray-600">Aktif Kullanıcı</p>
                        <p className="text-3xl font-bold text-gray-900">{stats?.activeUsers.toLocaleString()}</p>
                      </div>
                      <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                        <UsersIcon className="h-6 w-6 text-indigo-600" />
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-6">Son Aktiviteler</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Yeni hizmet onaylandı</p>
                        <p className="text-xs text-gray-500">2 saat önce</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <UsersIcon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Yeni kullanıcı kaydı</p>
                        <p className="text-xs text-gray-500">4 saat önce</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                        <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Şüpheli aktivite tespit edildi</p>
                        <p className="text-xs text-gray-500">6 saat önce</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Kullanıcı Yönetimi</h2>
                  <div className="flex gap-4">
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Kullanıcı ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">Tümü</option>
                      <option value="active">Aktif</option>
                      <option value="pending">Bekleyen</option>
                      <option value="suspended">Askıya Alınmış</option>
                    </select>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Kullanıcı</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Rol</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Durum</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Rezervasyon</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">Puan</th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-900">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={user.avatar}
                                alt={user.name}
                                className="w-10 h-10 rounded-full"
                              />
                              <div>
                                <p className="font-semibold text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === 'PROVIDER' ? 'bg-blue-100 text-blue-800' :
                              user.role === 'CUSTOMER' ? 'bg-green-100 text-green-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {user.role === 'PROVIDER' ? 'Hizmet Veren' :
                               user.role === 'CUSTOMER' ? 'Müşteri' : 'Admin'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${getStatusColor(user.status)}`}>
                              {getStatusIcon(user.status)}
                              {user.status === 'active' && 'Aktif'}
                              {user.status === 'pending' && 'Bekleyen'}
                              {user.status === 'suspended' && 'Askıya Alınmış'}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-gray-900">{user.totalBookings}</td>
                          <td className="py-4 px-4 text-gray-900">{user.rating > 0 ? user.rating : '-'}</td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                <EyeIcon className="h-4 w-4" />
                              </button>
                              <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'services' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Hizmet Yönetimi</h2>
                  <div className="flex gap-4">
                    <div className="relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Hizmet ara..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      <option value="all">Tümü</option>
                      <option value="active">Aktif</option>
                      <option value="pending">Bekleyen</option>
                      <option value="rejected">Reddedilen</option>
                    </select>
                  </div>
                </div>
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
                          <p className="text-gray-600">{service.provider} • {service.category}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span>₺{service.price}</span>
                            <span>{service.views} görüntüleme</span>
                            <span>{service.bookings} rezervasyon</span>
                            {service.rating > 0 && <span>{service.rating} puan</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(service.status)}`}>
                            {service.status === 'active' && 'Aktif'}
                            {service.status === 'pending' && 'Bekleyen'}
                            {service.status === 'rejected' && 'Reddedilen'}
                          </span>
                          <div className="flex gap-2">
                            <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                              <CheckCircleIcon className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <XCircleIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Rezervasyon Yönetimi</h2>
                <div className="text-center py-12">
                  <ClipboardDocumentListIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Rezervasyon detayları</h3>
                  <p className="text-gray-600">Tüm rezervasyonlar burada görünecek.</p>
                </div>
              </div>
            )}

            {activeTab === 'revenue' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Gelir Analizi</h2>
                <div className="text-center py-12">
                  <ChartBarIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Gelir raporları</h3>
                  <p className="text-gray-600">Detaylı gelir analizleri burada görünecek.</p>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Güvenlik Yönetimi</h2>
                <div className="text-center py-12">
                  <ShieldCheckIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Güvenlik ayarları</h3>
                  <p className="text-gray-600">Güvenlik ve yetkilendirme ayarları burada görünecek.</p>
                </div>
              </div>
            )}

            {activeTab === 'demo' && (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Demo Veri Yönetimi</h2>
                <div className="text-center py-12">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Test için demo veriler</h3>
                    <p className="text-gray-600 mb-6">Platform özelliklerini test etmek için demo kullanıcılar ve veriler oluşturun.</p>
                    <a
                      href="/admin/demo"
                      className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                    >
                      <ClipboardDocumentListIcon className="h-5 w-5" />
                      Demo Veri Sayfasına Git
                    </a>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Demo Kullanıcılar</h4>
                      <p className="text-sm text-gray-600">5 farklı rol ve yetki seviyesinde kullanıcı</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Demo Hizmetler</h4>
                      <p className="text-sm text-gray-600">5 farklı kategoride örnek hizmet</p>
                    </div>
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Demo Rezervasyonlar</h4>
                      <p className="text-sm text-gray-600">Farklı durumlarda örnek rezervasyonlar</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
