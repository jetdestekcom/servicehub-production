'use client'

import { useState } from 'react'

export default function SimpleDebugPage() {
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)

  const testAPI = async () => {
    setLoading(true)
    setResult('Testing...')
    
    try {
      console.log('Starting API test...')
      
      // Test Services API
      const response = await fetch('/api/services?limit=1')
      console.log('Response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Response data:', data)
        setResult(`SUCCESS: Got ${data.success ? data.data.services.length : 0} services`)
      } else {
        setResult(`ERROR: ${response.status} - ${response.statusText}`)
      }
    } catch (error) {
      console.error('API test error:', error)
      setResult(`CATCH ERROR: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Simple API Debug</h1>
      
      <button 
        onClick={testAPI}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Testing...' : 'Test API'}
      </button>
      
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <h2 className="font-semibold">Result:</h2>
        <p>{result || 'Click "Test API" to start'}</p>
      </div>
      
      <div className="mt-4 p-4 bg-yellow-100 rounded">
        <h2 className="font-semibold">Instructions:</h2>
        <p>1. Click "Test API" button</p>
        <p>2. Check browser console (F12) for logs</p>
        <p>3. Look at the result above</p>
      </div>
    </div>
  )
}
