export function LiveClasses() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Live Classes</h1>
        <p className="text-muted-foreground">Attend live sessions and watch recorded lectures</p>
      </div>

      {/* Simple Message - No Card */}
      <div className="p-8 text-center space-y-4">
        {/* Simple Icon */}
        <div className="inline-block p-4 bg-purple-100 rounded-full">
          <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">▶</span>
          </div>
        </div>
        
        {/* Clear Message */}
        <div>
          <h3 className="text-xl font-semibold mb-2">We're Working On It</h3>
          <p className="text-gray-600">
            The live classes feature is currently under development.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Live sessions and recorded lectures will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
}