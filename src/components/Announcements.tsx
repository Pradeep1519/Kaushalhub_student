export function Announcements() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Announcements</h1>
        <p className="text-muted-foreground">Stay updated with important news and updates</p>
      </div>

      {/* Simple Message */}
      <div className="p-8 text-center space-y-4">
        {/* Simple Icon */}
        <div className="inline-block p-4 bg-teal-100 rounded-full">
          <div className="h-12 w-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">📢</span>
          </div>
        </div>
        
        {/* Clear Message */}
        <div>
          <h3 className="text-xl font-semibold mb-2">We're Working On It</h3>
          <p className="text-gray-600">
            The announcements feature is currently under development.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Important news and updates will be available soon.
          </p>
        </div>
      </div>
    </div>
  );
}