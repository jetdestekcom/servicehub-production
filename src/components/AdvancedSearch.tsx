'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  MagnifyingGlassIcon,
  MapPinIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'
import { CityAutocomplete } from '@/components/CityAutocomplete'
import { CategoryAutocomplete } from '@/components/CategoryAutocomplete'

interface SearchFilters {
  query: string
  category: string
  location: string
  minPrice: number
  maxPrice: number
  minRating: number
  sortBy: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest'
  availability: 'all' | 'today' | 'tomorrow' | 'this_week'
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void
  onClear: () => void
  initialFilters?: Partial<SearchFilters>
}

const categories = [
  'Temizlik',
  'Tamir & Bakım',
  'Nakliyat',
  'Bahçıvanlık',
  'Eğitim',
  'Sağlık',
  'Güzellik',
  'Teknoloji',
  'Evcil Hayvan Bakımı',
  'Diğer'
]

const sortOptions = [
  { value: 'relevance', label: 'En İlgili' },
  { value: 'price_low', label: 'Fiyat (Düşük → Yüksek)' },
  { value: 'price_high', label: 'Fiyat (Yüksek → Düşük)' },
  { value: 'rating', label: 'En Yüksek Puan' },
  { value: 'newest', label: 'En Yeni' }
]

const availabilityOptions = [
  { value: 'all', label: 'Tümü' },
  { value: 'today', label: 'Bugün' },
  { value: 'tomorrow', label: 'Yarın' },
  { value: 'this_week', label: 'Bu Hafta' }
]

export function AdvancedSearch({ onSearch, onClear, initialFilters = {} }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    category: '',
    location: '',
    minPrice: 0,
    maxPrice: 10000,
    minRating: 0,
    sortBy: 'relevance',
    availability: 'all',
    ...initialFilters
  })

  const [showAdvanced, setShowAdvanced] = useState(true)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    setIsSearching(true)
    try {
      await onSearch(filters)
    } finally {
      setIsSearching(false)
    }
  }

  const handleClear = () => {
    const clearedFilters: SearchFilters = {
      query: '',
      category: '',
      location: '',
      minPrice: 0,
      maxPrice: 10000,
      minRating: 0,
      sortBy: 'relevance',
      availability: 'all'
    }
    setFilters(clearedFilters)
    onClear()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Basic Search Row */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={filters.query}
              onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              onKeyPress={handleKeyPress}
              placeholder="Hizmet ara... (örn: ev temizliği, tamir)"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>
        <div className="w-full lg:w-64">
          <CategoryAutocomplete
            value={filters.category}
            onChange={(category) => setFilters({ ...filters, category })}
            placeholder="Kategori seç..."
            className="text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex-1">
          <CityAutocomplete
            value={filters.location}
            onChange={(location) => setFilters({ ...filters, location })}
            placeholder="Konum (örn: İstanbul)"
            className="text-sm border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleClear}
            className="text-sm text-gray-500 hover:text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Temizle
          </button>
          <button
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm font-medium"
          >
            {isSearching ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Aranıyor...
              </>
            ) : (
              <>
                <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                Ara
              </>
            )}
          </button>
        </div>
      </div>

      {/* Advanced Filters - Horizontal Layout */}
      <div className="space-y-6">
        {/* Price and Rating Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fiyat Aralığı (₺)
            </label>
            <div className="flex gap-3">
              <div className="flex-1">
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: Number(e.target.value) })}
                  placeholder="Min"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div className="flex-1">
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                  placeholder="Max"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Minimum Puan
            </label>
            <div className="flex flex-wrap gap-4">
              {[5, 4, 3, 2, 1].map((rating) => (
                <label key={rating} className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="minRating"
                    value={rating}
                    checked={filters.minRating === rating}
                    onChange={(e) => setFilters({ ...filters, minRating: Number(e.target.value) })}
                    className="mr-2 text-blue-600 focus:ring-blue-500"
                  />
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <StarSolidIcon
                        key={star}
                        className={`h-4 w-4 ${
                          star <= rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-sm text-gray-600">
                      {rating}+
                    </span>
                  </div>
                </label>
              ))}
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="minRating"
                  value={0}
                  checked={filters.minRating === 0}
                  onChange={(e) => setFilters({ ...filters, minRating: Number(e.target.value) })}
                  className="mr-2 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">Tümü</span>
              </label>
            </div>
          </div>
        </div>

        {/* Filter Options Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Sıralama
            </label>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Müsaitlik
            </label>
            <select
              value={filters.availability}
              onChange={(e) => setFilters({ ...filters, availability: e.target.value as 'all' | 'today' | 'tomorrow' | 'this_week' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            >
              {availabilityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Service Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tarih
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Süre
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
              <option value="">Tümü</option>
              <option value="30">30 dk</option>
              <option value="60">1 saat</option>
              <option value="120">2 saat</option>
              <option value="240">4 saat</option>
              <option value="480">8 saat</option>
              <option value="1440">1 gün</option>
            </select>
          </div>

          {/* Verification Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Doğrulama
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
              <option value="">Tümü</option>
              <option value="verified">Doğrulanmış</option>
              <option value="unverified">Doğrulanmamış</option>
            </select>
          </div>

          {/* Premium Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Premium
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm">
              <option value="">Tümü</option>
              <option value="premium">Premium</option>
              <option value="standard">Standart</option>
            </select>
          </div>
        </div>

        {/* Quick Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hızlı Filtreler
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Bugün Müsait', key: 'today_available', action: () => setFilters({...filters, availability: 'today'}) },
              { label: 'Yüksek Puanlı', key: 'high_rated', action: () => setFilters({...filters, minRating: 4, sortBy: 'rating'}) },
              { label: 'Uygun Fiyatlı', key: 'affordable', action: () => setFilters({...filters, maxPrice: 500, sortBy: 'price_low'}) },
              { label: 'Yakın Konum', key: 'nearby', action: () => setFilters({...filters, location: 'İstanbul'}) },
              { label: 'Doğrulanmış', key: 'verified', action: () => setFilters({...filters, category: 'verified'}) },
              { label: 'Premium', key: 'premium', action: () => setFilters({...filters, category: 'premium'}) },
              { label: 'Acil', key: 'urgent', action: () => setFilters({...filters, category: 'urgent'}) },
              { label: 'Garantili', key: 'warranty', action: () => setFilters({...filters, category: 'warranty'}) }
            ].map((filter) => (
              <button
                key={filter.key}
                onClick={() => {
                  filter.action()
                  handleSearch()
                }}
                className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-blue-100 hover:text-blue-700 transition-colors border border-gray-200"
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
