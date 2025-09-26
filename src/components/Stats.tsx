'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const stats = [
  {
    number: '50K+',
    label: 'Mutlu Müşteri',
    description: 'Platformumuzu tercih eden kullanıcı sayısı'
  },
  {
    number: '10K+',
    label: 'Hizmet Veren',
    description: 'Kayıtlı profesyonel hizmet sağlayıcı'
  },
  {
    number: '100K+',
    label: 'Tamamlanan İş',
    description: 'Başarıyla tamamlanan hizmet sayısı'
  },
  {
    number: '4.8/5',
    label: 'Ortalama Puan',
    description: 'Müşteri memnuniyet oranı'
  }
]

export function Stats() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={isInView ? { scale: 1 } : { scale: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
                className="text-4xl md:text-5xl font-bold text-blue-600 mb-2"
              >
                {stat.number}
              </motion.div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {stat.label}
              </h3>
              <p className="text-sm text-gray-600">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

