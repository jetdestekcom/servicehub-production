'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { 
  CheckCircleIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ShieldCheckIcon,
  HeartIcon,
  StarIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

const stats = [
  { label: 'Aktif Kullanıcı', value: '50,000+', icon: UsersIcon },
  { label: 'Tamamlanan İş', value: '250,000+', icon: CheckCircleIcon },
  { label: 'Hizmet Veren', value: '15,000+', icon: UsersIcon },
  { label: 'Müşteri Memnuniyeti', value: '98%', icon: StarIcon }
]

const features = [
  {
    title: 'Güvenli Ödeme',
    description: 'Tüm ödemeleriniz Stripe güvencesi ile korunur. Paranız güvende.',
    icon: ShieldCheckIcon
  },
  {
    title: 'Hızlı Eşleştirme',
    description: 'AI destekli algoritmamız ile size en uygun hizmet vereni bulur.',
    icon: ClockIcon
  },
  {
    title: 'Düşük Komisyon',
    description: 'Sadece %8 komisyon ile hizmet verenlerden daha az para alırız.',
    icon: CurrencyDollarIcon
  },
  {
    title: '7/24 Destek',
    description: 'Her zaman yanınızdayız. Sorularınız için 7/24 destek alabilirsiniz.',
    icon: HeartIcon
  }
]

const team = [
  {
    name: 'Ahmet Yılmaz',
    role: 'Kurucu & CEO',
    image: '/api/placeholder/200/200',
    bio: '10 yıllık teknoloji deneyimi ile JetDestek\'i hayata geçirdi.'
  },
  {
    name: 'Ayşe Demir',
    role: 'CTO',
    image: '/api/placeholder/200/200',
    bio: 'Yazılım geliştirme uzmanı, platformun teknik altyapısını yönetiyor.'
  },
  {
    name: 'Mehmet Kaya',
    role: 'Pazarlama Direktörü',
    image: '/api/placeholder/200/200',
    bio: 'Dijital pazarlama uzmanı, büyüme stratejilerini geliştiriyor.'
  }
]

const testimonials = [
  {
    name: 'Fatma Özkan',
    role: 'Ev Hanımı',
    content: 'JetDestek sayesinde ev temizliği için güvenilir hizmet verenler buldum. Çok memnunum!',
    rating: 5,
    image: '/api/placeholder/60/60'
  },
  {
    name: 'Ali Çelik',
    role: 'İş İnsanı',
    content: 'Ofisimiz için düzenli temizlik hizmeti alıyoruz. Profesyonel ve güvenilir.',
    rating: 5,
    image: '/api/placeholder/60/60'
  },
  {
    name: 'Zeynep Arslan',
    role: 'Hizmet Veren',
    content: 'Platform sayesinde müşteri bulmak çok kolay. Komisyon oranı da çok makul.',
    rating: 5,
    image: '/api/placeholder/60/60'
  }
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              JetDestek.com
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Türkiye&apos;nin en güvenilir hizmet platformu
            </p>
            <p className="text-lg text-blue-200 max-w-3xl mx-auto">
              Hizmet alanlar ve hizmet verenleri güvenli bir şekilde buluşturan, 
              modern teknoloji ile desteklenen platform. Düşük komisyon, yüksek kalite.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Misyonumuz
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                JetDestek olarak, hizmet alanlar ve hizmet verenleri güvenli, 
                hızlı ve verimli bir şekilde buluşturmayı hedefliyoruz. 
                Teknolojiyi kullanarak geleneksel hizmet sektörünü modernize ediyoruz.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Düşük komisyon oranlarımız ile hizmet verenlerin kazancını artırırken, 
                müşterilere en kaliteli hizmeti en uygun fiyata sunuyoruz.
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="/auth/signup"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Hemen Başla
                </Link>
                <Link
                  href="/services"
                  className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  Hizmetleri Keşfet
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="relative"
            >
              <Image
                src="/api/placeholder/600/400"
                alt="JetDestek Platform"
                width={600}
                height={400}
                className="rounded-lg shadow-lg"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Neden JetDestek?
            </h2>
            <p className="text-lg text-gray-600">
              Platformumuzun sunduğu avantajları keşfedin
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ekibimiz
            </h2>
            <p className="text-lg text-gray-600">
              JetDestek&apos;i hayata geçiren deneyimli ekip
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <Image
                  src={member.image}
                  alt={member.name}
                  width={200}
                  height={200}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Müşteri Yorumları
            </h2>
            <p className="text-lg text-gray-600">
              Kullanıcılarımızın deneyimleri
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm"
              >
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }, (_, i) => (
                    <StarSolidIcon key={i} className="h-5 w-5 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">
                  &quot;{testimonial.content}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={60}
                    height={60}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-gray-600">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              İletişim
            </h2>
            <p className="text-lg text-gray-600">
              Sorularınız için bizimle iletişime geçin
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <PhoneIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Telefon
              </h3>
              <p className="text-gray-600">+90 212 555 0123</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <EnvelopeIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                E-posta
              </h3>
              <p className="text-gray-600">destek@jetdestek.com</p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <MapPinIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Adres
              </h3>
              <p className="text-gray-600">İstanbul, Türkiye</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Hemen Başlayın
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              JetDestek ailesine katılın ve farkı yaşayın
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              >
                Ücretsiz Kayıt Ol
              </Link>
              <Link
                href="/services"
                className="border border-white text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Hizmetleri Keşfet
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
