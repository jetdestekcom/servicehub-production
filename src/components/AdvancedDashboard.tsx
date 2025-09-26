'use client'

import { useState, useEffect } from 'react'
import { 
  ChartBarIcon, 
  UsersIcon, 
  CurrencyDollarIcon, 
  CalendarDaysIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  TrendingUpIcon,
  TrendingDownIcon
} from '@heroicons/react/24/outline'

interface KPIMetric {
  id: string
  name: string
  value: number
  change: number
  changeType: 'increase' | 'decrease' | 'neutral'
  period: string
  category: string
  icon: string
  color: string
}

interface SecurityEvent {
  id: string
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  timestamp: string
  resolved: boolean
}

interface TrendData {
  period: string
  value: number
  change: number
}

export default function AdvancedDashboard() {
  const [kpis, setKpis] = useState<KPIMetric[]>([])
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [trends, setTrends] = useState<Record<string, TrendData[]>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [kpisResponse, securityResponse, trendsResponse] = await Promise.all([
        fetch('/api/analytics/advanced'),
        fetch('/api/security/events?limit=10'),
        fetch('/api/analytics/trends')
      ])

      if (kpisResponse.ok) {
        const kpisData = await kpisResponse.json()
        setKpis(kpisData.data.kpis || [])
      }

      if (securityResponse.ok) {
        const securityData = await securityResponse.json()
        setSecurityEvents(securityData.data.events || [])
      }

      if (trendsResponse.ok) {
        const trendsData = await trendsResponse.json()
        setTrends(trendsData.data || {})
      }
    } catch (error) {
      console.error('Dashboard veri hatası:', error)
    } finally {
      setLoading(false)
    }
  }

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return <TrendingUpIcon className="w-4 h-4 text-green-500" />
      case 'decrease':
        return <TrendingDownIcon className="w-4 h-4 text-red-500" />
      default:
        return <div className="w-4 h-4" />
    }
  }

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return 'text-green-600'
      case 'decrease':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* KPI Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <div key={kpi.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{kpi.name}</p>
                <p className="text-2xl font-bold text-gray-900">
                  {kpi.category === 'revenue' ? formatCurrency(kpi.value) : formatNumber(kpi.value)}
                </p>
              </div>
              <div className={`p-3 rounded-full bg-${kpi.color}-100`}>
                <span className="text-2xl">{kpi.icon}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center">
              {getChangeIcon(kpi.changeType)}
              <span className={`ml-2 text-sm font-medium ${getChangeColor(kpi.changeType)}`}>
                {kpi.change > 0 ? '+' : ''}{kpi.change.toFixed(1)}%
              </span>
              <span className="ml-2 text-sm text-gray-500">{kpi.period}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Grafikler ve Trendler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gelir Trendi */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gelir Trendi</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <ChartBarIcon className="w-12 h-12" />
            <span className="ml-2">Grafik verisi yükleniyor...</span>
          </div>
        </div>

        {/* Kullanıcı Aktivitesi */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Kullanıcı Aktivitesi</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <UsersIcon className="w-12 h-12" />
            <span className="ml-2">Grafik verisi yükleniyor...</span>
          </div>
        </div>
      </div>

      {/* Güvenlik Olayları */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Güvenlik Olayları</h3>
            <div className="flex items-center space-x-2">
              <ShieldCheckIcon className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-500">Son 24 saat</span>
            </div>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {securityEvents.length > 0 ? (
            securityEvents.map((event) => (
              <div key={event.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(event.severity)}`}>
                      {event.severity.toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{event.type}</p>
                      <p className="text-sm text-gray-500">{event.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {new Date(event.timestamp).toLocaleString('tr-TR')}
                    </span>
                    {event.severity === 'critical' && (
                      <ExclamationTriangleIcon className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              <ShieldCheckIcon className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>Son 24 saatte güvenlik olayı bulunmuyor</p>
            </div>
          )}
        </div>
      </div>

      {/* Hızlı İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100">
              <UsersIcon className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Aktif Kullanıcılar</p>
              <p className="text-2xl font-bold text-gray-900">
                {kpis.find(k => k.id === 'active_users')?.value || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100">
              <CalendarDaysIcon className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bugünkü Rezervasyonlar</p>
              <p className="text-2xl font-bold text-gray-900">
                {kpis.find(k => k.id === 'today_bookings')?.value || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100">
              <CurrencyDollarIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Günlük Gelir</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(kpis.find(k => k.id === 'daily_revenue')?.value || 0)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}