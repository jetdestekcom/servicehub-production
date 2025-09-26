'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { signOut } from 'next-auth/react'
import { useMockSession } from '@/lib/session-utils'
import { motion } from 'framer-motion'
import { NotificationCenter } from './NotificationCenter'
import { 
  Bars3Icon, 
  XMarkIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  
  const { data: session, status } = useMockSession()

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center"
            >
              <div className="w-48 h-20 relative">
                <Image
                  src="/jd.svg"
                  alt="JetDestek Logo"
                  fill
                  sizes="192px"
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/search" 
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Hizmet Ara
            </Link>
            <Link 
              href="/services" 
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Hizmetler
            </Link>
            <Link 
              href="/smart-search" 
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Akıllı Arama
            </Link>
            <Link 
              href="/providers" 
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Hizmet Verenler
            </Link>
            <Link 
              href="/favorites" 
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Favorilerim
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              Hakkımızda
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {status === 'loading' ? (
              <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
            ) : session ? (
              <div className="flex items-center space-x-4">
                <NotificationCenter />
                <Link
                  href="/dashboard"
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  <UserIcon className="h-5 w-5" />
                  <span>{session.user?.name || 'Hesap'}</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors duration-200"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                  <span>Çıkış</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/auth/signin"
                  className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
            >
              {isOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 py-4"
          >
          <div className="space-y-4">
            <Link 
              href="/search" 
              className="block text-gray-700 hover:text-blue-600 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Hizmet Ara
            </Link>
            <Link 
              href="/services" 
              className="block text-gray-700 hover:text-blue-600 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Hizmetler
            </Link>
            <Link 
              href="/providers" 
              className="block text-gray-700 hover:text-blue-600 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Hizmet Verenler
            </Link>
            <Link 
              href="/about" 
              className="block text-gray-700 hover:text-blue-600 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              Hakkımızda
            </Link>
              
              <div className="border-t border-gray-200 pt-4">
                {session ? (
                  <div className="space-y-4">
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      <UserIcon className="h-5 w-5" />
                      <span>{session.user?.name || 'Hesap'}</span>
                    </Link>
                    <button
                      onClick={() => {
                        signOut()
                        setIsOpen(false)
                      }}
                      className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors duration-200"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      <span>Çıkış</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Link
                      href="/auth/signin"
                      className="block text-gray-700 hover:text-blue-600 transition-colors duration-200"
                      onClick={() => setIsOpen(false)}
                    >
                      Giriş Yap
                    </Link>
                    <Link
                      href="/auth/signup"
                      className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 text-center"
                      onClick={() => setIsOpen(false)}
                    >
                      Kayıt Ol
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  )
}
