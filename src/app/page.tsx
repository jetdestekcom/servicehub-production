'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  MagnifyingGlassIcon, 
  MapPinIcon,
  ClockIcon,
  ShieldCheckIcon,
  StarIcon,
  ArrowRightIcon,
  HeartIcon,
  SparklesIcon,
  FunnelIcon,
  ChatBubbleLeftRightIcon,
  FireIcon,
  UserGroupIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline'
import { AIRecommendations } from '@/components/AIRecommendations'
import { FeaturedServices } from '@/components/FeaturedServices'
import ServiceCard from '@/components/ServiceCard'
import { CityAutocomplete } from '@/components/CityAutocomplete'
import { CategoryAutocomplete } from '@/components/CategoryAutocomplete'

const popularServices = [
  { name: 'Ev Temizliği', icon: '🏠', count: '1,250+', category: 'Temizlik' },
  { name: 'Teknik Destek', icon: '💻', count: '890+', category: 'Teknik Destek' },
  { name: 'Nakliye', icon: '🚚', count: '650+', category: 'Nakliyat' },
  { name: 'Boyama', icon: '🎨', count: '420+', category: 'Boyama' },
  { name: 'Bahçe Bakımı', icon: '🌱', count: '380+', category: 'Bahçıvanlık' },
  { name: 'Özel Ders', icon: '📚', count: '540+', category: 'Eğitim' }
]

const advantages = [
  {
    icon: ClockIcon,
    title: 'Hızlı Eşleştirme',
    description: 'Ortalama 5 dakikada uygun hizmet vereni bul'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Güvenli Ödeme',
    description: 'Tüm ödemeler korumalı, paran güvende'
  },
  {
    icon: StarIcon,
    title: 'Kaliteli Hizmet',
    description: 'Sadece puanlı ve doğrulanmış uzmanlar'
  }
]


