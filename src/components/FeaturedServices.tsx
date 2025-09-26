'use client'

import { motion } from 'framer-motion'
import { StarIcon, MapPinIcon, ClockIcon } from '@heroicons/react/24/solid'
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline'

const featuredServices = [
  {
    id: 1,
    title: 'Profesyonel Ev Temizliği',
    provider: 'Temizlik Uzmanı Ahmet',
    rating: 4.9,
    reviewCount: 127,
    price: 150,
    priceType: 'FIXED',
    location: 'Kadıköy, İstanbul',
    duration: 180,
    image: '/api/placeholder/300/200',
    tags: ['Ev Temizliği', 'Profesyonel', 'Güvenilir']
  },
  {
    id: 2,
    title: 'Bilgisayar Tamir Hizmeti',
    provider: 'Teknik Servis Mehmet',
    rating: 4.8,
    reviewCount: 89,
    price: 200,
    priceType: 'FIXED',
    location: 'Beşiktaş, İstanbul',
    duration: 120,
    image: '/api/placeholder/300/200',
    tags: ['Teknik Destek', 'Hızlı', 'Uygun Fiyat']
  },
  {
    id: 3,
    title: 'Bahçe Düzenleme',
    provider: 'Bahçıvan Ali',
    rating: 4.7,
    reviewCount: 45,
    price: 300,
    priceType: 'FIXED',
    location: 'Şişli, İstanbul',
    duration: 240,
    image: '/api/placeholder/300/200',
    tags: ['Bahçe Bakımı', 'Doğal', 'Uzman']
  }
]

export function FeaturedServices() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Öne Çıkan Hizmetler
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            En çok tercih edilen ve yüksek puan alan hizmetlerimiz
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer group"
            >
              <div className="relative">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1">
                  <StarIcon className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-semibold text-gray-900">
                    {service.rating}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">
                      ₺{service.price}
                    </div>
                    <div className="text-sm text-gray-500">
                      {service.priceType === 'FIXED' ? 'Sabit' : 'Saatlik'}
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  {service.provider}
                </p>

                <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPinIcon className="h-4 w-4" />
                    <span>{service.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <ClockIcon className="h-4 w-4" />
                    <span>{service.duration} dk</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(service.rating)
                            ? 'text-yellow-500'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">
                      ({service.reviewCount} değerlendirme)
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {service.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors duration-200">
                  Hizmet Al
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="bg-white hover:bg-gray-50 text-blue-600 font-semibold py-3 px-8 rounded-xl border-2 border-blue-600 transition-colors duration-200">
            Tüm Hizmetleri Görüntüle
          </button>
        </div>
      </div>
    </section>
  )
}

