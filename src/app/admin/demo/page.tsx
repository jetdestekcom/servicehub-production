'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  PlayIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  UserIcon,
  ClipboardDocumentListIcon,
  CurrencyDollarIcon,
  ChatBubbleLeftRightIcon,
  BellIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

interface DemoData {
  users: number
  services: number
  bookings: number
  reviews: number
  notifications: number
}

export default function DemoPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')
  const [demoData, setDemoData] = useState<DemoData | null>(null)

  const loadDemoData = async () => {
    setIsLoading(true)
    setError('')
    setIsSuccess(false)

    try {
      const response = await fetch('/api/demo/seed', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (result.success) {
        setIsSuccess(true)
        setDemoData(result.data)
      } else {
        setError(result.error || 'Demo veriler yüklenirken hata oluştu')
      }
    } catch (err) {
      setError('Sunucu hatası: ' + (err as Error).message)
    } finally {
      setIsLoading(false)
    }
  }

  const demoUsers = [
    {
      email: 'ayse@demo.com',
      password: 'demo123',
      role: 'Müşteri',
      name: 'Ayşe Yılmaz'
    },
    {
      email: 'ahmet@demo.com',
      password: 'demo123',
      role: 'Hizmet Veren',
      name: 'Ahmet Temizlik Uzmanı'
    },
    {
      email: 'mehmet@demo.com',
      password: 'demo123',
      role: 'Hizmet Veren',
      name: 'Mehmet Bahçıvan'
    },
    {
      email: 'fatma@demo.com',
      password: 'demo123',
      role: 'Hizmet Veren',
      name: 'Fatma Teknik Uzman'
    },
    {
      email: 'ali@demo.com',
      password: 'demo123',
      role: 'Müşteri',
      name: 'Ali Demir'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Admin Paneline Dön
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Demo Veri Yönetimi</h1>
          <p className="text-gray-600 mt-2">Test için demo kullanıcılar ve veriler oluşturun</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Demo Veri Yükleme */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Demo Verileri Yükle</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                <UserIcon className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-blue-800">5 Demo Kullanıcı</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                <ClipboardDocumentListIcon className="h-5 w-5 text-green-600" />
                <span className="text-sm text-green-800">5 Demo Hizmet</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                <CurrencyDollarIcon className="h-5 w-5 text-purple-600" />
                <span className="text-sm text-purple-800">3 Demo Rezervasyon</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                <ChatBubbleLeftRightIcon className="h-5 w-5 text-yellow-600" />
                <span className="text-sm text-yellow-800">3 Demo Yorum</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                <BellIcon className="h-5 w-5 text-orange-600" />
                <span className="text-sm text-orange-800">3 Demo Bildirim</span>
              </div>
            </div>

            <button
              onClick={loadDemoData}
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Yükleniyor...
                </>
              ) : (
                <>
                  <PlayIcon className="h-5 w-5" />
                  Demo Verileri Yükle
                </>
              )}
            </button>

            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-600" />
                  <span className="text-green-800 font-medium">Demo veriler başarıyla yüklendi!</span>
                </div>
                {demoData && (
                  <div className="mt-2 text-sm text-green-700">
                    <p>• {demoData.users} kullanıcı</p>
                    <p>• {demoData.services} hizmet</p>
                    <p>• {demoData.bookings} rezervasyon</p>
                    <p>• {demoData.reviews} yorum</p>
                    <p>• {demoData.notifications} bildirim</p>
                  </div>
                )}
              </motion.div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-600" />
                  <span className="text-red-800 font-medium">Hata: {error}</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Demo Kullanıcı Bilgileri */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Demo Kullanıcılar</h2>
            
            <div className="space-y-4">
              {demoUsers.map((user, index) => (
                <motion.div
                  key={user.email}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500 mt-1">Şifre: {user.password}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.role === 'Hizmet Veren' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Test İçin:</h3>
              <ol className="text-sm text-yellow-700 space-y-1">
                <li>1. Demo verileri yükleyin</li>
                <li>2. Yukarıdaki kullanıcılardan biriyle giriş yapın</li>
                <li>3. Platform özelliklerini test edin</li>
                <li>4. Hizmet veren olarak hizmet ekleyin</li>
                <li>5. Müşteri olarak rezervasyon yapın</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Özellik Listesi */}
        <div className="mt-8 bg-white rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Test Edilebilir Özellikler</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Kullanıcı Yönetimi</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Giriş/Kayıt sistemi</li>
                <li>• Profil yönetimi</li>
                <li>• Rol bazlı erişim</li>
                <li>• Kimlik doğrulama</li>
              </ul>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Hizmet Yönetimi</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Hizmet ekleme/düzenleme</li>
                <li>• Kategori yönetimi</li>
                <li>• Arama ve filtreleme</li>
                <li>• Hizmet detay sayfaları</li>
              </ul>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Rezervasyon Sistemi</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 4 adımlı booking</li>
                <li>• Tarih/saat seçimi</li>
                <li>• Rezervasyon takibi</li>
                <li>• Durum yönetimi</li>
              </ul>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Mesajlaşma</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Real-time chat</li>
                <li>• Typing indicators</li>
                <li>• Mesaj durumu</li>
                <li>• Dosya paylaşımı</li>
              </ul>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Bildirimler</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Real-time notifications</li>
                <li>• Bildirim merkezi</li>
                <li>• Okundu işaretleme</li>
                <li>• Aksiyon butonları</li>
              </ul>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Admin Panel</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Kullanıcı yönetimi</li>
                <li>• Hizmet onayları</li>
                <li>• İstatistikler</li>
                <li>• Sistem yönetimi</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



