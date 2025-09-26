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
  { name: 'Ev Temizli─ƒi', icon: '­ƒÅá', count: '1,250+', category: 'Temizlik' },
  { name: 'Teknik Destek', icon: '­ƒÆ╗', count: '890+', category: 'Teknik Destek' },
  { name: 'Nakliye', icon: '­ƒÜÜ', count: '650+', category: 'Nakliyat' },
  { name: 'Boyama', icon: '­ƒÄ¿', count: '420+', category: 'Boyama' },
  { name: 'Bah├ºe Bak─▒m─▒', icon: '­ƒî▒', count: '380+', category: 'Bah├º─▒vanl─▒k' },
  { name: '├ûzel Ders', icon: '­ƒôÜ', count: '540+', category: 'E─ƒitim' }
]

const advantages = [
  {
    icon: ClockIcon,
    title: 'H─▒zl─▒ E┼ƒle┼ƒtirme',
    description: 'Ortalama 5 dakikada uygun hizmet vereni bul'
  },
  {
    icon: ShieldCheckIcon,
    title: 'G├╝venli ├ûdeme',
    description: 'T├╝m ├Âdemeler korumal─▒, paran g├╝vende'
  },
  {
    icon: StarIcon,
    title: 'Kaliteli Hizmet',
    description: 'Sadece puanl─▒ ve do─ƒrulanm─▒┼ƒ uzmanlar'
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
                ─░htiyac─▒n Olan
                <span className="block text-yellow-400">Hizmeti Hemen Bul</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Ev temizli─ƒinden teknik deste─ƒe, bah├ºe bak─▒m─▒ndan nakliyeye kadar 
                binlerce profesyonel hizmet veren. H─▒zl─▒, g├╝venli ve uygun fiyatl─▒.
              </p>
              
              <form onSubmit={handleSearch} className="bg-white rounded-2xl p-6 shadow-2xl relative" style={{ zIndex: 100 }}>
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="flex-[2] relative" style={{ zIndex: 200 }}>
                    <CategoryAutocomplete
                      value={searchQuery}
                      onChange={setSearchQuery}
                      placeholder="Hangi hizmeti ar─▒yorsun? (├Ârn: Ev Temizli─ƒi, Teknik Destek)"
                    />
                  </div>
                  
                  <div className="flex-1">
                    <CityAutocomplete
                      value={location}
                      onChange={setLocation}
                      placeholder="Konum (├Ârn: ─░stanbul)"
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
                <span className="text-sm text-blue-100">Pop├╝ler aramalar:</span>
                {['Ev temizli─ƒi', 'Teknik destek', 'Nakliye', 'Boyama'].map((tag) => (
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
                    T├╝rkiye&apos;nin en h─▒zl─▒ hizmet platformu
                  </p>
                  <p className="text-sm text-blue-200 mb-4 leading-relaxed">
                    D├╝┼ƒ├╝k komisyon oranlar─▒m─▒z ile hizmet verenlerin kazanc─▒n─▒ art─▒r─▒rken, 
                    m├╝┼ƒterilere en kaliteli hizmeti en uygun fiyata sunuyoruz.
                  </p>
                  <p className="text-sm text-blue-300 mb-6 font-medium">
                    Her zaman yan─▒n─▒zday─▒z. Sorular─▒n─▒z i├ºin 7/24 destek alabilirsiniz.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-3xl font-bold text-yellow-400">50K+</div>
                      <div className="text-sm text-blue-100">Mutlu M├╝┼ƒteri</div>
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
              Pop├╝ler Hizmetler
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              En ├ºok tercih edilen hizmet kategorileri
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
              <h3 className="text-xl font-bold text-gray-900 mb-3">G├╝venli ├ûdeme</h3>
              <p className="text-gray-600 leading-relaxed">
                T├╝m ├Âdemeleriniz Stripe g├╝vencesi ile korunur. Paran─▒z g├╝vende.
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
              <h3 className="text-xl font-bold text-gray-900 mb-3">H─▒zl─▒ E┼ƒle┼ƒtirme</h3>
              <p className="text-gray-600 leading-relaxed">
                Al destekli algoritmam─▒z ile size en uygun hizmet vereni bulur.
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
              <h3 className="text-xl font-bold text-gray-900 mb-3">D├╝┼ƒ├╝k Komisyon</h3>
              <p className="text-gray-600 leading-relaxed">
                Sadece %8 komisyon ile hizmet verenlerden daha az para al─▒r─▒z.
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
                Her zaman yan─▒n─▒zday─▒z. Sorular─▒n─▒z i├ºin 7/24 destek alabilirsiniz.
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
                <span className="text-4xl">­ƒöì</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Hen├╝z hizmet bulunmuyor
              </h3>
              <p className="text-gray-600 mb-6">
                ─░lk hizmeti eklemek i├ºin giri┼ƒ yap─▒n
              </p>
              <Link
                href="/auth/signin"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200"
              >
                Giri┼ƒ Yap
              </Link>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/services"
              className="bg-white hover:bg-gray-50 text-blue-600 font-semibold py-3 px-8 rounded-xl border-2 border-blue-600 transition-colors duration-200 inline-flex items-center gap-2"
            >
              T├╝m Hizmetleri G├Âr├╝nt├╝le
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
              AI Destekli ├ûneriler
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Yapay zeka teknolojisi ile size en uygun hizmetleri ├Âneriyoruz
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
              Rakiplerimizden fark─▒m─▒z
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

      {/* Yeni ├ûzellikler */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Rakiplerimizden ├çok Daha ─░yi ├ûzellikler
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              20+ hizmet kategorisi, AI destekli arama, geli┼ƒmi┼ƒ g├╝venlik ve 10+ fiyatland─▒rma modeli ile sekt├Ârde en kapsaml─▒ platform
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Ak─▒ll─▒ Arama */}
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
                AI Destekli Ak─▒ll─▒ Arama
              </h3>
              <p className="text-gray-600 mb-6">
                Yapay zeka ile ihtiyac─▒n─▒za en uygun hizmeti bulun. ├ûnceki aramalar─▒n─▒z ve tercihleriniz analiz edilerek ki┼ƒiselle┼ƒtirilmi┼ƒ ├Âneriler sunuyoruz.
              </p>
              <Link
                href="/smart-search"
                className="inline-flex items-center text-purple-600 font-semibold hover:text-purple-700 transition-colors"
              >
                Ak─▒ll─▒ Aramay─▒ Dene
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
                Be─ƒendi─ƒiniz hizmetleri favorilere ekleyin ve kolayca takip edin. Tekrar arama yapmadan h─▒zl─▒ca rezervasyon yapabilirsiniz.
              </p>
              <Link
                href="/favorites"
                className="inline-flex items-center text-red-600 font-semibold hover:text-red-700 transition-colors"
              >
                Favorilerimi G├Âr
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Link>
            </motion.div>

            {/* Geli┼ƒmi┼ƒ Filtreleme */}
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
                Geli┼ƒmi┼ƒ Filtreleme
              </h3>
              <p className="text-gray-600 mb-6">
                B├╝t├ºe, konum, aciliyet, ├Âzellikler ve daha fazlas─▒na g├Âre filtreleme yap─▒n. Arad─▒─ƒ─▒n─▒z hizmeti en k─▒sa s├╝rede bulun.
              </p>
              <Link
                href="/search"
                className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                Geli┼ƒmi┼ƒ Aramay─▒ Dene
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
                Birden fazla hizmeti bir arada al─▒n ve indirimli fiyatlardan yararlan─▒n. ├ûzel paketlerle hem tasarruf edin hem de kaliteli hizmet al─▒n.
              </p>
              <Link
                href="/services"
                className="inline-flex items-center text-green-600 font-semibold hover:text-green-700 transition-colors"
              >
                Paketleri ─░ncele
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
                Anl─▒k Mesajla┼ƒma
              </h3>
              <p className="text-gray-600 mb-6">
                Hizmet verenlerle ger├ºek zamanl─▒ mesajla┼ƒ─▒n. Sorular─▒n─▒z─▒ an─▒nda sorun, detaylar─▒ netle┼ƒtirin ve h─▒zl─▒ ileti┼ƒim kurun.
              </p>
              <Link
                href="/messages"
                className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
              >
                Mesajlar─▒ G├Âr
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Link>
            </motion.div>

            {/* G├╝venli ├ûdeme */}
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
                Escrow ├ûdeme Sistemi
              </h3>
              <p className="text-gray-600 mb-6">
                ├ûdemeniz g├╝venli bir ┼ƒekilde tutulur ve hizmet tamamland─▒ktan sonra hizmet verene aktar─▒l─▒r. Hem siz hem de hizmet veren g├╝vende.
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
                <span className="text-2xl">­ƒÅá</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                20+ Hizmet Kategorisi
              </h3>
              <p className="text-gray-600 mb-6">
                Ev hizmetlerinden teknolojiye, e─ƒitimden sa─ƒl─▒─ƒa kadar 20+ kategori ve 200+ alt kategoride binlerce hizmet se├ºene─ƒi.
              </p>
              <Link
                href="/services"
                className="inline-flex items-center text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
              >
                Kategorileri Ke┼ƒfet
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Link>
            </motion.div>

            {/* 10+ Fiyatland─▒rma Modeli */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">­ƒÆ░</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                10+ Fiyatland─▒rma Modeli
              </h3>
              <p className="text-gray-600 mb-6">
                Sabit, saatlik, g├╝nl├╝k, paket, a├º─▒k art─▒rma ve daha fazlas─▒. Her hizmet i├ºin en uygun fiyatland─▒rma se├ºene─ƒi.
              </p>
              <Link
                href="/services"
                className="inline-flex items-center text-green-600 font-semibold hover:text-green-700 transition-colors"
              >
                Fiyatlar─▒ G├Âr
                <ArrowRightIcon className="h-4 w-4 ml-2" />
              </Link>
            </motion.div>

            {/* Geli┼ƒmi┼ƒ G├╝venlik */}
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
                Geli┼ƒmi┼ƒ G├╝venlik
              </h3>
              <p className="text-gray-600 mb-6">
                2FA, fraud detection, ┼ƒifre politikalar─▒, IP engelleme ve daha fazlas─▒ ile en g├╝venli platform deneyimi.
              </p>
              <Link
                href="/profile"
                className="inline-flex items-center text-red-600 font-semibold hover:text-red-700 transition-colors"
              >
                G├╝venlik Ayarlar─▒
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
              Hemen Ba┼ƒla!
            </h2>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              ─░htiyac─▒n olan hizmeti bul, g├╝venli ├Âdeme yap, h─▒zl─▒ ├º├Âz├╝m al. 
              Hizmet veren olarak da para kazanmaya ba┼ƒla!
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
}/ /   T e s t   c o m m e n t   f r o m   l o c a l   a u t o - c o m m i t 
 
 / /   T e s t   c o m m e n t   f r o m   s e r v i c e h u b - g i t h u b   d i r e c t o r y 
 
 / /   T e s t   f r o m   c o r r e c t   d i r e c t o r y   -   s e r v i c e h u b - g i t h u b 
 
 / /   T e s t   c o m m e n t   f r o m   l o c a l   -   0 9 / 2 6 / 2 0 2 5   1 8 : 5 5 : 0 3 
 
 
