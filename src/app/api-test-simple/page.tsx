'use client'

import { useState, useEffect } from 'react'

export default function ApiTestPage() {
  const [services, setServices] = useState<any>(null)
  const [providers, setProviders] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const testApis = async () => {
      try {
        setLoading(true)
        
        // Test Services API
        const servicesResponse = await fetch('/api/services?limit=3')
        const servicesData = await servicesResponse.json()
        setServices(servicesData)
        
        // Test Providers API
        const providersResponse = await fetch('/api/providers?limit=3')
        const providersData = await providersResponse.json()
        setProviders(providersData)
        
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    testApis()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Testing APIs...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">❌ Error</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">API Test Results</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Services API Test */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Services API</h2>
            <div className="bg-gray-100 rounded p-4 overflow-auto max-h-96">
              <pre className="text-sm">
                {JSON.stringify(services, null, 2)}
              </pre>
            </div>
          </div>

          {/* Providers API Test */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Providers API</h2>
            <div className="bg-gray-100 rounded p-4 overflow-auto max-h-96">
              <pre className="text-sm">
                {JSON.stringify(providers, null, 2)}
              </pre>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <a 
            href="/" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
