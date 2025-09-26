'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  FunnelIcon,
  StarIcon,
  ClockIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import ServiceCard from '@/components/ServiceCard'

interface Service {
  id: string
  title: string
  description: string
  category: string
  price: number
  priceType: string
  location: string
  rating: number
  reviewCount: number
  images: string[]
  provider: {
    name: string
    rating: number
  }
}

// Mock data removed - will fetch from API

const categories = [
  { name: 'Tümü', subcategories: [] },
  { 
    name: 'Temizlik', 
    subcategories: ['Ev Temizliği', 'Ofis Temizliği', 'Cam Temizliği', 'Halı Yıkama', 'Balkon Temizliği']
  },
  { 
    name: 'Teknik Destek', 
    subcategories: ['Bilgisayar Tamiri', 'Telefon Tamiri', 'WiFi Kurulumu', 'Elektrik İşleri', 'Su Tesisatı']
  },
  { 
    name: 'Bahçıvanlık', 
    subcategories: ['Bahçe Bakımı', 'Çim Bakımı', 'Ağaç Budama', 'Peyzaj Tasarımı', 'Çiçek Dikimi']
  },
  { 
    name: 'Boyama', 
    subcategories: ['İç Boyama', 'Dış Boyama', 'Duvar Boyama', 'Mobilya Boyama', 'Sanat Boyama']
  },
  { 
    name: 'Nakliyat', 
    subcategories: ['Ev Taşıma', 'Ofis Taşıma', 'Eşya Taşıma', 'Paket Servisi', 'Kargo']
  },
  { 
    name: 'Eğitim', 
    subcategories: ['Özel Ders', 'Dil Eğitimi', 'Matematik', 'İngilizce', 'Müzik Dersi']
  },
  { 
    name: 'Sağlık & Bakım', 
    subcategories: ['Masaj', 'Kuaför', 'Güzellik Bakımı', 'Fizik Tedavi', 'Diyet Danışmanlığı']
  },
  { 
    name: 'Ev & Yaşam', 
    subcategories: ['Tadilat', 'Montaj', 'Dekorasyon', 'Mobilya Kurulumu', 'Güvenlik Sistemleri']
  },
  { 
    name: 'Teknoloji', 
    subcategories: ['Yazılım Geliştirme', 'Web Tasarım', 'SEO', 'Sosyal Medya', 'Dijital Pazarlama']
  }
]

const priceRanges = [
  { label: 'Tümü', min: 0, max: 10000 },
  { label: '0-100 TL', min: 0, max: 100 },
  { label: '100-300 TL', min: 100, max: 300 },
  { label: '300-500 TL', min: 300, max: 500 },
  { label: '500+ TL', min: 500, max: 10000 }
]

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tümü')
  const [selectedSubcategory, setSelectedSubcategory] = useState('')
  const [selectedPriceRange, setSelectedPriceRange] = useState(priceRanges[0])
  const [sortBy, setSortBy] = useState('rating')
  const [showFilters, setShowFilters] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [selectedCategory, selectedSubcategory, searchQuery, selectedPriceRange, sortBy])

  useEffect(() => {
    let filtered = services

    // Kategori filtresi
    if (selectedCategory !== 'Tümü') {
      if (selectedSubcategory) {
        filtered = filtered.filter(service => service.category === selectedSubcategory)
      } else {
        // Ana kategori veya alt kategorilerden birini içeren services
        const categoryData = categories.find(cat => cat.name === selectedCategory)
        if (categoryData && categoryData.subcategories.length > 0) {
          filtered = filtered.filter(service => 
            categoryData.subcategories.includes(service.category) || 
            service.category === selectedCategory
          )
        } else {
          filtered = filtered.filter(service => service.category === selectedCategory)
        }
      }
    }

    // Fiyat filtresi
    filtered = filtered.filter(service => 
      service.price >= selectedPriceRange.min && service.price <= selectedPriceRange.max
    )

    // Arama filtresi
    if (searchQuery) {
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sıralama
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'reviews':
          return b.reviewCount - a.reviewCount
        default:
          return 0
      }
    })

    setFilteredServices(filtered)
  }, [services, selectedCategory, selectedSubcategory, sortBy, searchQuery, selectedPriceRange])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedSubcategory) {
        params.append('category', selectedSubcategory)
      } else if (selectedCategory !== 'Tümü') {
        params.append('category', selectedCategory)
      }
      if (searchQuery) {
        params.append('q', searchQuery)
      }
      params.append('minPrice', selectedPriceRange.min.toString())
      params.append('maxPrice', selectedPriceRange.max.toString())
      params.append('sortBy', sortBy === 'relevance' ? 'createdAt' : sortBy)
      params.append('limit', '100') // Mehr Services laden

      const response = await fetch(`/api/services?${params}`)
      if (response.ok) {
        const data = await response.json()
        console.log('Services API Response:', data) // Debug log
        if (data.success && data.data && data.data.services) {
          setServices(data.data.services)
          setFilteredServices(data.data.services)
          console.log('Services loaded:', data.data.services.length) // Debug log
        } else {
          console.log('No services found in response') // Debug log
          setServices([])
          setFilteredServices([])
        }
      } else {
        console.error('API response not ok:', response.status) // Debug log
      }
    } catch (error) {
      console.error('Services fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Hizmetler
          </h1>
          
          {/* Search Bar */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Hangi hizmeti arıyorsun?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="relative">
              <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Konum"
                className="w-full md:w-64 pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <FunnelIcon className="h-5 w-5" />
              Filtreler
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className={`lg:w-64 ${showFilters ? 'block' : 'hidden'}`}>
            <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
              {/* Categories */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Kategoriler</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.name}>
                      <button
                        onClick={() => {
                          setSelectedCategory(category.name)
                          setSelectedSubcategory('')
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory === category.name
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {category.name}
                      </button>
                      {category.subcategories.length > 0 && selectedCategory === category.name && (
                        <div className="ml-4 mt-2 space-y-1">
                          {category.subcategories.map((subcategory) => (
                            <button
                              key={subcategory}
                              onClick={() => setSelectedSubcategory(subcategory)}
                              className={`w-full text-left px-3 py-1 rounded-lg transition-colors text-sm ${
                                selectedSubcategory === subcategory
                                  ? 'bg-blue-50 text-blue-600'
                                  : 'text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              {subcategory}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Fiyat Aralığı</h3>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.label}
                      onClick={() => setSelectedPriceRange(range)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                        selectedPriceRange.label === range.label
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sırala</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="rating">En Yüksek Puan</option>
                  <option value="price-low">En Düşük Fiyat</option>
                  <option value="price-high">En Yüksek Fiyat</option>
                  <option value="reviews">En Çok Değerlendirme</option>
                </select>
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600">
                {filteredServices.length} hizmet bulundu
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <ServiceCard service={service} />
                </motion.div>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <MagnifyingGlassIcon className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Hizmet bulunamadı
                </h3>
                <p className="text-gray-600">
                  Arama kriterlerinizi değiştirerek tekrar deneyin
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

