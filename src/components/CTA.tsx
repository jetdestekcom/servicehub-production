'use client'

import { motion } from 'framer-motion'
import { ArrowRightIcon } from '@heroicons/react/24/outline'

export function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-5xl font-bold mb-6"
          >
            Hemen Başla!
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto opacity-90"
          >
            İhtiyacın olan hizmeti bul, güvenli ödeme yap, hizmetini al. 
            Hizmet veren olarak da para kazanmaya başla!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <button className="bg-white text-blue-600 font-semibold py-4 px-8 rounded-xl hover:bg-gray-100 transition-colors duration-200 flex items-center gap-2 text-lg">
              Hizmet Al
              <ArrowRightIcon className="h-5 w-5" />
            </button>
            
            <button className="bg-transparent border-2 border-white text-white font-semibold py-4 px-8 rounded-xl hover:bg-white hover:text-blue-600 transition-colors duration-200 flex items-center gap-2 text-lg">
              Hizmet Ver
              <ArrowRightIcon className="h-5 w-5" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="text-2xl font-bold mb-2">%100 Güvenli</h3>
                <p className="opacity-90">
                  Tüm ödemeler güvenli şekilde işlenir ve verileriniz korunur
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="text-2xl font-bold mb-2">7/24 Destek</h3>
                <p className="opacity-90">
                  Her zaman yanınızdayız, sorularınız için destek ekibimiz hazır
                </p>
              </div>
            </div>
            
            <div className="text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="text-2xl font-bold mb-2">Düşük Komisyon</h3>
                <p className="opacity-90">
                  Sadece %5-8 komisyon, rakiplerimizden çok daha düşük
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

