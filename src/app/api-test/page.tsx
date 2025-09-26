'use client'

export default function APITestPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Direct API Test</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Services API Test:</h2>
          <p>Open browser console (F12) and run this JavaScript:</p>
          <pre className="bg-gray-100 p-2 rounded text-sm mt-2">
{`fetch('/api/services?limit=1')
  .then(res => res.json())
  .then(data => console.log('Services API:', data))
  .catch(err => console.error('Error:', err))`}
          </pre>
        </div>
        
        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Recommendations API Test:</h2>
          <p>Open browser console (F12) and run this JavaScript:</p>
          <pre className="bg-gray-100 p-2 rounded text-sm mt-2">
{`fetch('/api/recommendations')
  .then(res => res.json())
  .then(data => console.log('Recommendations API:', data))
  .catch(err => console.error('Error:', err))`}
          </pre>
        </div>
        
        <div className="p-4 border rounded">
          <h2 className="font-semibold mb-2">Direct URL Test:</h2>
          <p>Try these URLs directly in your browser:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><a href="/api/services?limit=1" target="_blank" className="text-blue-600 hover:underline">/api/services?limit=1</a></li>
            <li><a href="/api/recommendations" target="_blank" className="text-blue-600 hover:underline">/api/recommendations</a></li>
          </ul>
        </div>
      </div>
    </div>
  )
}
