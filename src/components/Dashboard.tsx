// Dashboard.tsx - Student Dashboard Component
// Displays student overview, progress, courses, assignments, and performance metrics

import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { BookOpen, Target, Award, TrendingUp, Clock, CheckCircle, ChevronRight, Sparkles, Calendar, Bell, User, FileText, Activity } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { studentAPI, DashboardData } from "../services/studentAPI";
import { useAuth } from "../contexts/AuthContext";

export function Dashboard() {
  const { user, token } = useAuth();
  
  // Add null check
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Please login first...</p>
        </div>
      </div>
    );
  }

  // State management for dashboard
  const [hoveredStat, setHoveredStat] = useState<string | null>(null); // Track hovered stat card
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null); // Dashboard data from API
  const [loading, setLoading] = useState(true); // Loading state for data fetching

  // Fetch dashboard data when component mounts or user changes
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true); // Start loading
        console.log("📊 Fetching dashboard data for user:", user.id);
        
        // Call student API to get dashboard data
        const data = await studentAPI.getDashboardData(user.id);
        setDashboardData(data); // Set fetched data
        console.log("✅ Dashboard data received:", data);
        
      } catch (error) {
        console.error("❌ Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data");
        
        // Fallback data in case API fails - ensures UI still works
        setDashboardData({
          studentName: user.name,
          studentEmail: user.email,
          studentId: user.studentId || "KH2024-1234",
          enrolledCourses: 8,
          completedCourses: 3,
          overallProgress: 65,
          recentEnrollments: [
            {
              courseId: "web_dev_001",
              courseTitle: "Web Development Bootcamp",
              enrolledDate: new Date().toISOString(),
              progress: 75,
              status: "enrolled"
            },
            {
              courseId: "dsa_001", 
              courseTitle: "Data Structures & Algorithms",
              enrolledDate: new Date().toISOString(),
              progress: 45,
              status: "enrolled"
            },
            {
              courseId: "dm_001",
              courseTitle: "Digital Marketing Fundamentals", 
              enrolledDate: new Date().toISOString(),
              progress: 90,
              status: "enrolled"
            }
          ],
          joinDate: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        });
      } finally {
        setLoading(false); // Loading complete
      }
    };
    
    fetchDashboardData();
  }, [user]); // Re-fetch when user changes

  // Dynamic stats cards data - uses real data from API when available
  const stats = [
    { 
      label: "Courses Enrolled", 
      value: dashboardData?.enrolledCourses?.toString() || "0", 
      icon: BookOpen, 
      gradient: "from-blue-500 to-cyan-500", 
      shadow: "shadow-blue-500/30" 
    },
    { 
      label: "Courses Completed", 
      value: dashboardData?.completedCourses?.toString() || "0", 
      icon: CheckCircle, 
      gradient: "from-green-500 to-emerald-500", 
      shadow: "shadow-green-500/30" 
    },
    { 
      label: "Overall Progress", 
      value: `${dashboardData?.overallProgress || 0}%`, 
      icon: TrendingUp, 
      gradient: "from-purple-500 to-pink-500", 
      shadow: "shadow-purple-500/30" 
    },
    { 
      label: "Skills Acquired", 
      value: "12", // Static for now, can be dynamic later
      icon: Target, 
      gradient: "from-yellow-500 to-orange-500", 
      shadow: "shadow-yellow-500/30" 
    },
  ];

  // Recent courses data - maps API data to UI format
  const recentCourses = dashboardData?.recentEnrollments?.map((course, index) => ({
    id: index + 1,
    name: course.courseTitle,
    progress: course.progress,
    nextClass: index === 0 ? "Today, 2:00 PM" : 
               index === 1 ? "Tomorrow, 10:00 AM" : "Friday, 3:00 PM",
    instructor: index === 0 ? "Dr. Sarah Chen" : 
                index === 1 ? "Prof. Rajesh Kumar" : "Ms. Anita Sharma"
  })) || [ // Fallback data if no API data
    { id: 1, name: "Web Development Bootcamp", progress: 75, nextClass: "Today, 2:00 PM", instructor: "Dr. Sarah Chen" },
    { id: 2, name: "Data Structures & Algorithms", progress: 45, nextClass: "Tomorrow, 10:00 AM", instructor: "Prof. Rajesh Kumar" },
    { id: 3, name: "Digital Marketing Fundamentals", progress: 90, nextClass: "Friday, 3:00 PM", instructor: "Ms. Anita Sharma" },
  ];

  // Static upcoming assignments data
  const upcomingAssignments = [
    { id: 1, title: "React Project Submission", course: "Web Development", dueDate: "Oct 12, 2025", priority: "high" },
    { id: 2, title: "Binary Tree Problems", course: "DSA", dueDate: "Oct 15, 2025", priority: "medium" },
    { id: 3, title: "SEO Case Study", course: "Digital Marketing", dueDate: "Oct 18, 2025", priority: "low" },
  ];

  // Static recent activity data
  const recentActivity = [
    { id: 1, type: "completed", text: "Completed 'Advanced React Hooks' module", time: "2 hours ago" },
    { id: 2, type: "certificate", text: "Earned certificate in Python Basics", time: "1 day ago" },
    { id: 3, type: "assignment", text: "Submitted JavaScript Project", time: "2 days ago" },
  ];

  // Handle quick action buttons
  const handleQuickAction = (action: string) => {
    toast.success(`${action} opened!`, {
      description: "Taking you to the right section...",
    });
  };

  // Loading state UI
  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="animate-pulse">
          {/* Header Loading Skeleton */}
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          
          {/* Stats Grid Loading Skeleton */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-200 h-32 rounded-lg"></div>
            ))}
          </div>
          
          {/* Content Loading Skeleton */}
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 bg-gray-200 h-64 rounded-lg"></div>
            <div className="bg-gray-200 h-64 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  // Main dashboard UI
  return (
    <div className="space-y-6">
      {/* Welcome Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-bold">
              Welcome back, {dashboardData?.studentName || "Student"}! <Sparkles className="h-6 w-6 text-yellow-500" />
            </h1>
            <p className="text-muted-foreground">
              {dashboardData?.enrolledCourses ? 
                `You have ${dashboardData.enrolledCourses} enrolled courses. Continue your learning journey!` : 
                'Start your learning journey by enrolling in courses!'
              }
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                Student ID: {dashboardData?.studentId || "N/A"}
              </span>
              <span>•</span>
              <span>Overall Progress: {dashboardData?.overallProgress || 0}%</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleQuickAction("Calendar")}>
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleQuickAction("Notifications")}>
              <Bell className="h-4 w-4 mr-2" />
              Alerts
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid Section - Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20, rotateX: -15 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1, type: "spring" }}
              onHoverStart={() => setHoveredStat(stat.label)}
              onHoverEnd={() => setHoveredStat(null)}
              whileHover={{ 
                y: -8, 
                rotateX: 2,
                transition: { duration: 0.3 }
              }}
            >
              <Card className={`p-6 cursor-pointer transition-all relative overflow-hidden border-0 shadow-xl ${stat.shadow}`}
                style={{
                  background: `linear-gradient(135deg, white 0%, #fafafa 100%)`,
                  transformStyle: "preserve-3d"
                }}
              >
                {/* Animated gradient overlay */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-5`}
                  animate={hoveredStat === stat.label ? { opacity: 0.1 } : { opacity: 0.05 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Shimmer effect on hover */}
                {hoveredStat === stat.label && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  />
                )}

                <div className="flex items-center justify-between relative z-10">
                  <div className="space-y-1">
                    <p className="text-muted-foreground text-sm">{stat.label}</p>
                    <motion.h2
                      className={`text-2xl font-bold bg-gradient-to-br ${stat.gradient} bg-clip-text text-transparent`}
                      initial={{ scale: 1 }}
                      animate={{ scale: hoveredStat === stat.label ? 1.15 : 1 }}
                      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                    >
                      {stat.value}
                    </motion.h2>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: hoveredStat === stat.label ? "60%" : 0 }}
                      className={`h-1 rounded-full bg-gradient-to-r ${stat.gradient}`}
                    />
                  </div>
                  <motion.div
                    className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} shadow-2xl`}
                    animate={{
                      rotate: hoveredStat === stat.label ? 360 : 0,
                      scale: hoveredStat === stat.label ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.5, type: "spring" }}
                    style={{
                      boxShadow: hoveredStat === stat.label 
                        ? `0 15px 35px -10px ${stat.gradient.includes('blue') ? 'rgba(59, 130, 246, 0.5)' : 
                                                  stat.gradient.includes('green') ? 'rgba(34, 197, 94, 0.5)' :
                                                  stat.gradient.includes('yellow') ? 'rgba(251, 146, 60, 0.5)' :
                                                  'rgba(168, 85, 247, 0.5)'}`
                        : 'none'
                    }}
                  >
                    <Icon className="h-7 w-7 text-white drop-shadow-lg" />
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Grid - Courses and Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Courses Section - Takes 2/3 width on large screens */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Continue Learning</h3>
              <Button variant="ghost" size="sm">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="space-y-4">
              {recentCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                  className="p-4 border rounded-lg space-y-3 cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{course.name}</p>
                      <p className="text-muted-foreground text-sm">{course.instructor}</p>
                    </div>
                    <motion.span
                      className="text-muted-foreground font-semibold"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      {course.progress}%
                    </motion.span>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{course.nextClass}</span>
                    </div>
                    <Button size="sm" variant="outline">
                      Continue
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* Recent Activity Section - Takes 1/3 width on large screens */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                  className="flex gap-3"
                >
                  <div className={`h-2 w-2 mt-2 rounded-full ${
                    activity.type === 'completed' ? 'bg-green-500' :
                    activity.type === 'certificate' ? 'bg-yellow-500' :
                    'bg-blue-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm">{activity.text}</p>
                    <p className="text-muted-foreground text-xs">{activity.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Upcoming Assignments Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold">Upcoming Assignments</h3>
            <Button variant="ghost" size="sm">
              View All <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {upcomingAssignments.map((assignment, index) => (
              <motion.div
                key={assignment.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="p-4 border rounded-lg space-y-2 cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <p className="font-medium">{assignment.title}</p>
                  <span className={`px-2 py-1 rounded text-white text-xs ${
                    assignment.priority === 'high' ? 'bg-red-500' :
                    assignment.priority === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                  }`}>
                    {assignment.priority}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">{assignment.course}</p>
                <div className="flex items-center justify-between pt-2">
                  <p className="text-muted-foreground text-sm">{assignment.dueDate}</p>
                  <Button size="sm" variant="outline">Start</Button>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Performance Overview Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">This Month's Performance</h3>
          <div className="grid gap-4 md:grid-cols-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-4 p-4 rounded-lg border cursor-pointer"
            >
              <div className="p-3 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Average Score</p>
                <h3 className="text-xl font-bold">87%</h3>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-4 p-4 rounded-lg border cursor-pointer"
            >
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Assignments Completed</p>
                <h3 className="text-xl font-bold">12/15</h3>
              </div>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-4 p-4 rounded-lg border cursor-pointer"
            >
              <div className="p-3 bg-purple-100 rounded-lg">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-muted-foreground text-sm">Study Hours</p>
                <h3 className="text-xl font-bold">42 hrs</h3>
              </div>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}