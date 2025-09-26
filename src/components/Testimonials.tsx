'use client'

import { motion } from 'framer-motion'
import { StarIcon } from '@heroicons/react/24/solid'

const testimonials = [
  {
    id: 1,
    name: 'Ayşe Yılmaz',
    role: 'Ev Hanımı',
    location: 'Kadıköy, İstanbul',
    rating: 5,
    comment: 'Ev temizliği için çok memnun kaldım. Hizmet veren çok profesyonel ve temizlik mükemmeldi. Kesinlikle tekrar kullanacağım.',
    avatar: '/api/placeholder/80/80'
  },
  {
    id: 2,
    name: 'Mehmet Kaya',
    role: 'İş İnsanı',
    location: 'Beşiktaş, İstanbul',
    rating: 5,
    comment: 'Bilgisayarım bozulmuştu, çok hızlı bir şekilde tamir edildi. Fiyat da çok uygun. Teşekkürler ServiceHub!',
    avatar: '/api/placeholder/80/80'
  },
  {
    id: 3,
    name: 'Fatma Demir',
    role: 'Öğretmen',
    location: 'Şişli, İstanbul',
    rating: 5,
    comment: 'Bahçe düzenleme hizmeti aldım. Çok güzel bir iş çıkardılar. Bahçem artık çok daha güzel görünüyor.',
    avatar: '/api/placeholder/80/80'
  },
  {
    id: 4,
    name: 'Ali Özkan',
    role: 'Mühendis',
    location: 'Üsküdar, İstanbul',
    rating: 5,
    comment: 'Nakliye hizmeti için kullandım. Eşyalarım hiç zarar görmeden taşındı. Çok güvenilir bir platform.',
    avatar: '/api/placeholder/80/80'
  },
  {
    id: 5,
    name: 'Zeynep Arslan',
    role: 'Öğrenci',
    location: 'Beyoğlu, İstanbul',
    rating: 5,
    comment: 'Özel ders hizmeti aldım. Öğretmen çok iyi, konuları çok güzel anlattı. Sınavlarımda başarılı oldum.',
    avatar: '/api/placeholder/80/80'
  },
  {
    id: 6,
    name: 'Can Yıldız',
    role: 'Serbest Meslek',
    location: 'Bakırköy, İstanbul',
    rating: 5,
    comment: 'Boyama hizmeti aldım. İşçilik kalitesi çok yüksek, fiyat da çok uygun. Evim çok güzel oldu.',
    avatar: '/api/placeholder/80/80'
  }
]

export function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Müşteri Yorumları
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Binlerce mutlu müşterimizin deneyimlerini okuyun
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {testimonial.role}
                  </p>
                  <p className="text-xs text-gray-500">
                    {testimonial.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-5 w-5 ${
                      i < testimonial.rating
                        ? 'text-yellow-500'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>

              <p className="text-gray-700 leading-relaxed">
                &quot;{testimonial.comment}&quot;
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="bg-white rounded-2xl p-8 shadow-lg max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="h-8 w-8 text-yellow-500" />
                ))}
              </div>
              <span className="ml-4 text-2xl font-bold text-gray-900">
                4.8/5
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Ortalama Müşteri Memnuniyeti
            </h3>
            <p className="text-gray-600">
              10,000+ değerlendirme üzerinden hesaplanmıştır
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
