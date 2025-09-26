'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  StarIcon,
  ClockIcon,
  CheckIcon
} from '@heroicons/react/24/outline'

interface SearchFilters {
  query: string
  categoryId: string
  subcategoryId: string
  minPrice: number
  maxPrice: number
  minRating: number
  maxRating: number
  location: string
  radius: number
  availability: string
  sortBy: string
  features: string[]
  priceRange: string
  providerType: string
  verifiedOnly: boolean
}

interface AdvancedSearchFiltersProps {
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  onSearch: () => void
  categories: Array<{
    id: string;
    name: string;
  }>
  subcategories: Array<{
    id: string;
    name: string;
    parentId: string;
  }>
  loading?: boolean
}

const priceRanges = [
  { id: 'budget', label: 'Bütçe (0-100₺)', min: 0, max: 100 },
  { id: 'moderate', label: 'Orta (100-500₺)', min: 100, max: 500 },
  { id: 'premium', label: 'Premium (500₺+)', min: 500, max: null }
]

const availabilityOptions = [
  { id: 'all', label: 'Tümü' },
  { id: 'today', label: 'Bugün' },
  { id: 'tomorrow', label: 'Yarın' },
  { id: 'this_week', label: 'Bu Hafta' }
]

const sortOptions = [
  { id: 'relevance', label: 'En İlgili' },
  { id: 'price_low', label: 'Fiyat (Düşük-Yüksek)' },
  { id: 'price_high', label: 'Fiyat (Yüksek-Düşük)' },
  { id: 'rating', label: 'En Yüksek Puan' },
  { id: 'newest', label: 'En Yeni' },
  { id: 'popular', label: 'En Popüler' }
]

const featureOptions = [
  'Hızlı Teslimat',
  '7/24 Destek',
  'Garanti',
  'Ücretsiz Keşif',
  'Ekipman Dahil',
  'Sigortalı',
  'Sertifikalı',
  'Deneyimli'
]

export default function AdvancedSearchFilters({
  filters,
  onFiltersChange,
  onSearch,
  categories,
  subcategories,
  loading = false
}: AdvancedSearchFiltersProps) {
  const [showFilters, setShowFilters] = useState(false)
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleFilterChange = (key: keyof SearchFilters, value: string | number | boolean | string[]) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleFeatureToggle = (feature: string) => {
    const newFeatures = localFilters.features.includes(feature)
      ? localFilters.features.filter(f => f !== feature)
      : [...localFilters.features, feature]
    handleFilterChange('features', newFeatures)
  }

  const handlePriceRangeSelect = (range: { id: string; min: number; max: number | null }) => {
    handleFilterChange('minPrice', range.min)
    handleFilterChange('maxPrice', range.max)
    handleFilterChange('priceRange', range.id)
  }

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      query: '',
      categoryId: '',
      subcategoryId: '',
      minPrice: 0,
      maxPrice: 0,
      minRating: 0,
      maxRating: 5,
      location: '',
      radius: 10,
      availability: 'all',
      sortBy: 'relevance',
      features: [],
      priceRange: '',
      providerType: '',
      verifiedOnly: false
    }
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const activeFiltersCount = Object.values(localFilters).filter(value => 
    value !== '' && value !== 0 && value !== false && 
    (Array.isArray(value) ? value.length > 0 : true)
  ).length

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Search Bar */}
      <div className="p-4 border-b">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Hizmet ara..."
              value={localFilters.query}
              onChange={(e) => handleFilterChange('query', e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <FunnelIcon className="h-5 w-5" />
            <span>Filtreler</span>
            {activeFiltersCount > 0 && (
              <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                {activeFiltersCount}
              </span>
            )}
          </button>
          <button
            onClick={onSearch}
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Aranıyor...' : 'Ara'}
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 space-y-6">
              {/* Categories */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategori
                </label>
                <select
                  value={localFilters.categoryId}
                  onChange={(e) => handleFilterChange('categoryId', e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tüm Kategoriler</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategories */}
              {localFilters.categoryId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alt Kategori
                  </label>
                  <select
                    value={localFilters.subcategoryId}
                    onChange={(e) => handleFilterChange('subcategoryId', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tüm Alt Kategoriler</option>
                    {subcategories
                      .filter(sub => sub.parentId === localFilters.categoryId)
                      .map((subcategory) => (
                        <option key={subcategory.id} value={subcategory.id}>
                          {subcategory.name}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              {/* Price Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fiyat Aralığı
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {priceRanges.map((range) => (
                    <button
                      key={range.id}
                      onClick={() => handlePriceRangeSelect(range)}
                      className={`p-3 text-left border rounded-lg transition-colors ${
                        localFilters.priceRange === range.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{range.label}</span>
                        {localFilters.priceRange === range.id && (
                          <CheckIcon className="h-4 w-4" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Price Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Fiyat (₺)
                  </label>
                  <input
                    type="number"
                    value={localFilters.minPrice || ''}
                    onChange={(e) => handleFilterChange('minPrice', Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Fiyat (₺)
                  </label>
                  <input
                    type="number"
                    value={localFilters.maxPrice || ''}
                    onChange={(e) => handleFilterChange('maxPrice', Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="1000"
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Puan
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => handleFilterChange('minRating', rating)}
                      className={`p-2 rounded-lg border transition-colors ${
                        localFilters.minRating >= rating
                          ? 'border-yellow-400 bg-yellow-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <StarIcon className={`h-5 w-5 ${
                        localFilters.minRating >= rating ? 'text-yellow-400' : 'text-gray-300'
                      }`} />
                    </button>
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    {localFilters.minRating}+ yıldız
                  </span>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Konum
                </label>
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Şehir, ilçe veya mahalle"
                      value={localFilters.location}
                      onChange={(e) => handleFilterChange('location', e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <select
                    value={localFilters.radius}
                    onChange={(e) => handleFilterChange('radius', Number(e.target.value))}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={5}>5 km</option>
                    <option value={10}>10 km</option>
                    <option value={25}>25 km</option>
                    <option value={50}>50 km</option>
                    <option value={100}>100 km</option>
                  </select>
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Özellikler
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {featureOptions.map((feature) => (
                    <button
                      key={feature}
                      onClick={() => handleFeatureToggle(feature)}
                      className={`p-2 text-sm border rounded-lg transition-colors ${
                        localFilters.features.includes(feature)
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{feature}</span>
                        {localFilters.features.includes(feature) && (
                          <CheckIcon className="h-4 w-4" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Additional Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Müsaitlik
                  </label>
                  <select
                    value={localFilters.availability}
                    onChange={(e) => handleFilterChange('availability', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {availabilityOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sıralama
                  </label>
                  <select
                    value={localFilters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {sortOptions.map((option) => (
                      <option key={option.id} value={option.id}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Advanced Options */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="verifiedOnly"
                    checked={localFilters.verifiedOnly}
                    onChange={(e) => handleFilterChange('verifiedOnly', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="verifiedOnly" className="ml-2 text-sm text-gray-700">
                    Sadece doğrulanmış sağlayıcılar
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between pt-4 border-t">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  Filtreleri Temizle
                </button>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Kapat
                  </button>
                  <button
                    onClick={onSearch}
                    disabled={loading}
                    className="px-6 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {loading ? 'Aranıyor...' : 'Ara'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
