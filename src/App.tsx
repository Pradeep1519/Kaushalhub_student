// App.tsx - Main Application Component with Authentication
import { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter,
} from "./components/ui/sidebar";
import { Dashboard } from "./components/Dashboard";
import { Courses } from "./components/Courses";
import { Assignments } from "./components/Assignments";
import { Performance } from "./components/Performance";
import { Jobs } from "./components/Jobs";
import { Profile } from "./components/Profile";
import { Calendar } from "./components/Calendar";
import { LiveClasses } from "./components/LiveClasses";
import { Resources } from "./components/Resources";
import { Attendance } from "./components/Attendance";
import { Messages } from "./components/Messages";
import { Announcements } from "./components/Announcements";
import { Support } from "./components/Support";
import { Login } from "./components/Login";
import { LayoutDashboard, BookOpen, ClipboardList, TrendingUp, Briefcase, User, GraduationCap, LogOut, Bell, ChevronRight, Moon, Sun, CalendarDays, Video, FolderOpen, UserCheck, MessageSquare, Megaphone, HelpCircle } from "lucide-react";
import { Separator } from "./components/ui/separator";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { Avatar, AvatarFallback } from "./components/ui/avatar";
import { Button } from "./components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./components/ui/dropdown-menu";
import { Badge } from "./components/ui/badge";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Main App Content Component
function AppContent() {
  const { user, logout, isLoading } = useAuth();
  const [activeView, setActiveView] = useState("dashboard");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [notifications] = useState(3);

  const handleLogout = () => {
    logout();
    setActiveView("dashboard");
    toast.success("Logged out successfully!");
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, badge: null },
    { id: "courses", label: "My Courses", icon: BookOpen, badge: user ? (user.enrolledCourses?.length || 0).toString() : null },
    { id: "assignments", label: "Assignments", icon: ClipboardList, badge: user ? "4" : null },
    { id: "calendar", label: "Calendar", icon: CalendarDays, badge: null },
    { id: "live-classes", label: "Live Classes", icon: Video, badge: user ? "1 Live" : null },
    { id: "resources", label: "Resources", icon: FolderOpen, badge: null },
    { id: "attendance", label: "Attendance", icon: UserCheck, badge: null },
    { id: "performance", label: "Performance", icon: TrendingUp, badge: null },
    { id: "jobs", label: "Job Opportunities", icon: Briefcase, badge: user ? "New" : null },
    { id: "messages", label: "Messages", icon: MessageSquare, badge: user ? "7" : null },
    { id: "announcements", label: "Announcements", icon: Megaphone, badge: user ? "2" : null },
    { id: "support", label: "Help & Support", icon: HelpCircle, badge: null },
    { id: "profile", label: "My Profile", icon: User, badge: null },
  ];

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    toast.success(`Switched to ${theme === "light" ? "dark" : "light"} mode`);
  };

  const renderContent = () => {
    if (!user) {
      return <Login />;
    }

    switch (activeView) {
      case "dashboard":
        return <Dashboard />;
      case "courses":
        return <Courses />;
      case "assignments":
        return <Assignments />;
      case "calendar":
        return <Calendar />;
      case "live-classes":
        return <LiveClasses />;
      case "resources":
        return <Resources />;
      case "attendance":
        return <Attendance />;
      case "performance":
        return <Performance />;
      case "jobs":
        return <Jobs />;
      case "messages":
        return <Messages />;
      case "announcements":
        return <Announcements />;
      case "support":
        return <Support />;
      case "profile":
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase();
    }
    return "U";
  };

  // Get user display name
  const getUserDisplayName = () => {
    return user?.name || "User";
  };

  // Get user email
  const getUserEmail = () => {
    return user?.email || "user@email.com";
  };

  // Show loading screen
  if (isLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="h-16 w-16 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-2xl mx-auto mb-4 flex items-center justify-center"
          >
            <GraduationCap className="h-8 w-8 text-white" />
          </motion.div>
          <h2 className="text-xl font-semibold text-gray-700">KaushalHub</h2>
          <p className="text-gray-500">Loading...</p>
        </motion.div>
      </div>
    );
  }

  // Show login page if user is not logged in
  if (!user) {
    return (
      <>
        <Login />
        <Toaster />
      </>
    );
  }

  // Main application layout
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
        {/* Sidebar Navigation */}
        <Sidebar className="border-r shadow-2xl backdrop-blur-xl bg-white/80">
          <SidebarHeader className="p-4 sm:p-6 border-b relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5" />
            <motion.div
              className="flex items-center gap-2 sm:gap-3 relative z-10"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <motion.div
                className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-2xl relative flex-shrink-0"
                whileHover={{ scale: 1.1, rotate: 360 }}
              >
                <GraduationCap className="h-6 w-6 sm:h-8 sm:w-8 text-white drop-shadow-lg" />
              </motion.div>
              <div className="flex-1 min-w-0">
                <h2 className="text-base sm:text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent truncate">
                  KaushalHub
                </h2>
                <p className="text-muted-foreground text-xs sm:text-sm truncate">Naukri Path</p>
              </div>
            </motion.div>
          </SidebarHeader>
          
          {/* Navigation Menu */}
          <SidebarContent className="p-3 sm:p-4">
            <div className="mb-4">
              <p className="px-3 mb-2 text-xs bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent uppercase tracking-wider">
                Main Menu
              </p>
            </div>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                const gradients = [
                  "from-blue-500 to-cyan-500", "from-purple-500 to-pink-500", "from-orange-500 to-red-500",
                  "from-green-500 to-emerald-500", "from-pink-500 to-rose-500", "from-indigo-500 to-purple-500",
                ];
                const gradient = gradients[index % gradients.length];
                
                return (
                  <motion.div key={item.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.03 }}>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        onClick={() => setActiveView(item.id)}
                        isActive={isActive}
                        className="relative group overflow-hidden"
                      >
                        {isActive && (
                          <motion.div layoutId="activeBg" className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-10 rounded-lg`} />
                        )}
                        <div className="flex items-center gap-3 flex-1 relative z-10">
                          <div className={`p-2 sm:p-2.5 rounded-xl transition-all shadow-lg flex-shrink-0 ${
                            isActive ? `bg-gradient-to-br ${gradient} text-white` : "bg-gradient-to-br from-gray-100 to-gray-200"
                          }`}>
                            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                          </div>
                          <span className={`flex-1 transition-all text-sm sm:text-base truncate ${isActive ? 'font-semibold' : ''}`}>
                            {item.label}
                          </span>
                          {item.badge && (
                            <Badge className={`text-xs ${
                              item.badge === "New" || item.badge === "1 Live" ? `bg-gradient-to-r ${gradient} text-white` : "bg-gray-200"
                            }`}>
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </motion.div>
                );
              })}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className="p-3 sm:p-4 border-t mt-auto relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5" />
            <motion.div
              className="relative flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 cursor-pointer transition-all shadow-lg"
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
              style={{
                boxShadow: "0 4px 15px -3px rgba(99, 102, 241, 0.2)"
              }}
            >
              <motion.div
                whileHover={{ rotate: 360, scale: 1.1 }}
                transition={{ duration: 0.5 }}
                className="flex-shrink-0"
              >
                <Avatar className="h-9 w-9 sm:h-11 sm:w-11 shadow-lg ring-2 ring-white">
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white text-xs sm:text-base">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm truncate bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {getUserDisplayName()}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                  {getUserEmail()}
                </p>
              </div>
            </motion.div>
          </SidebarFooter>
        </Sidebar>

        {/* Main Content Area */}
        <SidebarInset className="flex-1 w-full">
          {/* Top Header Bar */}
          <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-purple-100 shadow-lg">
            <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 md:py-4">
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                <SidebarTrigger />
                <Separator orientation="vertical" className="hidden sm:block h-6 bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400" />
                <motion.div key={activeView} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 flex-1 min-w-0">
                  <h2 className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent truncate text-lg sm:text-xl md:text-2xl">
                    {menuItems.find((item) => item.id === activeView)?.label}
                  </h2>
                </motion.div>
              </div>

              {/* Header Right Section */}
              <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
                <Button variant="ghost" size="icon" className="relative rounded-xl h-9 w-9 md:h-10 md:w-10">
                  <Bell className="h-4 w-4 md:h-5 md:w-5" />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 md:h-5 md:w-5 bg-gradient-to-br from-red-500 to-pink-600 text-white text-[10px] md:text-xs rounded-full flex items-center justify-center shadow-lg ring-2 ring-white">
                      {notifications}
                    </span>
                  )}
                </Button>

                <Separator orientation="vertical" className="hidden sm:block h-6 bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400" />

                {/* User Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 px-1 sm:px-2 py-2 rounded-xl hover:bg-gradient-to-br hover:from-blue-100 hover:to-purple-100 transition-all outline-none">
                    <Avatar className="h-8 w-8 sm:h-9 sm:w-9 shadow-lg ring-2 ring-white">
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white text-xs sm:text-sm">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:block text-left">
                      <p className="text-sm bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        {getUserDisplayName()}
                      </p>
                      <p className="text-xs text-muted-foreground">Student</p>
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm">{getUserDisplayName()}</p>
                        <p className="text-xs text-muted-foreground">
                          {getUserEmail()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ID: KH2024-1234
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setActiveView("profile")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={toggleTheme}>
                      {theme === "light" ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
                      <span>Toggle Theme</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>
          
          {/* Main Content Area */}
          <main className="flex-1 p-3 sm:p-4 md:p-6 relative overflow-x-hidden">
            <motion.div key={activeView} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              {renderContent()}
            </motion.div>
          </main>
        </SidebarInset>
      </div>
      <Toaster />
    </SidebarProvider>
  );
}

// Main App Component with AuthProvider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;