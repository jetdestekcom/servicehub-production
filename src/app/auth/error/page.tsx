'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ExclamationTriangleIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { Suspense } from 'react'

function AuthErrorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return 'Sunucu yapılandırma hatası. Lütfen daha sonra tekrar deneyin.'
      case 'AccessDenied':
        return 'Erişim reddedildi. Lütfen tekrar deneyin.'
      case 'Verification':
        return 'Doğrulama hatası. Lütfen tekrar deneyin.'
      case 'Default':
        return 'Bir hata oluştu. Lütfen tekrar deneyin.'
      default:
        return 'Bilinmeyen bir hata oluştu. Lütfen tekrar deneyin.'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8"
      >
        <div className="text-center">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-500 hover:text-gray-700 mb-4"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Geri
          </button>
          
          <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Hata Oluştu</h2>
          <p className="text-gray-600 mb-8">
            {getErrorMessage(error)}
          </p>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => router.push('/auth/signin')}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Tekrar Dene
          </button>
          
          <button
            onClick={() => router.push('/')}
            className="w-full text-blue-600 hover:text-blue-700 font-medium"
          >
            Ana Sayfaya Dön
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Sorun devam ederse{' '}
            <a href="mailto:support@servicehub.com" className="font-medium text-blue-600 hover:text-blue-500">
              destek ekibi
            </a>
            {' '}ile iletişime geçin.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default function AuthError() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <AuthErrorContent />
    </Suspense>
  )
}
