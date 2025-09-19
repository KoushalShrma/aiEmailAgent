export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="relative">
          <div className="animate-spin h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <div className="animate-ping absolute inset-0 h-12 w-12 border-4 border-blue-300 rounded-full mx-auto"></div>
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-gray-800">Loading AI Email Agent</h2>
          <p className="text-gray-600">Preparing your professional email generator...</p>
        </div>
      </div>
    </div>
  )
}
