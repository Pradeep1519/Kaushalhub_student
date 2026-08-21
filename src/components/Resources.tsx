export function Resources() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Learning Resources</h1>
        <p className="text-muted-foreground">Access study materials, notes, and reference documents</p>
      </div>

      {/* Simple Message */}
      <div className="p-8 text-center space-y-4">
        {/* Simple Icon */}
        <div className="inline-block p-4 bg-green-100 rounded-full">
          <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">📚</span>
          </div>
        </div>
        
        {/* Clear Message */}
        <div>
          <h3 className="text-xl font-semibold mb-2">We're Working On It</h3>
          <p className="text-gray-600">
            The learning resources feature is currently under development.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Study materials and reference documents will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
}