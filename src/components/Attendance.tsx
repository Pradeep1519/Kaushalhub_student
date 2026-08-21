import { Card } from "./ui/card";

export function Attendance() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Attendance Tracker</h1>
        <p className="text-muted-foreground">Monitor your class attendance and maintain regularity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-6 text-center">
          <div className="text-center space-y-2">
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-blue-600">📅</span>
            </div>
            <p className="text-sm text-gray-500">Overall Attendance</p>
            <p className="text-gray-600">Coming Soon</p>
          </div>
        </Card>

        <Card className="p-6 text-center">
          <div className="text-center space-y-2">
            <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-green-600">✓</span>
            </div>
            <p className="text-sm text-gray-500">Classes Attended</p>
            <p className="text-gray-600">Coming Soon</p>
          </div>
        </Card>

        <Card className="p-6 text-center">
          <div className="text-center space-y-2">
            <div className="h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-red-600">✗</span>
            </div>
            <p className="text-sm text-gray-500">Classes Missed</p>
            <p className="text-gray-600">Coming Soon</p>
          </div>
        </Card>

        <Card className="p-6 text-center">
          <div className="text-center space-y-2">
            <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center mx-auto">
              <span className="text-orange-600">⏰</span>
            </div>
            <p className="text-sm text-gray-500">Late Arrivals</p>
            <p className="text-gray-600">Coming Soon</p>
          </div>
        </Card>
      </div>

      {/* Course-wise Attendance Card */}
      <Card className="p-6">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-indigo-600">📊</span>
          </div>
          <h3 className="text-xl font-semibold">Course-wise Attendance</h3>
          <p className="text-gray-600">Coming Soon</p>
        </div>
      </Card>

      {/* Recent Attendance Card */}
      <Card className="p-6">
        <div className="text-center space-y-4">
          <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
            <span className="text-purple-600">📝</span>
          </div>
          <h3 className="text-xl font-semibold">Recent Attendance</h3>
          <p className="text-gray-600">Coming Soon</p>
        </div>
      </Card>
    </div>
  );
}