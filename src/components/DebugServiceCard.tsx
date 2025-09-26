'use client'

interface DebugServiceCardProps {
  service: any
}

export default function DebugServiceCard({ service }: DebugServiceCardProps) {
  console.log('DebugServiceCard rendering service:', service)
  
  return (
    <div className="bg-white border-2 border-red-500 p-4 rounded-lg">
      <h3 className="font-bold text-lg">{service?.title || 'No Title'}</h3>
      <p className="text-gray-600">{service?.description || 'No Description'}</p>
      <p className="text-blue-600 font-bold">₺{service?.price || 0}</p>
      <p className="text-sm text-gray-500">Provider: {service?.provider?.name || 'No Provider'}</p>
      <p className="text-xs text-gray-400">ID: {service?.id || 'No ID'}</p>
      <div className="mt-2 text-xs">
        <p>Images: {JSON.stringify(service?.images)}</p>
        <p>Rating: {service?.rating}</p>
        <p>ReviewCount: {service?.reviewCount}</p>
      </div>
    </div>
  )
}
