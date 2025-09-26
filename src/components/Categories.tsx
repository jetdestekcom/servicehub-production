'use client'

import { motion } from 'framer-motion'
import { 
  HomeIcon, 
  WrenchScrewdriverIcon, 
  TruckIcon, 
  PaintBrushIcon,
  ComputerDesktopIcon,
  HeartIcon,
  AcademicCapIcon,
  MusicalNoteIcon
} from '@heroicons/react/24/outline'

const categories = [
  {
    id: 'home-cleaning',
    name: 'Ev Temizliği',
    icon: HomeIcon,
    description: 'Profesyonel temizlik hizmetleri',
    color: 'bg-blue-500',
    serviceCount: 1250
  },
  {
    id: 'repair',
    name: 'Tamir & Onarım',
    icon: WrenchScrewdriverIcon,
    description: 'Ev aletleri ve elektronik tamiri',
    color: 'bg-green-500',
    serviceCount: 890
  },
  {
    id: 'transport',
    name: 'Nakliye',
    icon: TruckIcon,
    description: 'Eşya taşıma ve nakliye',
    color: 'bg-yellow-500',
    serviceCount: 650
  },
  {
    id: 'painting',
    name: 'Boyama',
    icon: PaintBrushIcon,
    description: 'İç ve dış mekan boyama',
    color: 'bg-purple-500',
    serviceCount: 420
  },
  {
    id: 'tech-support',
    name: 'Teknik Destek',
    icon: ComputerDesktopIcon,
    description: 'Bilgisayar ve yazılım desteği',
    color: 'bg-red-500',
    serviceCount: 780
  },
  {
    id: 'health',
    name: 'Sağlık & Bakım',
    icon: HeartIcon,
    description: 'Kişisel bakım hizmetleri',
    color: 'bg-pink-500',
    serviceCount: 320
  },
  {
    id: 'education',
    name: 'Eğitim',
    icon: AcademicCapIcon,
    description: 'Özel ders ve eğitim',
    color: 'bg-indigo-500',
    serviceCount: 540
  },
  {
    id: 'entertainment',
    name: 'Eğlence',
    icon: MusicalNoteIcon,
    description: 'Müzik ve eğlence hizmetleri',
    color: 'bg-orange-500',
    serviceCount: 210
  }
]

export function Categories() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Kategoriler
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            İhtiyacın olan hizmeti kategorilere göre kolayca bulabilirsin
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <category.icon className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {category.name}
              </h3>
              
              <p className="text-sm text-gray-600 mb-3">
                {category.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {category.serviceCount} hizmet
                </span>
                <span className="text-blue-600 text-sm font-medium group-hover:text-blue-700">
                  Görüntüle →
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

