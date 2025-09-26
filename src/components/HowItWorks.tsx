'use client'

import { motion } from 'framer-motion'
import { 
  MagnifyingGlassIcon, 
  ChatBubbleLeftRightIcon, 
  CheckCircleIcon 
} from '@heroicons/react/24/outline'

const steps = [
  {
    number: 1,
    title: 'Hizmet Ara',
    description: 'İhtiyacın olan hizmeti kategorilere göre ara veya konumuna yakın hizmet verenleri bul',
    icon: MagnifyingGlassIcon,
    color: 'bg-blue-500'
  },
  {
    number: 2,
    title: 'Seç ve Rezervasyon Yap',
    description: 'Beğendiğin hizmet vereni seç, tarih ve saat belirle, güvenli ödeme yap',
    icon: ChatBubbleLeftRightIcon,
    color: 'bg-green-500'
  },
  {
    number: 3,
    title: 'Hizmeti Al ve Değerlendir',
    description: 'Hizmeti al, memnuniyetini değerlendir ve yorum yap',
    icon: CheckCircleIcon,
    color: 'bg-purple-500'
  }
]

export function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nasıl Çalışır?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Sadece 3 adımda ihtiyacın olan hizmeti kolayca bul ve al
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="text-center relative"
            >
              {/* Connection line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gray-200 transform translate-x-1/2">
                  <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-blue-500 to-green-500"></div>
                </div>
              )}

              <div className="relative z-10">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                  className={`w-32 h-32 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}
                >
                  <step.icon className="h-16 w-16 text-white" />
                </motion.div>

                <div className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-4">
                  <span className="text-lg font-bold text-gray-700">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {step.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white"
          >
            <h3 className="text-2xl font-bold mb-4">
              Hemen Başla!
            </h3>
            <p className="text-lg mb-6 opacity-90">
              Binlerce hizmet veren arasından seçim yap, güvenli ödeme yap, hizmetini al.
            </p>
            <button className="bg-white text-blue-600 font-semibold py-3 px-8 rounded-xl hover:bg-gray-100 transition-colors duration-200">
              Ücretsiz Kayıt Ol
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

