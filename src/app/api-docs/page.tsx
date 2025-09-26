'use client'

import { useState } from 'react'
import { 
  CodeBracketIcon,
  DocumentTextIcon,
  PlayIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline'

interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  description: string
  parameters?: { name: string; type: string; required: boolean; description: string }[]
  response: { success: boolean; data?: unknown; error?: string; pagination?: { page: number; limit: number; total: number; totalPages: number } }
  example: string
}

const apiEndpoints: APIEndpoint[] = [
  {
    method: 'GET',
    path: '/api/services',
    description: 'Tüm hizmetleri listeler',
    parameters: [
      { name: 'category', type: 'string', required: false, description: 'Kategori filtresi' },
      { name: 'location', type: 'string', required: false, description: 'Konum filtresi' },
      { name: 'minPrice', type: 'number', required: false, description: 'Minimum fiyat' },
      { name: 'maxPrice', type: 'number', required: false, description: 'Maksimum fiyat' },
      { name: 'rating', type: 'number', required: false, description: 'Minimum puan' },
      { name: 'page', type: 'number', required: false, description: 'Sayfa numarası' },
      { name: 'limit', type: 'number', required: false, description: 'Sayfa başına kayıt' }
    ],
    response: {
      success: true,
      data: [
        {
          id: 'service-1',
          title: 'Profesyonel Ev Temizliği',
          description: '3 yatak odalı ev için kapsamlı temizlik hizmeti',
          price: 200,
          rating: 4.8,
          reviewCount: 156,
          provider: {
            id: 'provider-1',
            name: 'Ahmet Temizlik Uzmanı',
            rating: 4.8
          },
          category: 'ev-temizligi',
          location: 'İstanbul - Avrupa Yakası',
          images: ['/api/placeholder/400/300'],
          features: ['Mutfak temizliği', 'Banyo temizliği'],
          availability: 'Hafta içi 09:00-18:00',
          isVerified: true,
          createdAt: '2024-01-10T00:00:00Z'
        }
      ],
      pagination: {
        page: 1,
        limit: 20,
        total: 100,
        totalPages: 5
      }
    },
    example: `curl -X GET "https://jetdestek.com/api/services?category=ev-temizligi&location=istanbul&minPrice=100&maxPrice=500&rating=4.0&page=1&limit=20" \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -H "Content-Type: application/json"`
  },
  {
    method: 'POST',
    path: '/api/bookings',
    description: 'Yeni rezervasyon oluşturur',
    parameters: [
      { name: 'serviceId', type: 'string', required: true, description: 'Hizmet ID' },
      { name: 'scheduledDate', type: 'string', required: true, description: 'Rezervasyon tarihi (ISO 8601)' },
      { name: 'duration', type: 'string', required: true, description: 'Hizmet süresi' },
      { name: 'address', type: 'string', required: true, description: 'Hizmet adresi' },
      { name: 'notes', type: 'string', required: false, description: 'Ek notlar' }
    ],
    response: {
      success: true,
      data: {
        id: 'booking-123',
        status: 'pending',
        scheduledDate: '2024-01-26T10:00:00Z',
        duration: '3-4 saat',
        price: 200,
        address: 'Kadıköy, İstanbul',
        notes: '3 yatak odalı ev',
        customerId: 'customer-1',
        serviceId: 'service-1',
        providerId: 'provider-1',
        createdAt: '2024-01-25T14:30:00Z'
      }
    },
    example: `curl -X POST "https://jetdestek.com/api/bookings" \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "serviceId": "service-1",
    "scheduledDate": "2024-01-26T10:00:00Z",
    "duration": "3-4 saat",
    "address": "Kadıköy, İstanbul",
    "notes": "3 yatak odalı ev"
  }'`
  },
  {
    method: 'GET',
    path: '/api/users/profile',
    description: 'Kullanıcı profil bilgilerini getirir',
    parameters: [],
    response: {
      success: true,
      data: {
        id: 'user-1',
        name: 'Ayşe Yılmaz',
        email: 'ayse@example.com',
        phone: '+90 532 123 45 67',
        image: '/api/placeholder/150/150',
        role: 'CUSTOMER',
        isVerified: true,
        rating: 4.9,
        reviewCount: 23,
        createdAt: '2024-01-15T00:00:00Z',
        location: 'Kadıköy, İstanbul'
      }
    },
    example: `curl -X GET "https://jetdestek.com/api/users/profile" \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -H "Content-Type: application/json"`
  },
  {
    method: 'POST',
    path: '/api/reviews',
    description: 'Hizmet için yorum oluşturur',
    parameters: [
      { name: 'serviceId', type: 'string', required: true, description: 'Hizmet ID' },
      { name: 'providerId', type: 'string', required: true, description: 'Hizmet veren ID' },
      { name: 'rating', type: 'number', required: true, description: 'Puan (1-5)' },
      { name: 'comment', type: 'string', required: true, description: 'Yorum metni' }
    ],
    response: {
      success: true,
      data: {
        id: 'review-123',
        rating: 5,
        comment: 'Çok memnun kaldım! Evim tertemiz oldu.',
        customerId: 'customer-1',
        serviceId: 'service-1',
        providerId: 'provider-1',
        createdAt: '2024-01-20T18:30:00Z'
      }
    },
    example: `curl -X POST "https://jetdestek.com/api/reviews" \\
  -H "Authorization: Bearer YOUR_API_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "serviceId": "service-1",
    "providerId": "provider-1",
    "rating": 5,
    "comment": "Çok memnun kaldım! Evim tertemiz oldu."
  }'`
  }
]

