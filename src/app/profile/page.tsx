'use client'

import { useState, useEffect } from 'react'
import { useSessionSafe } from '@/lib/session-utils'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  UserIcon,
  PencilIcon,
  CameraIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  StarIcon,
  CalendarIcon,
  CogIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

interface UserProfile {
  id: string
  name: string
  email: string
  phone?: string
  image?: string
  role: string
  isVerified: boolean
  rating: number
  reviewCount: number
  createdAt: string
  location?: string
  bio?: string
  services?: Array<{
    id: string
    title: string
    category: string
    price: number
    rating: number
    reviewCount: number
  }>
  bookings?: Array<{
    id: string
    serviceTitle: string
    status: string
    scheduledDate: string
    totalAmount: number
  }>
}

export default function ProfilePage() {
  const { data: session, status } = useSessionSafe()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'profile' | 'services' | 'bookings' | 'settings'>('profile')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
      return
    }

    if (status === 'authenticated' && session?.user) {
      fetchProfile()
    }
  }, [status, session, router])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      }
    } catch (error) {
      console.error('Profil yüklenirken hata:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProfile = async (formData: FormData) => {
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        body: formData
      })

      if (response.ok) {
        const updatedProfile = await response.json()
        setProfile(updatedProfile)
        setIsEditing(false)
      }
    } catch (error) {
      console.error('Profil güncellenirken hata:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Profil Bulunamadı</h2>
          <p className="text-gray-600">Profil bilgileriniz yüklenemedi.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Profilim</h1>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <img
                    src={profile.image || '/placeholder-avatar.png'}
                    alt={profile.name}
                    className="h-24 w-24 rounded-full object-cover mx-auto"
                  />
                  <button className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 hover:bg-blue-700 transition-colors">
                    <CameraIcon className="h-4 w-4" />
                  </button>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 mt-4">{profile.name}</h2>
                <p className="text-gray-600">{profile.email}</p>
                
                {profile.isVerified && (
                  <div className="flex items-center justify-center mt-2 text-green-600">
                    <ShieldCheckIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm font-medium">Doğrulanmış</span>
                  </div>
                )}

                <div className="flex items-center justify-center mt-3">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarSolidIcon
                        key={star}
                        className={`h-4 w-4 ${
                          star <= Math.round(profile.rating)
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {profile.rating.toFixed(1)} ({profile.reviewCount} değerlendirme)
                  </span>
                </div>

                <div className="mt-6 space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    {new Date(profile.createdAt).toLocaleDateString('tr-TR')} tarihinde katıldı
                  </div>
                  {profile.location && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      {profile.location}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="mt-6 bg-white rounded-xl shadow-sm">
              <nav className="p-2">
                {[
                  { id: 'profile', label: 'Profil Bilgileri', icon: UserIcon },
                  { id: 'services', label: 'Hizmetlerim', icon: CogIcon },
                  { id: 'bookings', label: 'Rezervasyonlarım', icon: CalendarIcon },
                  { id: 'settings', label: 'Ayarlar', icon: CogIcon }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'profile' | 'services' | 'bookings' | 'settings')}
                    className={`w-full flex items-center px-4 py-3 text-left text-sm font-medium rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="h-5 w-5 mr-3" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {activeTab === 'profile' && (
              <ProfileTab 
                profile={profile} 
                isEditing={isEditing}
                onEdit={() => setIsEditing(true)}
                onSave={handleUpdateProfile}
                onCancel={() => setIsEditing(false)}
              />
            )}
            
            {activeTab === 'services' && (
              <ServicesTab services={profile.services || []} />
            )}
            
            {activeTab === 'bookings' && (
              <BookingsTab bookings={profile.bookings || []} />
            )}
            
            {activeTab === 'settings' && (
              <SettingsTab />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfileTab({ 
  profile, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel 
}: { 
  profile: UserProfile
  isEditing: boolean
  onEdit: () => void
  onSave: (formData: FormData) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState({
    name: profile.name,
    phone: profile.phone || '',
    location: profile.location || '',
    bio: profile.bio || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const form = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value)
    })
    onSave(form)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Profil Bilgileri</h3>
          {!isEditing && (
            <button
              onClick={onEdit}
              className="flex items-center px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <PencilIcon className="h-4 w-4 mr-1" />
              Düzenle
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ad Soyad
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Telefon
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Konum
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hakkımda
              </label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Kendiniz hakkında kısa bir açıklama yazın..."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                İptal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                Kaydet
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Ad Soyad
                </label>
                <p className="text-gray-900">{profile.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Email
                </label>
                <p className="text-gray-900">{profile.email}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Telefon
                </label>
                <p className="text-gray-900">{profile.phone || 'Belirtilmemiş'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Konum
                </label>
                <p className="text-gray-900">{profile.location || 'Belirtilmemiş'}</p>
              </div>
            </div>

            {profile.bio && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">
                  Hakkımda
                </label>
                <p className="text-gray-900">{profile.bio}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function ServicesTab({ services }: { services: UserProfile['services'] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Hizmetlerim</h3>
      </div>
      
      <div className="p-6">
        {!services || services.length === 0 ? (
          <div className="text-center py-8">
            <CogIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Henüz hizmet eklemediniz</h4>
            <p className="text-gray-600 mb-4">İlk hizmetinizi ekleyerek para kazanmaya başlayın!</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Hizmet Ekle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => (
              <div key={service.id} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">{service.title}</h4>
                <p className="text-sm text-gray-600 mb-2">{service.category}</p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">₺{service.price}</span>
                  <div className="flex items-center">
                    <StarSolidIcon className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="text-sm text-gray-600">
                      {service.rating.toFixed(1)} ({service.reviewCount})
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function BookingsTab({ bookings }: { bookings: UserProfile['bookings'] }) {
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Rezervasyonlarım</h3>
      </div>
      
      <div className="p-6">
        {!bookings || bookings.length === 0 ? (
          <div className="text-center py-8">
            <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h4 className="text-lg font-medium text-gray-900 mb-2">Henüz rezervasyon yok</h4>
            <p className="text-gray-600">Hizmet almak için rezervasyon yapın!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div key={booking.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">{booking.serviceTitle}</h4>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.status === 'confirmed' ? 'Onaylandı' :
                     booking.status === 'pending' ? 'Beklemede' : 'İptal'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{new Date(booking.scheduledDate).toLocaleDateString('tr-TR')}</span>
                  <span className="font-semibold">₺{booking.totalAmount}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function SettingsTab() {
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Ayarlar</h3>
      </div>
      
      <div className="p-6 space-y-6">
        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Bildirim Ayarları</h4>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600" defaultChecked />
              <span className="ml-2 text-sm text-gray-700">Email bildirimleri</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600" defaultChecked />
              <span className="ml-2 text-sm text-gray-700">SMS bildirimleri</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
              <span className="ml-2 text-sm text-gray-700">Push bildirimleri</span>
            </label>
          </div>
        </div>

        <div>
          <h4 className="text-md font-medium text-gray-900 mb-4">Gizlilik</h4>
          <div className="space-y-3">
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600" defaultChecked />
              <span className="ml-2 text-sm text-gray-700">Profilimi herkese açık göster</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300 text-blue-600" />
              <span className="ml-2 text-sm text-gray-700">Konumumu paylaş</span>
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <button className="text-red-600 hover:text-red-700 text-sm font-medium">
            Hesabı Sil
          </button>
        </div>
      </div>
    </div>
  )
}
