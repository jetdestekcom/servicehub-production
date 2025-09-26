'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BellIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ClockIcon,
  UserIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

interface Notification {
  id: string
  type: 'success' | 'warning' | 'info' | 'booking' | 'payment' | 'message'
  title: string
  message: string
  timestamp: Date
  isRead: boolean
  actionUrl?: string
  actionText?: string
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'booking',
    title: 'Yeni Rezervasyon',
    message: 'Ayşe Yılmaz ev temizliği hizmeti için rezervasyon yaptı.',
    timestamp: new Date('2024-01-25T10:30:00'),
    isRead: false,
    actionUrl: '/dashboard',
    actionText: 'Görüntüle'
  },
  {
    id: '2',
    type: 'payment',
    title: 'Ödeme Alındı',
    message: '₺150 ödeme başarıyla alındı. Hesabınıza yatırıldı.',
    timestamp: new Date('2024-01-25T09:15:00'),
    isRead: false,
    actionUrl: '/dashboard/earnings',
    actionText: 'Detaylar'
  },
  {
    id: '3',
    type: 'message',
    title: 'Yeni Mesaj',
    message: 'Mehmet Kaya size mesaj gönderdi.',
    timestamp: new Date('2024-01-25T08:45:00'),
    isRead: true,
    actionUrl: '/dashboard/messages',
    actionText: 'Yanıtla'
  },
  {
    id: '4',
    type: 'success',
    title: 'Hizmet Tamamlandı',
    message: 'Bahçe bakımı hizmeti başarıyla tamamlandı.',
    timestamp: new Date('2024-01-24T16:20:00'),
    isRead: true,
    actionUrl: '/dashboard',
    actionText: 'Görüntüle'
  },
  {
    id: '5',
    type: 'warning',
    title: 'Rezervasyon İptal Edildi',
    message: 'Fatma Demir rezervasyonunu iptal etti.',
    timestamp: new Date('2024-01-24T14:10:00'),
    isRead: true,
    actionUrl: '/dashboard',
    actionText: 'Detaylar'
  }
]

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const unread = notifications.filter(n => !n.isRead).length
    setUnreadCount(unread)
  }, [notifications])

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, isRead: true }))
    )
  }

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
      case 'info':
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />
      case 'booking':
        return <UserIcon className="h-5 w-5 text-purple-500" />
      case 'payment':
        return <CurrencyDollarIcon className="h-5 w-5 text-green-500" />
      case 'message':
        return <ClockIcon className="h-5 w-5 text-blue-500" />
      default:
        return <BellIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Şimdi'
    if (minutes < 60) return `${minutes} dk önce`
    if (hours < 24) return `${hours} saat önce`
    return `${days} gün önce`
  }

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-gray-200 z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Bildirimler</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Tümünü Okundu İşaretle
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <BellIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">Henüz bildirim yok</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {notifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className={`p-4 hover:bg-gray-50 transition-colors ${
                        !notification.isRead ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className={`text-sm font-semibold ${
                                !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                              }`}>
                                {notification.title}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {formatTime(notification.timestamp)}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 ml-2">
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                              )}
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                              >
                                <XMarkIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          {notification.actionUrl && (
                            <div className="mt-3">
                              <button
                                onClick={() => {
                                  markAsRead(notification.id)
                                  // Navigate to action URL
                                  window.location.href = notification.actionUrl!
                                }}
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                              >
                                {notification.actionText}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-gray-200">
                <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Tüm Bildirimleri Görüntüle
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}



