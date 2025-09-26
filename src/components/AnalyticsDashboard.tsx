'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  UsersIcon,
  CurrencyDollarIcon,
  StarIcon,
  CalendarIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'

interface AnalyticsData {
  totalRevenue: number
  revenueGrowth: number
  totalUsers: number
  userGrowth: number
  totalBookings: number
  bookingGrowth: number
  averageRating: number
  ratingGrowth: number
  conversionRate: number
  conversionGrowth: number
  monthlyRevenue: { month: string; revenue: number }[]
  topServices: { name: string; bookings: number; revenue: number }[]
  userActivity: { date: string; users: number; bookings: number }[]
  categoryPerformance: { category: string; bookings: number; revenue: number; growth: number }[]
}

const mockAnalyticsData: AnalyticsData = {
  totalRevenue: 2345670,
  revenueGrowth: 12.5,
  totalUsers: 15420,
  userGrowth: 8.3,
  totalBookings: 45670,
  bookingGrowth: 15.2,
  averageRating: 4.8,
  ratingGrowth: 2.1,
  conversionRate: 23.4,
  conversionGrowth: -1.2,
  monthlyRevenue: [
    { month: 'Ocak', revenue: 180000 },
    { month: 'Şubat', revenue: 220000 },
    { month: 'Mart', revenue: 195000 },
    { month: 'Nisan', revenue: 280000 },
    { month: 'Mayıs', revenue: 320000 },
    { month: 'Haziran', revenue: 350000 },
    { month: 'Temmuz', revenue: 380000 },
    { month: 'Ağustos', revenue: 420000 },
    { month: 'Eylül', revenue: 450000 },
    { month: 'Ekim', revenue: 480000 },
    { month: 'Kasım', revenue: 520000 },
    { month: 'Aralık', revenue: 2345670 }
  ],
  topServices: [
    { name: 'Ev Temizliği', bookings: 1250, revenue: 250000 },
    { name: 'Teknik Destek', bookings: 890, revenue: 133500 },
    { name: 'Nakliye', bookings: 650, revenue: 195000 },
    { name: 'Boyama', bookings: 420, revenue: 336000 },
    { name: 'Bahçe Bakımı', bookings: 380, revenue: 133000 }
  ],
  userActivity: [
    { date: '2024-01-20', users: 120, bookings: 45 },
    { date: '2024-01-21', users: 135, bookings: 52 },
    { date: '2024-01-22', users: 98, bookings: 38 },
    { date: '2024-01-23', users: 156, bookings: 67 },
    { date: '2024-01-24', users: 142, bookings: 58 },
    { date: '2024-01-25', users: 178, bookings: 72 },
    { date: '2024-01-26', users: 165, bookings: 69 }
  ],
  categoryPerformance: [
    { category: 'Ev Temizliği', bookings: 1250, revenue: 250000, growth: 15.2 },
    { category: 'Teknik Destek', bookings: 890, revenue: 133500, growth: 8.7 },
    { category: 'Nakliye', bookings: 650, revenue: 195000, growth: 22.1 },
    { category: 'Boyama', bookings: 420, revenue: 336000, growth: 5.4 },
    { category: 'Bahçe Bakımı', bookings: 380, revenue: 133000, growth: 18.9 },
    { category: 'Özel Ders', bookings: 540, revenue: 64800, growth: 12.3 }
  ]
}

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData>(mockAnalyticsData)
  const [timeRange, setTimeRange] = useState('30d')
  const [isLoading, setIsLoading] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('tr-TR').format(num)
  }

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? (
      <ArrowUpIcon className="h-4 w-4 text-green-500" />
    ) : (
      <ArrowDownIcon className="h-4 w-4 text-red-500" />
    )
  }

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600'
  }

  const stats = [
    {
      title: 'Toplam Gelir',
      value: formatCurrency(data.totalRevenue),
      growth: data.revenueGrowth,
      icon: CurrencyDollarIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Toplam Kullanıcı',
      value: formatNumber(data.totalUsers),
      growth: data.userGrowth,
      icon: UsersIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Toplam Rezervasyon',
      value: formatNumber(data.totalBookings),
      growth: data.bookingGrowth,
      icon: CalendarIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Ortalama Puan',
      value: data.averageRating.toFixed(1),
      growth: data.ratingGrowth,
      icon: StarIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      title: 'Dönüşüm Oranı',
      value: `${data.conversionRate}%`,
      growth: data.conversionGrowth,
      icon: CalendarIcon,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analitik Dashboard</h2>
          <p className="text-gray-600">Platform performansı ve kullanıcı istatistikleri</p>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Son 7 Gün</option>
            <option value="30d">Son 30 Gün</option>
            <option value="90d">Son 90 Gün</option>
            <option value="1y">Son 1 Yıl</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Rapor İndir
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className={`flex items-center gap-1 ${getGrowthColor(stat.growth)}`}>
                {getGrowthIcon(stat.growth)}
                <span className="text-sm font-medium">{Math.abs(stat.growth)}%</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.title}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Aylık Gelir Trendi</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {data.monthlyRevenue.map((item, index) => (
              <div key={item.month} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-500"
                  style={{
                    height: `${(item.revenue / Math.max(...data.monthlyRevenue.map(m => m.revenue))) * 200}px`
                  }}
                ></div>
                <span className="text-xs text-gray-600 mt-2">{item.month}</span>
                <span className="text-xs font-medium text-gray-900">
                  {formatCurrency(item.revenue)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* User Activity Chart */}
        <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Son 7 Gün Aktivite</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {data.userActivity.map((item, index) => (
              <div key={item.date} className="flex-1 flex flex-col items-center">
                <div className="w-full flex flex-col gap-1">
                  <div
                    className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t-lg"
                    style={{
                      height: `${(item.users / Math.max(...data.userActivity.map(a => a.users))) * 100}px`
                    }}
                  ></div>
                  <div
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg"
                    style={{
                      height: `${(item.bookings / Math.max(...data.userActivity.map(a => a.bookings))) * 100}px`
                    }}
                  ></div>
                </div>
                <span className="text-xs text-gray-600 mt-2">
                  {new Date(item.date).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span className="text-gray-600">Kullanıcılar</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded"></div>
              <span className="text-gray-600">Rezervasyonlar</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top Services */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">En Popüler Hizmetler</h3>
        <div className="space-y-4">
          {data.topServices.map((service, index) => (
            <motion.div
              key={service.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{service.name}</h4>
                  <p className="text-sm text-gray-600">{formatNumber(service.bookings)} rezervasyon</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">{formatCurrency(service.revenue)}</p>
                <p className="text-sm text-gray-600">Toplam gelir</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Category Performance */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Kategori Performansı</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Kategori</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Rezervasyon</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Gelir</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900">Büyüme</th>
              </tr>
            </thead>
            <tbody>
              {data.categoryPerformance.map((category, index) => (
                <tr key={category.category} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium text-gray-900">{category.category}</td>
                  <td className="py-4 px-4 text-gray-600">{formatNumber(category.bookings)}</td>
                  <td className="py-4 px-4 text-gray-600">{formatCurrency(category.revenue)}</td>
                  <td className="py-4 px-4">
                    <div className={`flex items-center gap-1 ${getGrowthColor(category.growth)}`}>
                      {getGrowthIcon(category.growth)}
                      <span className="text-sm font-medium">{Math.abs(category.growth)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
