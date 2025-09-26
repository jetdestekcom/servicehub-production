'use client'

import { useState, useEffect } from 'react'

export default function TestPage() {
  const [services, setServices] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Test Services API
        const servicesResponse = await fetch('/api/services?limit=3')
        const servicesData = await servicesResponse.json()
        console.log('Services API Response:', servicesData)
        setServices(servicesData.success ? servicesData.data.services : [])

        // Test Recommendations API
        const recommendationsResponse = await fetch('/api/recommendations')
        const recommendationsData = await recommendationsResponse.json()
        console.log('Recommendations API Response:', recommendationsData)
        setRecommendations(recommendationsData)

      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">API Test Page</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Services ({services.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((service: any) => (
            <div key={service.id} className="border p-4 rounded-lg">
              <h3 className="font-semibold">{service.title}</h3>
              <p className="text-gray-600 text-sm">{service.description}</p>
              <p className="text-blue-600 font-bold">₺{service.price}</p>
              <p className="text-sm text-gray-500">Provider: {service.provider?.name}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">AI Recommendations ({recommendations.length})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((rec: any) => (
            <div key={rec.id} className="border p-4 rounded-lg">
              <h3 className="font-semibold">{rec.title}</h3>
              <p className="text-gray-600 text-sm">{rec.provider}</p>
              <p className="text-blue-600 font-bold">₺{rec.price}</p>
              <p className="text-sm text-gray-500">Confidence: {rec.confidence}%</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