export default function APIDocsPage() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<APIEndpoint | null>(null)
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCode(id)
    setTimeout(() => setCopiedCode(null), 2000)
  }

  const getMethodColor = (method: string) => {
    switch (method) {
      case 'GET': return 'bg-green-100 text-green-800'
      case 'POST': return 'bg-blue-100 text-blue-800'
      case 'PUT': return 'bg-yellow-100 text-yellow-800'
      case 'DELETE': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">API Dokümantasyonu</h1>
          <p className="text-gray-600 mt-2">JetDestek.com API&apos;sini kullanarak entegrasyon yapın</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar - Endpoints List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">API Endpoints</h2>
              <div className="space-y-2">
                {apiEndpoints.map((endpoint, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedEndpoint(endpoint)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedEndpoint?.path === endpoint.path
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getMethodColor(endpoint.method)}`}>
                        {endpoint.method}
                      </span>
                      <span className="text-sm font-medium text-gray-900">{endpoint.path}</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{endpoint.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Endpoint Details */}
          <div className="lg:col-span-2">
            {selectedEndpoint ? (
              <div className="bg-white rounded-2xl shadow-sm p-6">
                {/* Endpoint Header */}
                <div className="flex items-center gap-4 mb-6">
                  <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getMethodColor(selectedEndpoint.method)}`}>
                    {selectedEndpoint.method}
                  </span>
                  <code className="text-lg font-mono text-gray-900">{selectedEndpoint.path}</code>
                </div>

                <p className="text-gray-600 mb-6">{selectedEndpoint.description}</p>

                {/* Parameters */}
                {selectedEndpoint.parameters && selectedEndpoint.parameters.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Parametreler</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">Parametre</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">Tip</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">Zorunlu</th>
                            <th className="text-left py-3 px-4 font-semibold text-gray-900">Açıklama</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedEndpoint.parameters.map((param, index) => (
                            <tr key={index} className="border-b border-gray-100">
                              <td className="py-3 px-4">
                                <code className="text-sm font-mono text-blue-600">{param.name}</code>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600">{param.type}</td>
                              <td className="py-3 px-4">
                                {param.required ? (
                                  <span className="inline-flex items-center gap-1 text-red-600 text-sm">
                                    <CheckCircleIcon className="h-4 w-4" />
                                    Evet
                                  </span>
                                ) : (
                                  <span className="text-gray-500 text-sm">Hayır</span>
                                )}
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-600">{param.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Response */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Yanıt</h3>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-green-400 text-sm">
                      {JSON.stringify(selectedEndpoint.response, null, 2)}
                    </pre>
                  </div>
                </div>

                {/* Example */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Örnek Kullanım</h3>
                    <button
                      onClick={() => copyToClipboard(selectedEndpoint.example, selectedEndpoint.path)}
                      className="flex items-center gap-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors"
                    >
                      {copiedCode === selectedEndpoint.path ? (
                        <>
                          <CheckCircleIcon className="h-4 w-4 text-green-600" />
                          Kopyalandı!
                        </>
                      ) : (
                        <>
                          <ClipboardDocumentIcon className="h-4 w-4" />
                          Kopyala
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                    <pre className="text-blue-400 text-sm whitespace-pre-wrap">
                      {selectedEndpoint.example}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm p-12 text-center">
                <CodeBracketIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">API Endpoint Seçin</h3>
                <p className="text-gray-600">Detaylarını görmek istediğiniz endpoint&apos;i seçin</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className="mt-12 bg-white rounded-2xl shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Hızlı Başlangıç</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1. API Anahtarı Al</h3>
              <p className="text-gray-600 text-sm">Dashboard&apos;dan API anahtarınızı oluşturun ve güvenli bir yerde saklayın.</p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <PlayIcon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Test Et</h3>
              <p className="text-gray-600 text-sm">Postman veya curl ile API&apos;yi test edin ve yanıtları inceleyin.</p>
            </div>

            <div className="p-6 border border-gray-200 rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <CodeBracketIcon className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Entegre Et</h3>
              <p className="text-gray-600 text-sm">Uygulamanıza entegre edin ve JetDestek hizmetlerini kullanın.</p>
            </div>
          </div>

          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <InformationCircleIcon className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-900 mb-2">API Limitleri</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Dakikada 100 istek (rate limit)</li>
                  <li>• Günlük 10,000 istek limiti</li>
                  <li>• Maksimum 1MB yanıt boyutu</li>
                  <li>• HTTPS zorunlu</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
