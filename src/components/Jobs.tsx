export function Jobs() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Job Opportunities</h1>
        <p className="text-muted-foreground">Find opportunities matching your skills</p>
      </div>

      {/* Simple Message */}
      <div className="p-8 text-center space-y-4">
        {/* Simple Icon */}
        <div className="inline-block p-4 bg-indigo-100 rounded-full">
          <div className="h-12 w-12 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">💼</span>
          </div>
        </div>
        
        {/* Clear Message */}
        <div>
          <h3 className="text-xl font-semibold mb-2">Coming Soon!</h3>
          <p className="text-gray-600">
            You will be eligible for job placements when you complete 85% of your course.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Complete your course to unlock job opportunities.
          </p>
        </div>
      </div>
    </div>
  );
}