export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [recentServices, setRecentServices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Fetch recent services
    const fetchRecentServices = async () => {
      try {
        const response = await fetch('/api/services?limit=6&sortBy=createdAt&sortOrder=desc')
        if (response.ok) {
          const data = await response.json()
          console.log('Fetched services:', data) // Debug log
          if (data.success && data.data && data.data.services) {
            console.log('Setting services from data.data.services:', data.data.services.length)
            setRecentServices(data.data.services)
          } else if (data.services) {
            console.log('Setting services from data.services:', data.services.length)
            setRecentServices(data.services)
          } else {
            console.log('No services found in response')
            setRecentServices([])
          }
        }
      } catch (error) {
        console.error('Error fetching services:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecentServices()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const params = new URLSearchParams({
        q: searchQuery.trim(),
        ...(location.trim() && { location: location.trim() })
      })
      router.push(`/search?${params.toString()}`)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-visible">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20" style={{ zIndex: 1 }}>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                İhtiyacın Olan
                <span className="block text-yellow-400">Hizmeti Hemen Bul</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Ev temizliğinden teknik desteğe, bahçe bakımından nakliyeye kadar 
                binlerce profesyonel hizmet veren. Hızlı, güvenli ve uygun fiyatlı.
              </p>
              
              <form onSubmit={handleSearch} className="bg-white rounded-2xl p-6 shadow-2xl relative" style={{ zIndex: 100 }}>
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-[2] relative" style={{ zIndex: 200 }}>
                    <CategoryAutocomplete
                      value={searchQuery}
                      onChange={setSearchQuery}
                      placeholder="Hangi hizmeti arıyorsun? (örn: Ev Temizliği, Teknik Destek)"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <CityAutocomplete
                      value={location}
                      onChange={setLocation}
                      placeholder="Konum (örn: İstanbul)"
                    />
                  </div>
                  
                   <button
                     type="submit"
                     className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 whitespace-nowrap flex-shrink-0"
                   >
                     Ara
                     <ArrowRightIcon className="h-5 w-5" />
                   </button>
                </div>
              </form>

              <div className="mt-8 flex flex-wrap gap-4">
                <span className="text-sm text-blue-100">Popüler aramalar:</span>
                {['Ev temizliği', 'Teknik destek', 'Nakliye', 'Boyama'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm transition-colors duration-200"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 relative">
                {/* Background Image with 67% opacity */}
                <div 
                  className="absolute inset-0 rounded-3xl"
                  style={{
                    backgroundImage: `url('/destek.svg')`,
                    backgroundSize: 'contain',
                    backgroundPosition: 'right center',
                    backgroundRepeat: 'no-repeat',
                    opacity: 0.67
                  }}
                />
                
                <div className="text-center relative z-10">
                  <p className="text-blue-100 mb-4 text-lg">
                    Türkiye&apos;nin en hızlı hizmet platformu
                  </p>
                  <p className="text-sm text-blue-200 mb-4 leading-relaxed">
                    Düşük komisyon oranlarımız ile hizmet verenlerin kazancını artırırken, 
                    müşterilere en kaliteli hizmeti en uygun fiyata sunuyoruz.
                  </p>
                  <p className="text-sm text-blue-300 mb-6 font-medium">
                    Her zaman yanınızdayız. Sorularınız için 7/24 destek alabilirsiniz.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-yellow-400">50K+</div>
                      <div className="text-sm text-blue-100">Mutlu Müşteri</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-yellow-400">10K+</div>
                      <div className="text-sm text-blue-100">Uzman Hizmet Veren</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Popular Services */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popüler Hizmetler
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              En çok tercih edilen hizmet kategorileri
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {popularServices.map((service, index) => (
              <Link
                key={service.name}
                href={`/search?category=${encodeURIComponent(service.category)}`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-4">{service.icon}</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {service.count} hizmet veren
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Güvenli Ödeme</h3>
              <p className="text-gray-600 leading-relaxed">
                Tüm ödemeleriniz Stripe güvencesi ile korunur. Paranız güvende.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Hızlı Eşleştirme</h3>
              <p className="text-gray-600 leading-relaxed">
                Al destekli algoritmamız ile size en uygun hizmet vereni bulur.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Düşük Komisyon</h3>
              <p className="text-gray-600 leading-relaxed">
                Sadece %8 komisyon ile hizmet verenlerden daha az para alırız.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center p-6 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-300"
            >
              <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">7/24 Destek</h3>
              <p className="text-gray-600 leading-relaxed">
                Her zaman yanınızdayız. Sorularınız için 7/24 destek alabilirsiniz.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Recent Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Son Eklenen Hizmetler
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Platforma yeni eklenen ve kaliteli hizmetler
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-gray-200 rounded-2xl p-6 animate-pulse">
                  <div className="h-48 bg-gray-300 rounded-xl mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-4"></div>
                  <div className="h-8 bg-gray-300 rounded"></div>
                </div>
              ))}
            </div>
          ) : recentServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {recentServices.map((service, index) => {
                console.log('Rendering service:', service.title, 'Provider:', service.provider?.name)
                return (
                  <ServiceCard 
                    key={service.id} 
                    service={service}
                  />
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Henüz hizmet bulunmuyor
              </h3>
              <p className="text-gray-600 mb-6">
                İlk hizmeti eklemek için giriş yapın
              </p>
              <Link
                href="/auth/signin"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
              >
                Giriş Yap
              </Link>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/services"
              className="bg-white hover:bg-gray-50 text-blue-600 font-semibold py-3 px-8 rounded-xl border-2 border-blue-600 transition-colors duration-200 inline-flex items-center gap-2"
            >
              Tüm Hizmetleri Görüntüle
              <ArrowRightIcon className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* AI Recommendations */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              AI Destekli Öneriler
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Yapay zeka teknolojisi ile size en uygun hizmetleri öneriyoruz
            </p>
          </div>
          <AIRecommendations />
        </div>
      </section>

      {/* Advantages */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Neden JetDestek.com?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Rakiplerimizden farkımız
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {advantages.map((advantage, index) => (
              <motion.div
                key={advantage.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-lg text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <advantage.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {advantage.title}
                </h3>
                <p className="text-gray-600">
                  {advantage.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Yeni Özellikler */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Rakiplerimizden Çok Daha İyi Özellikler
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              20+ hizmet kategorisi, AI destekli arama, gelişmiş güvenlik ve 10+ fiyatlandırma modeli ile sektörde en kapsamlı platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Akıllı Arama */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <SparklesIcon className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                AI Destekli Akıllı Arama
              </h3>
              <p className="text-gray-600 mb-6">
                Yapay zeka ile ihtiyacınıza en uygun hizmeti bulun. Önceki aramalarınız ve tercihleriniz analiz edilerek kişiselleştirilmiş öneriler sunuyoruz.
              </p>
              <Link
                href="/smart-search"
                className="inline-flex items-center text-purple-600 font-semibold hover:text-purple-700 transition-colors"
              >
                Akıllı Aramayı Dene
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Link>
            </motion.div>

            {/* Favori Sistemi */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
                <HeartIcon className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Favori Hizmetler
              </h3>
              <p className="text-gray-600 mb-6">
                Beğendiğiniz hizmetleri favorilere ekleyin ve kolayca takip edin. Tekrar arama yapmadan hızlıca rezervasyon yapabilirsiniz.
              </p>
              <Link
                href="/favorites"
                className="inline-flex items-center text-red-600 font-semibold hover:text-red-700 transition-colors"
              >
                Favorilerimi Gör
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Link>
            </motion.div>

            {/* Gelişmiş Filtreleme */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <FunnelIcon className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Gelişmiş Filtreleme
              </h3>
              <p className="text-gray-600 mb-6">
                Bütçe, konum, aciliyet, özellikler ve daha fazlasına göre filtreleme yapın. Aradığınız hizmeti en kısa sürede bulun.
              </p>
              <Link
                href="/search"
                className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                Gelişmiş Aramayı Dene
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Link>
            </motion.div>

            {/* Paket Hizmetler */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheckIcon className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Paket Hizmetler
              </h3>
              <p className="text-gray-600 mb-6">
                Birden fazla hizmeti bir arada alın ve indirimli fiyatlardan yararlanın. Özel paketlerle hem tasarruf edin hem de kaliteli hizmet alın.
              </p>
              <Link
                href="/services"
                className="inline-flex items-center text-green-600 font-semibold hover:text-green-700 transition-colors"
              >
                Paketleri İncele
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Link>
            </motion.div>

            {/* Real-time Chat */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Anlık Mesajlaşma
              </h3>
              <p className="text-gray-600 mb-6">
                Hizmet verenlerle gerçek zamanlı mesajlaşın. Sorularınızı anında sorun, detayları netleştirin ve hızlı iletişim kurun.
              </p>
              <Link
                href="/messages"
                className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
              >
                Mesajları Gör
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Link>
            </motion.div>

            {/* Güvenli Ödeme */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheckIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Escrow Ödeme Sistemi
              </h3>
              <p className="text-gray-600 mb-6">
                Ödemeniz güvenli bir şekilde tutulur ve hizmet tamamlandıktan sonra hizmet verene aktarılır. Hem siz hem de hizmet veren güvende.
              </p>
              <Link
                href="/services"
                className="inline-flex items-center text-yellow-600 font-semibold hover:text-yellow-700 transition-colors"
              >
                Hizmet Al
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Link>
            </motion.div>

            {/* 20+ Hizmet Kategorisi */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                20+ Hizmet Kategorisi
              </h3>
              <p className="text-gray-600 mb-6">
                Ev hizmetlerinden teknolojiye, eğitimden sağlığa kadar 20+ kategori ve 200+ alt kategoride binlerce hizmet seçeneği.
              </p>
              <Link
                href="/services"
                className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
              >
                Kategorileri Keşfet
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Link>
            </motion.div>

            {/* 10+ Fiyatlandırma Modeli */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">💰</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                10+ Fiyatlandırma Modeli
              </h3>
              <p className="text-gray-600 mb-6">
                Sabit, saatlik, günlük, paket, açık artırma ve daha fazlası. Her hizmet için en uygun fiyatlandırma seçeneği.
              </p>
              <Link
                href="/services"
                className="inline-flex items-center text-green-600 font-semibold hover:text-green-700 transition-colors"
              >
                Fiyatları Gör
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Link>
            </motion.div>

            {/* Gelişmiş Güvenlik */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
                <ShieldCheckIcon className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Gelişmiş Güvenlik
              </h3>
              <p className="text-gray-600 mb-6">
                2FA, fraud detection, şifre politikaları, IP engelleme ve daha fazlası ile en güvenli platform deneyimi.
              </p>
              <Link
                href="/profile"
                className="inline-flex items-center text-red-600 font-semibold hover:text-red-700 transition-colors"
              >
                Güvenlik Ayarları
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Hemen Başla!
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              İhtiyacın olan hizmeti bul, güvenli ödeme yap, hızlı çözüm al. 
              Hizmet veren olarak da para kazanmaya başla!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/services"
                className="bg-white text-blue-600 font-semibold py-4 px-8 rounded-xl hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2"
              >
                Hizmet Al
                <ArrowRightIcon className="h-5 w-5" />
              </Link>
              <a
                href="/auth/signup"
                className="bg-transparent border-2 border-white text-white font-semibold py-4 px-8 rounded-xl hover:bg-white hover:text-blue-600 transition-colors duration-200"
              >
                Hizmet Ver
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}