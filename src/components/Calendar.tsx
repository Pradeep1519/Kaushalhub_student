import { Calendar as CalendarIcon } from "lucide-react";

export function Calendar() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Calendar & Schedule</h1>
        <p className="text-muted-foreground">Your personalized academic planner</p>
      </div>

      {/* Simple Message - No Card */}
      <div className="p-8 text-center space-y-4">
        {/* Simple Icon */}
        <div className="inline-block p-4 bg-blue-100 rounded-full">
          <CalendarIcon className="h-12 w-12 text-blue-600" />
        </div>
        
        {/* Clear Message */}
        <div>
          <h3 className="text-xl font-semibold mb-2">We're Working On It</h3>
          <p className="text-gray-600">
            The calendar feature is currently under development.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            This will be available in the next update.
          </p>
        </div>
      </div>
    </div>
  );
}