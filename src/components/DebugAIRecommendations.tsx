'use client'

import { useState, useEffect } from 'react'

export function DebugAIRecommendations() {
  const [recommendations, setRecommendations] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/recommendations')
        if (response.ok) {
          const data = await response.json()
          console.log('DebugAIRecommendations - Fetched data:', data)
          console.log('DebugAIRecommendations - Data length:', data.length)
          setRecommendations(data)
        } else {
          console.error('DebugAIRecommendations - Response not ok:', response.status)
        }
      } catch (error) {
        console.error('DebugAIRecommendations - Error:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendations()
  }, [])

  if (isLoading) {
    return (
      <div className="bg-yellow-100 border-2 border-yellow-500 p-4 rounded-lg">
        <h2 className="text-xl font-bold">AI Önerileri - Loading...</h2>
      </div>
    )
  }

  return (
    <div className="bg-yellow-100 border-2 border-yellow-500 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">AI Önerileri Debug ({recommendations.length})</h2>
      
      {recommendations.length === 0 ? (
        <p className="text-red-600">No recommendations found!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec: any, index) => (
            <div key={rec.id || index} className="bg-white p-3 rounded border">
              <h3 className="font-semibold">{rec.title}</h3>
              <p className="text-sm text-gray-600">{rec.provider}</p>
              <p className="text-blue-600 font-bold">₺{rec.price}</p>
              <p className="text-xs text-gray-500">Confidence: {rec.confidence}%</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
