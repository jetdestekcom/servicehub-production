import SmartSearch from '@/components/SmartSearch'

export default function SmartSearchPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Akıllı Hizmet Arama
          </h1>
          <p className="mt-2 text-gray-600">
            AI destekli önerilerle ihtiyacınıza en uygun hizmeti bulun
          </p>
        </div>
      </div>
      
      <SmartSearch />
    </div>
  )
}

