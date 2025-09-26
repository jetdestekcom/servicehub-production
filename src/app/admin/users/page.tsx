'use client'

import { useState, useEffect } from 'react'
import { useSessionSafe } from '@/lib/session-utils'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  UserIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  TrashIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

interface User {
  id: string
  name: string
  email: string
  phone?: string
  image?: string
  role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN'
  isVerified: boolean
  rating: number
  reviewCount: number
  createdAt: string
  updatedAt: string
  _count: {
    services: number
    bookings: number
    reviews: number
  }
}

export default function AdminUsersPage() {
  const { data: session, status } = useSessionSafe()
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'CUSTOMER' | 'PROVIDER' | 'ADMIN'>('all')
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'verified' | 'unverified'>('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/')
      return
    }

    if (status === 'authenticated') {
      fetchUsers()
    }
  }, [status, session, router])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/users')
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      }
    } catch (error) {
      console.error('Kullanıcılar yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUserAction = async (userId: string, action: 'verify' | 'unverify' | 'delete') => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action })
      })

      if (response.ok) {
        await fetchUsers()
        setSelectedUser(null)
      }
    } catch (error) {
      console.error('Kullanıcı işlemi sırasında hata:', error)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    const matchesVerification = verificationFilter === 'all' ||
                               (verificationFilter === 'verified' && user.isVerified) ||
                               (verificationFilter === 'unverified' && !user.isVerified)
    
    return matchesSearch && matchesRole && matchesVerification
  })

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
            <h1 className="text-2xl font-bold text-gray-900">Kullanıcı Yönetimi</h1>
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
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Arama
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Kullanıcı ara..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rol
              </label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as 'all' | 'CUSTOMER' | 'PROVIDER' | 'ADMIN')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tüm Roller</option>
                <option value="CUSTOMER">Müşteri</option>
                <option value="PROVIDER">Hizmet Sağlayıcı</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Doğrulama
              </label>
              <select
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value as 'all' | 'verified' | 'unverified')}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Tümü</option>
                <option value="verified">Doğrulanmış</option>
                <option value="unverified">Doğrulanmamış</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={fetchUsers}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Filtrele
              </button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kullanıcı
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doğrulama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İstatistikler
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kayıt Tarihi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={user.image || '/placeholder-avatar.png'}
                          alt={user.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                        user.role === 'PROVIDER' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.role === 'ADMIN' ? 'Admin' :
                         user.role === 'PROVIDER' ? 'Hizmet Sağlayıcı' :
                         'Müşteri'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {user.isVerified ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                        ) : (
                          <XCircleIcon className="h-5 w-5 text-red-500 mr-2" />
                        )}
                        <span className={`text-sm ${
                          user.isVerified ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {user.isVerified ? 'Doğrulanmış' : 'Doğrulanmamış'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="space-y-1">
                        <div>Hizmet: {user._count.services}</div>
                        <div>Rezervasyon: {user._count.bookings}</div>
                        <div>Değerlendirme: {user._count.reviews}</div>
                        {user.rating > 0 && (
                          <div className="flex items-center">
                            <StarSolidIcon className="h-4 w-4 text-yellow-400 mr-1" />
                            <span>{user.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('tr-TR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        {user.role !== 'ADMIN' && (
                          <>
                            <button
                              onClick={() => handleUserAction(user.id, user.isVerified ? 'unverify' : 'verify')}
                              className={`${
                                user.isVerified 
                                  ? 'text-orange-600 hover:text-orange-900' 
                                  : 'text-green-600 hover:text-green-900'
                              }`}
                            >
                              {user.isVerified ? (
                                <ExclamationTriangleIcon className="h-4 w-4" />
                              ) : (
                                <ShieldCheckIcon className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleUserAction(user.id, 'delete')}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UserIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Kullanıcı bulunamadı
            </h3>
            <p className="text-gray-600">
              Arama kriterlerinize uygun kullanıcı bulunmuyor.
            </p>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Kullanıcı Detayları
                </h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedUser.image || '/placeholder-avatar.png'}
                    alt={selectedUser.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {selectedUser.name}
                    </h3>
                    <p className="text-gray-600">{selectedUser.email}</p>
                    {selectedUser.phone && (
                      <p className="text-gray-600">{selectedUser.phone}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Rol</label>
                    <p className="text-gray-900">
                      {selectedUser.role === 'ADMIN' ? 'Admin' :
                       selectedUser.role === 'PROVIDER' ? 'Hizmet Sağlayıcı' :
                       'Müşteri'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Doğrulama</label>
                    <p className={`${
                      selectedUser.isVerified ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {selectedUser.isVerified ? 'Doğrulanmış' : 'Doğrulanmamış'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Kayıt Tarihi</label>
                    <p className="text-gray-900">
                      {new Date(selectedUser.createdAt).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Son Güncelleme</label>
                    <p className="text-gray-900">
                      {new Date(selectedUser.updatedAt).toLocaleDateString('tr-TR')}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">İstatistikler</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedUser._count.services}
                      </div>
                      <div className="text-sm text-gray-600">Hizmet</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {selectedUser._count.bookings}
                      </div>
                      <div className="text-sm text-gray-600">Rezervasyon</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {selectedUser._count.reviews}
                      </div>
                      <div className="text-sm text-gray-600">Değerlendirme</div>
                    </div>
                  </div>
                </div>

                {selectedUser.rating > 0 && (
                  <div>
                    <h4 className="text-md font-semibold text-gray-900 mb-3">Puanlama</h4>
                    <div className="flex items-center">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarSolidIcon
                            key={star}
                            className={`h-5 w-5 ${
                              star <= Math.round(selectedUser.rating)
                                ? 'text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-gray-600">
                        {selectedUser.rating.toFixed(1)} ({selectedUser.reviewCount} değerlendirme)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
