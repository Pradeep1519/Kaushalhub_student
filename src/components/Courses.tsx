import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Clock, Users, Star, Play, BookOpen, Award, Video, FileText, Search } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Input } from "./ui/input";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { useAuth } from "../contexts/AuthContext";
import { studentAPI } from "../services/studentAPI";

interface Course {
  id: string;
  title: string;
  instructor: string;
  progress: number;
  duration: string;
  students: number;
  rating: number;
  status: "In Progress" | "Completed" | "Not Started";
  category: string;
  image: string;
  modules: number;
  videos: number;
  description: string;
}

export function Courses() {
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const API_BASE = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (user && token) fetchEnrolledCourses();
  }, [user, token]);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const data = await studentAPI.getCourses(user!.id, token!);
      if (data && data.length > 0) {
        setCourses(
          data.map((course: any) => ({
            id: course.courseId || course.id,
            title: course.courseTitle || course.title,
            instructor: course.instructor || "KaushalHub Expert",
            progress: course.progress || 0,
            duration: course.duration || "12 Weeks",
            students: course.students || Math.floor(Math.random() * 2000) + 500,
            rating: course.rating || 4.5 + Math.random() * 0.5,
            status:
              course.progress === 100
                ? "Completed"
                : course.progress > 0
                ? "In Progress"
                : "Not Started",
            category: course.category || "Programming",
            image: course.image || `${API_BASE}/placeholder/300/200`,
            modules: course.modules || 24,
            videos: course.videos || 120,
            description:
              course.description ||
              `${course.courseTitle || course.title} - Complete course with hands-on projects`,
          }))
        );
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error("❌ Error fetching courses:", error);
      toast.error("Failed to load courses");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseAction = async (course: Course) => {
    if (course.progress === 0) {
      toast.success("Course started!", { description: `You've started ${course.title}` });
      await studentAPI.updateProgress(course.id, 10, token!);
      fetchEnrolledCourses();
    } else if (course.progress === 100) {
      toast.info("Opening course review...");
    } else {
      toast.success("Resuming course...");
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "progress" && course.status === "In Progress") ||
      (filter === "completed" && course.status === "Completed") ||
      (filter === "notstarted" && course.status === "Not Started");

    const matchesSearch =
      searchQuery === "" ||
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your courses...</p>
        </div>
      </div>
    );

  if (courses.length === 0)
    return (
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold">My Courses</h1>
            <p className="text-muted-foreground">Track your learning journey</p>
          </div>
          <Button onClick={() => toast.info("https://kaushalhub.com/courses")}>Browse All Courses</Button>
        </motion.div>
        <div className="text-center py-12">
          <div className="text-muted-foreground text-lg mb-4">You haven't enrolled in any courses yet</div>
          <Button onClick={() => toast.info("https://kaushalhub.com/courses")} size="lg">
            Explore Available Courses
          </Button>
        </div>
      </div>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Courses</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}! Continue your learning journey</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
            <span>Total Courses: {courses.length}</span>
            <span>•</span>
            <span>In Progress: {courses.filter((c) => c.status === "In Progress").length}</span>
            <span>•</span>
            <span>Completed: {courses.filter((c) => c.status === "Completed").length}</span>
          </div>
        </div>
        <Button onClick={() => toast.info("Opening course catalog...")}>Browse All Courses</Button>
      </motion.div>

      {/* Search + Filter */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">All ({courses.length})</TabsTrigger>
            <TabsTrigger value="progress">In Progress ({courses.filter((c) => c.status === "In Progress").length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({courses.filter((c) => c.status === "Completed").length})</TabsTrigger>
            <TabsTrigger value="notstarted">Not Started ({courses.filter((c) => c.status === "Not Started").length})</TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Courses Grid */}
      <AnimatePresence mode="wait">
        <motion.div key={filter + searchQuery} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course, index) => (
            <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} whileHover={{ y: -8 }}>
              <Card className="overflow-hidden h-full flex flex-col cursor-pointer hover:shadow-xl transition-shadow border-2 hover:border-primary/20">
                <div className="relative overflow-hidden">
                  <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.3 }}>
                    <ImageWithFallback src={course.image} alt={course.title} className="w-full h-48 object-cover" fallbackSrc={`${API_BASE}/placeholder/300/200`} />
                  </motion.div>
                  <div className="absolute top-4 right-4">
                    <Badge
                      variant={course.status === "Completed" ? "default" : course.status === "In Progress" ? "secondary" : "outline"}
                      className="shadow-lg font-semibold"
                    >
                      {course.status}
                    </Badge>
                  </div>
                  {course.progress > 0 && course.progress < 100 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3 text-center text-white text-sm font-medium">
                      {course.progress}% Complete
                    </div>
                  )}
                </div>
                <div className="p-6 space-y-4 flex-1 flex flex-col">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {course.category}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{course.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold line-clamp-2">{course.title}</h3>
                    <p className="text-muted-foreground text-sm">by {course.instructor}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Your Progress</span>
                      <motion.span key={course.progress} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="font-semibold text-primary">
                        {course.progress}%
                      </motion.span>
                    </div>
                    <Progress value={course.progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between text-muted-foreground text-sm">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span>{course.students.toLocaleString()}+ students</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-auto pt-2">
                    <Button className="flex-1" variant={course.progress === 0 ? "default" : "outline"} onClick={() => handleCourseAction(course)} size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      {course.progress === 0 ? "Start Learning" : course.progress === 100 ? "Review Course" : "Continue"}
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setSelectedCourse(course)} title="View Details">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Course Dialog */}
      <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedCourse?.title}</DialogTitle>
            <DialogDescription>Course details and curriculum</DialogDescription>
          </DialogHeader>
          {selectedCourse && (
            <div className="space-y-6">
              <div className="relative">
                <ImageWithFallback src={selectedCourse.image} alt={selectedCourse.title} className="w-full h-64 object-cover rounded-lg" fallbackSrc={`${API_BASE}/placeholder/300/200`} />
                <div className="absolute top-4 right-4">
                  <Badge
                    variant={selectedCourse.status === "Completed" ? "default" : selectedCourse.status === "In Progress" ? "secondary" : "outline"}
                    className="text-sm font-semibold"
                  >
                    {selectedCourse.status}
                  </Badge>
                </div>
              </div>

              <p className="text-muted-foreground mb-4 text-lg leading-relaxed">{selectedCourse.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <BookOpen className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-muted-foreground text-sm">Modules</p>
                    <p className="font-semibold">{selectedCourse.modules} modules</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Video className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-muted-foreground text-sm">Videos</p>
                    <p className="font-semibold">{selectedCourse.videos} lectures</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Clock className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-muted-foreground text-sm">Duration</p>
                    <p className="font-semibold">{selectedCourse.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Award className="h-6 w-6 text-primary" />
                  <div>
                    <p className="text-muted-foreground text-sm">Certificate</p>
                    <p className="font-semibold">Included</p>
                  </div>
                </div>
              </div>

              {/* Progress */}
              <div className="bg-primary/5 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Your Progress</span>
                  <span className="text-primary font-bold">{selectedCourse.progress}%</span>
                </div>
                <Progress value={selectedCourse.progress} className="h-3" />
                <p className="text-sm text-muted-foreground mt-2">
                  {selectedCourse.progress === 0
                    ? "Start your learning journey today!"
                    : selectedCourse.progress === 100
                    ? "Congratulations! You've completed this course."
                    : "Great progress! Keep going to complete the course."}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button className="flex-1" onClick={() => { handleCourseAction(selectedCourse); setSelectedCourse(null); }} size="lg">
                  <Play className="h-5 w-5 mr-2" />
                  {selectedCourse.progress === 0 ? "Start Learning" : "Continue Learning"}
                </Button>
                <Button variant="outline" onClick={() => setSelectedCourse(null)} size="lg">
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
