'use client'

import { useState } from 'react'
import { CheckIcon, XMarkIcon, StarIcon } from '@heroicons/react/24/outline'
import { COMPETITOR_FEATURES, MISSING_FEATURES, FEATURE_CATEGORIES } from '@/lib/competitor-features'

interface Competitor {
  name: string
  country: string
  features: string[]
  score: number
  color: string
}

export default function CompetitorComparison() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'name' | 'score' | 'country'>('score')

  // Rakipleri hazırla
  const competitors: Competitor[] = Object.values(COMPETITOR_FEATURES).map(comp => ({
    name: comp.name,
    country: comp.country,
    features: comp.features,
    score: comp.features.length,
    color: getCountryColor(comp.country)
  }))

  // JetDestek.com'u ekle
  const jetdestekFeatures = [
    'AI Destekli Akıllı Arama',
    '20+ Hizmet Kategorisi',
    '10+ Fiyatlandırma Modeli',
    'Real-time Mesajlaşma',
    'Escrow Ödeme Sistemi',
    'Gelişmiş Güvenlik (2FA, Fraud Detection)',
    'Kapsamlı Analitik',
    'Mahalle Hizmetleri',
    'Proje Portföyü',
    'Finansman Seçenekleri',
    'Abonelik Hizmetleri',
    'Topluluk Forumları',
    'Eğitim Sistemi',
    'Gelişmiş Bildirimler',
    'Favori Hizmetler',
    'Paket Hizmetler',
    'Müsaitlik Takvimi',
    'Gelişmiş Filtreleme',
    'Mobil Optimizasyon',
    'Çoklu Dil Desteği'
  ]

  const jetdestek: Competitor = {
    name: 'JetDestek.com',
    country: 'Turkey',
    features: jetdestekFeatures,
    score: jetdestekFeatures.length,
    color: 'bg-blue-500'
  }

  const allCompetitors = [jetdestek, ...competitors].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name)
      case 'country':
        return a.country.localeCompare(b.country)
      case 'score':
      default:
        return b.score - a.score
    }
  })

  const categories = ['all', ...Object.keys(FEATURE_CATEGORIES)]

  const getCountryColor = (country: string) => {
    const colors = {
      'USA': 'bg-red-500',
      'Turkey': 'bg-blue-500',
      'India': 'bg-orange-500',
      'Germany': 'bg-yellow-500',
      'Global': 'bg-green-500',
      'UK': 'bg-purple-500',
      'Canada': 'bg-pink-500'
    }
    return colors[country as keyof typeof colors] || 'bg-gray-500'
  }

  const getFeatureIcon = (feature: string, competitor: Competitor) => {
    if (competitor.features.includes(feature)) {
      return <CheckIcon className="w-5 h-5 text-green-500" />
    }
    return <XMarkIcon className="w-5 h-5 text-red-500" />
  }

  const filteredFeatures = selectedCategory === 'all' 
    ? [...jetdestekFeatures, ...MISSING_FEATURES]
    : FEATURE_CATEGORIES[selectedCategory] || []

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Rakip Karşılaştırması
        </h2>
        
        <div className="flex flex-wrap gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategori Filtresi
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Tümü' : category}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sıralama
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'score' | 'country')}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="score">Özellik Sayısı</option>
              <option value="name">İsim</option>
              <option value="country">Ülke</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Platform
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ülke
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Skor
              </th>
              {filteredFeatures.slice(0, 10).map((feature, index) => (
                <th key={index} className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {feature.length > 20 ? feature.substring(0, 20) + '...' : feature}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {allCompetitors.map((competitor, index) => (
              <tr key={index} className={competitor.name === 'JetDestek.com' ? 'bg-blue-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${competitor.color} mr-3`}></div>
                    <div className="text-sm font-medium text-gray-900">
                      {competitor.name}
                    </div>
                    {competitor.name === 'JetDestek.com' && (
                      <StarIcon className="w-4 h-4 text-yellow-500 ml-2" />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {competitor.country}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">
                      {competitor.score}
                    </span>
                    <div className="ml-2 w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(competitor.score / Math.max(...allCompetitors.map(c => c.score))) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                {filteredFeatures.slice(0, 10).map((feature, featureIndex) => (
                  <td key={featureIndex} className="px-3 py-4 whitespace-nowrap text-center">
                    {getFeatureIcon(feature, competitor)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          JetDestek.com Avantajları
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="flex items-center">
            <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-sm text-gray-700">En yüksek özellik sayısı ({jetdestek.score})</span>
          </div>
          <div className="flex items-center">
            <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-sm text-gray-700">AI destekli akıllı arama</span>
          </div>
          <div className="flex items-center">
            <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-sm text-gray-700">Gelişmiş güvenlik sistemi</span>
          </div>
          <div className="flex items-center">
            <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-sm text-gray-700">Kapsamlı analitik</span>
          </div>
          <div className="flex items-center">
            <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-sm text-gray-700">Mahalle hizmetleri</span>
          </div>
          <div className="flex items-center">
            <CheckIcon className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-sm text-gray-700">Eğitim sistemi</span>
          </div>
        </div>
      </div>
    </div>
  )
}

