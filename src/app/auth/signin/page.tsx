'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

export default function SignInPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [isBlocked, setIsBlocked] = useState(false)

  // Rate limiting kontrolü
  useEffect(() => {
    const storedAttempts = localStorage.getItem('loginAttempts')
    const lastAttempt = localStorage.getItem('lastLoginAttempt')
    
    if (storedAttempts && lastAttempt) {
      const attempts = parseInt(storedAttempts)
      const lastAttemptTime = parseInt(lastAttempt)
      const now = Date.now()
      const timeDiff = now - lastAttemptTime
      
      if (attempts >= 5 && timeDiff < 15 * 60 * 1000) { // 15 dakika
        setIsBlocked(true)
        setError('Çok fazla başarısız giriş denemesi. 15 dakika bekleyin.')
      } else if (timeDiff >= 15 * 60 * 1000) {
        // 15 dakika geçmişse sıfırla
        localStorage.removeItem('loginAttempts')
        localStorage.removeItem('lastLoginAttempt')
        setAttempts(0)
        setIsBlocked(false)
      } else {
        setAttempts(attempts)
      }
    }
  }, [])

  // Input validation
  const validateInput = (email: string, password: string) => {
    if (!email || !password) {
      return 'Email ve şifre gerekli'
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return 'Geçersiz email formatı'
    }

    if (password.length < 6) {
      return 'Şifre en az 6 karakter olmalı'
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (isBlocked) {
      return
    }

    // Input validation
    const validationError = validateInput(formData.email, formData.password)
    if (validationError) {
      setError(validationError)
      return
    }

    setIsLoading(true)
    setError('')
    setSuccess('')
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
        }),
      })

      const data = await response.json()
      
      if (!response.ok) {
        const newAttempts = attempts + 1
        setAttempts(newAttempts)
        localStorage.setItem('loginAttempts', newAttempts.toString())
        localStorage.setItem('lastLoginAttempt', Date.now().toString())
        
        if (newAttempts >= 5) {
          setIsBlocked(true)
          setError('Çok fazla başarısız giriş denemesi. 15 dakika bekleyin.')
        } else {
          setError(data.error || 'Geçersiz email veya şifre')
        }
      } else {
        // Başarılı giriş
        localStorage.removeItem('loginAttempts')
        localStorage.removeItem('lastLoginAttempt')
        setSuccess('Giriş başarılı! Yönlendiriliyorsunuz...')
        
        setTimeout(() => {
          router.push('/dashboard')
        }, 1000)
      }
    } catch (error) {
      console.error('Giriş hatası:', error)
      setError('Giriş sırasında bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // XSS koruması
    const sanitizedValue = value.replace(/[<>]/g, '')
    
    setFormData(prev => ({
      ...prev,
      [name]: sanitizedValue
    }))
    
    // Hata mesajını temizle
    if (error) {
      setError('')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Güvenli Giriş</h2>
          <p className="mt-2 text-sm text-gray-600">
            Hesabınız yok mu?{' '}
            <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
              Kayıt olun
            </Link>
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Hata/Success mesajları */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center"
            >
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
              <span className="text-sm text-red-700">{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md flex items-center"
            >
              <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
              <span className="text-sm text-green-700">{success}</span>
            </motion.div>
          )}

          {/* Rate limiting uyarısı */}
          {attempts > 0 && !isBlocked && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-700">
                Kalan deneme hakkınız: {5 - attempts}
              </p>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                E-posta
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isBlocked}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="ornek@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Şifre
              </label>
              <div className="mt-1 relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isBlocked}
                  className="appearance-none block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isBlocked}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={isBlocked}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Beni hatırla
                </label>
              </div>

              <div className="text-sm">
                <Link href="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Şifremi unuttum
                </Link>
              </div>
            </div>

            <div>
              <motion.button
                type="submit"
                disabled={isLoading || isBlocked}
                whileHover={!isLoading && !isBlocked ? { scale: 1.02 } : {}}
                whileTap={!isLoading && !isBlocked ? { scale: 0.98 } : {}}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : isBlocked ? (
                  'Engellenmiş'
                ) : (
                  <>
                    Giriş Yap
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </>
                )}
              </motion.button>
            </div>
          </form>


          {/* Güvenlik bilgisi */}
          <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-xs text-blue-700">
              🔒 Güvenli bağlantı kullanıyoruz. Bilgileriniz şifrelenerek korunmaktadır.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}