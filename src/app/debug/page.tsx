'use client'

import { useState, useEffect } from 'react'

export default function DebugPage() {
  const [services, setServices] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const testAPIs = async () => {
      try {
        console.log('Testing APIs...')
        
        // Test Services API
        console.log('Fetching services...')
        const servicesResponse = await fetch('/api/services?limit=3')
        console.log('Services response status:', servicesResponse.status)
        
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json()
          console.log('Services data:', servicesData)
          setServices(servicesData.success ? servicesData.data.services : [])
        } else {
          setError(`Services API error: ${servicesResponse.status}`)
        }

        // Test Recommendations API
        console.log('Fetching recommendations...')
        const recommendationsResponse = await fetch('/api/recommendations')
        console.log('Recommendations response status:', recommendationsResponse.status)
        
        if (recommendationsResponse.ok) {
          const recommendationsData = await recommendationsResponse.json()
          console.log('Recommendations data:', recommendationsData)
          setRecommendations(recommendationsData)
        } else {
          setError(`Recommendations API error: ${recommendationsResponse.status}`)
        }

      } catch (err) {
        console.error('API test error:', err)
        setError(`API test error: ${err}`)
      } finally {
        setLoading(false)
      }
    }

    testAPIs()
  }, [])

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">API Debug Test</h1>
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">API Debug Test</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Services */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Services API ({services.length})</h2>
          <div className="space-y-4">
            {services.map((service: any, index) => (
              <div key={service.id || index} className="border p-4 rounded-lg bg-white">
                <h3 className="font-semibold text-lg">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-bold">₺{service.price}</span>
                  <span className="text-sm text-gray-500">{service.provider?.name}</span>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  <p>ID: {service.id}</p>
                  <p>Category: {service.category}</p>
                  <p>Location: {service.location}</p>
                  <p>Images: {JSON.stringify(service.images)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Recommendations API ({recommendations.length})</h2>
          <div className="space-y-4">
            {recommendations.map((rec: any, index) => (
              <div key={rec.id || index} className="border p-4 rounded-lg bg-white">
                <h3 className="font-semibold text-lg">{rec.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{rec.provider}</p>
                <div className="flex justify-between items-center">
                  <span className="text-blue-600 font-bold">₺{rec.price}</span>
                  <span className="text-sm text-gray-500">{rec.confidence}% confidence</span>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  <p>Category: {rec.category}</p>
                  <p>Rating: {rec.rating}</p>
                  <p>Review Count: {rec.reviewCount}</p>
                  <p>Reason: {rec.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
