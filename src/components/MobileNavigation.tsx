'use client'

import { useState } from 'react'
import { useMockSession } from '@/lib/session-utils'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  HomeIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  CogIcon,
  Bars3Icon,
  XMarkIcon,
  BellIcon,
  PlusIcon,
  CalendarIcon,
  StarIcon
} from '@heroicons/react/24/outline'

export function MobileNavigation() {
  const { data: session } = useMockSession()
  
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  const navigationItems = [
    { name: 'Ana Sayfa', href: '/', icon: HomeIcon },
    { name: 'Hizmetler', href: '/services', icon: MagnifyingGlassIcon },
    { name: 'Mesajlar', href: '/messages', icon: ChatBubbleLeftRightIcon },
    { name: 'Rezervasyonlar', href: '/bookings/manage', icon: CalendarIcon },
    { name: 'Profil', href: '/profile', icon: UserIcon },
  ]

  const providerItems = [
    { name: 'Hizmetlerim', href: '/services/manage', icon: CogIcon },
    { name: 'Yeni Hizmet', href: '/services/manage', icon: PlusIcon },
  ]

  const isActive = (href: string) => pathname === href

  const handleNavigation = (href: string) => {
    router.push(href)
    setIsOpen(false)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 z-40 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setIsOpen(false)}
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-bold text-gray-900">Menü</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                {/* User Info */}
                {session?.user && (
                  <div className="flex items-center space-x-3 mb-8 p-4 bg-gray-50 rounded-lg">
                    <img
                      src={session.user.image || '/placeholder-avatar.png'}
                      alt={session.user.name || 'User'}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {session.user.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {session.user.role === 'ADMIN' ? 'Admin' :
                         session.user.role === 'PROVIDER' ? 'Hizmet Sağlayıcı' :
                         'Müşteri'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Navigation Items */}
                <nav className="space-y-2">
                  {navigationItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => handleNavigation(item.href)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        isActive(item.href)
                          ? 'bg-blue-50 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                    </button>
                  ))}

                  {/* Provider Items */}
                  {session?.user?.role === 'PROVIDER' && (
                    <>
                      <div className="border-t border-gray-200 my-4" />
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">
                        Hizmet Sağlayıcı
                      </p>
                      {providerItems.map((item) => (
                        <button
                          key={item.name}
                          onClick={() => handleNavigation(item.href)}
                          className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                            isActive(item.href)
                              ? 'bg-blue-50 text-blue-700'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          <span className="font-medium">{item.name}</span>
                        </button>
                      ))}
                    </>
                  )}

                  {/* Admin Items */}
                  {session?.user?.role === 'ADMIN' && (
                    <>
                      <div className="border-t border-gray-200 my-4" />
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 mb-2">
                        Yönetim
                      </p>
                      <button
                        onClick={() => handleNavigation('/admin')}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                          isActive('/admin')
                            ? 'bg-blue-50 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <CogIcon className="h-5 w-5" />
                        <span className="font-medium">Admin Panel</span>
                      </button>
                    </>
                  )}
                </nav>

                {/* Bottom Actions */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => handleNavigation('/notifications')}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <BellIcon className="h-5 w-5" />
                    <span className="font-medium">Bildirimler</span>
                  </button>
                  
                  <button
                    onClick={() => handleNavigation('/settings')}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <CogIcon className="h-5 w-5" />
                    <span className="font-medium">Ayarlar</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="grid grid-cols-5 h-16">
          {navigationItems.slice(0, 5).map((item) => (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.href)}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                isActive(item.href)
                  ? 'text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

