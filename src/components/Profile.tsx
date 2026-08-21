import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Slider } from "./ui/slider";
import { 
  Mail, Phone, MapPin, Edit, Calendar, Award, Plus, X, Check, 
  BookOpen, GraduationCap, Clock, CreditCard, Building, Users,
  BookMarked, Target, FileText, Trophy
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import { Progress } from "./ui/progress";
import { Skeleton } from "./ui/skeleton";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  studentId: string;
  department: string;
  semester: number;
  joinDate: string;
  location?: string;
  profilePicture?: string;
}

interface Skill {
  _id: string;
  name: string;
  level: number;
}

interface Course {
  _id: string;
  courseCode: string;
  courseName: string;
  instructor: string;
  credits: number;
  semester: string;
  grade?: string;
  status: 'active' | 'completed' | 'dropped';
  progress: number;
}

interface Education {
  _id: string;
  degree: string;
  institution: string;
  duration: string;
  gpa: string;
}

interface Achievement {
  _id: string;
  title: string;
  description: string;
  date: string;
  grade?: string;
}

export function Profile() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Real data states
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    studentId: "",
    department: "",
    semester: 0,
    joinDate: ""
  });

  const [skills, setSkills] = useState<Skill[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [education, setEducation] = useState<Education[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // Fetch real data on component mount
  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    
    try {
      // Fetch complete user profile
      const profileRes = await fetch('http://localhost:5000/api/students/profile', {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!profileRes.ok) {
        throw new Error('Failed to fetch profile');
      }

      const userProfile = await profileRes.json();
      console.log('User Profile:', userProfile);
      
      setProfileData({
        firstName: userProfile.data?.firstName || userProfile.firstName || user?.name?.split(' ')[0] || '',
        lastName: userProfile.data?.lastName || userProfile.lastName || user?.name?.split(' ').slice(1).join(' ') || '',
        email: userProfile.data?.email || userProfile.email || user?.email || '',
        phone: userProfile.data?.phone || userProfile.phone || '',
        bio: userProfile.data?.bio || userProfile.bio || '',
        studentId: userProfile.data?.studentId || userProfile.studentId || 'N/A',
        department: userProfile.data?.department || userProfile.department || 'Not specified',
        semester: userProfile.data?.semester || userProfile.semester || 0,
        joinDate: userProfile.data?.joinDate || userProfile.joinDate || new Date().toISOString(),
        location: userProfile.data?.location || userProfile.location,
        profilePicture: userProfile.data?.profilePicture || userProfile.profilePicture
      });

      // Fetch enrolled courses from user data or API
      const userCourses = user?.enrolledCourses || userProfile.data?.enrolledCourses || userProfile.enrolledCourses || [];
      setCourses(Array.isArray(userCourses) ? userCourses : []);

      // Fetch skills if available
      if (userProfile.data?.skills || userProfile.skills) {
        setSkills(userProfile.data?.skills || userProfile.skills || []);
      } else {
        // Try to fetch skills separately
        try {
          const skillsRes = await fetch('http://localhost:5000/api/students/skills', {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (skillsRes.ok) {
            const skillsData = await skillsRes.json();
            setSkills(skillsData.data || skillsData || []);
          }
        } catch (error) {
          console.log('Skills endpoint not available');
        }
      }

      // Fetch education history
      try {
        const eduRes = await fetch('http://localhost:5000/api/students/education', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (eduRes.ok) {
          const eduData = await eduRes.json();
          setEducation(eduData.data || eduData || []);
        }
      } catch (error) {
        console.log('Education endpoint not available');
      }

      // Fetch achievements
      try {
        const achRes = await fetch('http://localhost:5000/api/students/achievements', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (achRes.ok) {
          const achData = await achRes.json();
          setAchievements(achData.data || achData || []);
        }
      } catch (error) {
        console.log('Achievements endpoint not available');
      }

    } catch (error) {
      console.error("Failed to load data:", error);
      toast.error("Failed to load profile data");
      
      // Fallback to basic user data from auth context
      if (user) {
        setProfileData({
          firstName: user.name?.split(' ')[0] || '',
          lastName: user.name?.split(' ').slice(1).join(' ') || '',
          email: user.email || '',
          phone: '',
          bio: '',
          studentId: 'N/A',
          department: 'Not specified',
          semester: 0,
          joinDate: new Date().toISOString()
        });
        
        setCourses(user.enrolledCourses || []);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch('http://localhost:5000/api/students/profile/update', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phone: profileData.phone,
          bio: profileData.bio
        })
      });

      if (response.ok) {
        setIsEditing(false);
        toast.success("Profile updated successfully!");
        // Refresh user data
        fetchUserData();
      } else {
        throw new Error('Update failed');
      }
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const addSkill = async () => {
    if (newSkill.trim()) {
      const token = localStorage.getItem('token');
      
      try {
        const response = await fetch('http://localhost:5000/api/students/skills', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ name: newSkill.trim(), level: 50 })
        });

        if (response.ok) {
          const newSkillData = await response.json();
          setSkills([...skills, newSkillData]);
          setNewSkill("");
          toast.success("Skill added!");
        }
      } catch (error) {
        console.error("Failed to add skill:", error);
        toast.error("Failed to add skill");
      }
    }
  };

  const removeSkill = async (skillId: string) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`http://localhost:5000/api/students/skills/${skillId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        setSkills(skills.filter(s => s._id !== skillId));
        toast.success("Skill removed");
      }
    } catch (error) {
      console.error("Failed to remove skill:", error);
      toast.error("Failed to remove skill");
    }
  };

  const updateSkillLevel = async (skillId: string, level: number) => {
    const token = localStorage.getItem('token');
    
    try {
      const response = await fetch(`http://localhost:5000/api/students/skills/${skillId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ level })
      });

      if (response.ok) {
        setSkills(skills.map(s => s._id === skillId ? { ...s, level } : s));
      }
    } catch (error) {
      console.error("Failed to update skill:", error);
      toast.error("Failed to update skill");
    }
  };

  // Calculate profile completion percentage
  const calculateProfileCompletion = () => {
    let completion = 0;
    const fields = ['firstName', 'lastName', 'email', 'phone', 'bio'];
    
    fields.forEach(field => {
      if (profileData[field as keyof ProfileData] && String(profileData[field as keyof ProfileData]).trim() !== '') {
        completion += 20;
      }
    });
    
    return Math.min(completion, 100);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    const first = profileData.firstName?.[0] || '';
    const last = profileData.lastName?.[0] || '';
    return (first + last).toUpperCase() || "U";
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="flex flex-col items-center space-y-4">
                <Skeleton className="h-24 w-24 rounded-full" />
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            </Card>
          </div>
          <div className="lg:col-span-2 space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="p-6">
                <Skeleton className="h-6 w-48 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">Please login to view your profile</h2>
        <p className="text-muted-foreground mb-6">You need to be logged in to access your profile information.</p>
        <Button onClick={() => window.location.href = '/login'}>
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
            <p className="text-muted-foreground">Manage your personal information and settings</p>
          </div>
          <Button
            variant={isEditing ? "default" : "outline"}
            onClick={() => setIsEditing(!isEditing)}
            className="gap-2"
          >
            <Edit className="h-4 w-4" />
            {isEditing ? "Done Editing" : "Edit Profile"}
          </Button>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Overview */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <Card className="p-6 lg:col-span-1">
            <div className="flex flex-col items-center text-center space-y-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Avatar className="h-24 w-24 cursor-pointer border-4 border-white shadow-lg">
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 text-white">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </motion.div>
              <div>
                <h3 className="text-xl font-semibold">{profileData.firstName} {profileData.lastName}</h3>
                <p className="text-muted-foreground">Student ID: {profileData.studentId}</p>
              </div>
              <Button 
                variant="outline" 
                className="w-full gap-2"
                onClick={() => toast.info("Upload feature coming soon!")}
              >
                <Edit className="h-4 w-4" />
                Edit Profile Picture
              </Button>
            </div>

            <div className="mt-6 space-y-3">
              <motion.div className="flex items-center gap-3 text-muted-foreground" whileHover={{ x: 5 }}>
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{profileData.email}</span>
              </motion.div>
              <motion.div className="flex items-center gap-3 text-muted-foreground" whileHover={{ x: 5 }}>
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>{profileData.phone || "Not provided"}</span>
              </motion.div>
              <motion.div className="flex items-center gap-3 text-muted-foreground" whileHover={{ x: 5 }}>
                <Building className="h-4 w-4 flex-shrink-0" />
                <span>{profileData.department}</span>
              </motion.div>
              <motion.div className="flex items-center gap-3 text-muted-foreground" whileHover={{ x: 5 }}>
                <GraduationCap className="h-4 w-4 flex-shrink-0" />
                <span>Semester: {profileData.semester || "N/A"}</span>
              </motion.div>
              <motion.div className="flex items-center gap-3 text-muted-foreground" whileHover={{ x: 5 }}>
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span>Joined: {formatDate(profileData.joinDate)}</span>
              </motion.div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground">Profile Completion</span>
                <motion.span 
                  key={isEditing ? "editing" : "view"} 
                  initial={{ scale: 1.2 }} 
                  animate={{ scale: 1 }}
                  className="font-semibold"
                >
                  {calculateProfileCompletion()}%
                </motion.span>
              </div>
              <Progress value={calculateProfileCompletion()} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">
                Complete your profile by adding more information
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Personal Information
                </h3>
                {isEditing && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                    <Badge variant="secondary" className="gap-1">
                      <Edit className="h-3 w-3" />
                      Editing
                    </Badge>
                  </motion.div>
                )}
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Enter your first name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                    disabled={!isEditing}
                    placeholder="Enter your last name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    disabled={true} // Email should not be editable usually
                    className="bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    disabled={!isEditing}
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Bio / About Me</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself, your interests, and your goals..."
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    disabled={!isEditing}
                    rows={4}
                    className="resize-none"
                  />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Enrolled Courses */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Enrolled Courses
                </h3>
                <Badge variant="outline" className="gap-1">
                  <BookMarked className="h-3 w-3" />
                  {courses.length} courses
                </Badge>
              </div>
              
              {courses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="mb-2">No courses enrolled yet</p>
                  <p className="text-sm mb-4">Start your learning journey by enrolling in courses</p>
                  <Button variant="default" onClick={() => window.location.href = '/courses'}>
                    Browse Available Courses
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {courses.map((course, index) => (
                    <motion.div
                      key={course._id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.01 }}
                      className="p-4 border rounded-lg hover:bg-accent/50 transition-colors group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold group-hover:text-primary transition-colors">
                              {course.courseName}
                            </h4>
                            <Badge 
                              variant={
                                course.status === 'completed' ? 'success' :
                                course.status === 'active' ? 'default' :
                                'secondary'
                              }
                              className="text-xs"
                            >
                              {course.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {course.courseCode} • {course.instructor || 'Instructor TBA'}
                          </p>
                          <div className="flex flex-wrap items-center gap-3 text-sm">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {course.credits || 0} Credits
                            </span>
                            <span className="flex items-center gap-1">
                              <CreditCard className="h-3 w-3" />
                              Grade: {course.grade || 'Not graded'}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {course.semester || 'Current'}
                            </span>
                          </div>
                          {course.progress !== undefined && (
                            <div className="mt-3">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span>Progress</span>
                                <span>{course.progress}%</span>
                              </div>
                              <Progress value={course.progress} className="h-2" />
                            </div>
                          )}
                        </div>
                        <Button variant="ghost" size="sm" className="ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                          View Details →
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

          {/* Skills & Proficiency */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Skills & Proficiency
                </h3>
              </div>

              {isEditing && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mb-4 flex gap-2"
                >
                  <Input
                    placeholder="Add new skill (e.g., Python, React, Communication)"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addSkill()}
                    className="flex-1"
                  />
                  <Button onClick={addSkill} size="icon" className="shrink-0">
                    <Plus className="h-4 w-4" />
                  </Button>
                </motion.div>
              )}

              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {skills.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <p>No skills added yet</p>
                      <p className="text-sm mt-1">Add your skills to showcase your abilities</p>
                    </div>
                  ) : (
                    skills.map((skill, index) => (
                      <motion.div
                        key={skill._id || index}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: index * 0.05 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{skill.name}</p>
                            {isEditing && (
                              <motion.button
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => skill._id ? removeSkill(skill._id) : setSkills(skills.filter(s => s.name !== skill.name))}
                                className="text-red-500 hover:text-red-700 transition-colors"
                                aria-label={`Remove ${skill.name} skill`}
                              >
                                <X className="h-4 w-4" />
                              </motion.button>
                            )}
                          </div>
                          <span className="text-muted-foreground font-medium">{skill.level}%</span>
                        </div>
                        {isEditing ? (
                          <Slider
                            value={[skill.level]}
                            onValueChange={([value]) => skill._id ? updateSkillLevel(skill._id, value) : setSkills(skills.map(s => s.name === skill.name ? { ...s, level: value } : s))}
                            max={100}
                            step={5}
                            className="py-2"
                          />
                        ) : (
                          <Progress value={skill.level} className="h-2" />
                        )}
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </Card>
          </motion.div>

          {/* Education */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Education
                </h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="gap-1"
                  onClick={() => toast.info("Add education feature coming soon!")}
                >
                  <Plus className="h-4 w-4" />
                  Add Education
                </Button>
              </div>
              <div className="space-y-4">
                {education.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No education details added</p>
                    <p className="text-sm mt-1">Add your educational background</p>
                  </div>
                ) : (
                  education.map((edu, index) => (
                    <motion.div
                      key={edu._id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.02, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                      className="p-4 border rounded-lg bg-gradient-to-r from-blue-50/50 to-purple-50/50"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{edu.degree}</h4>
                          <p className="text-muted-foreground mb-1">{edu.institution}</p>
                          <p className="text-sm text-muted-foreground">{edu.duration}</p>
                        </div>
                        <Badge variant="secondary" className="ml-2 shrink-0">
                          GPA: {edu.gpa}
                        </Badge>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </Card>
          </motion.div>

          {/* Achievements */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Achievements & Certifications
                </h3>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toast.info("View all achievements feature coming soon!")}
                >
                  View All
                </Button>
              </div>
              <div className="space-y-3">
                {achievements.length === 0 ? (
                  <div className="text-center py-6 text-muted-foreground">
                    <Award className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No achievements added yet</p>
                    <p className="text-sm mt-1">Your achievements will appear here</p>
                  </div>
                ) : (
                  achievements.slice(0, 2).map((achievement, index) => (
                    <motion.div
                      key={achievement._id || index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
                    >
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 }}
                      >
                        <Award className="h-8 w-8 text-yellow-600" />
                      </motion.div>
                      <div className="flex-1">
                        <p className="font-medium">{achievement.title}</p>
                        <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        {achievement.grade && (
                          <p className="text-xs text-muted-foreground mt-1">Grade: {achievement.grade}</p>
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground shrink-0">
                        {formatDate(achievement.date)}
                      </span>
                    </motion.div>
                  ))
                )}
              </div>
            </Card>
          </motion.div>

          {/* Save Button */}
          <AnimatePresence>
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="flex justify-end gap-3 pt-2"
              >
                <Button variant="outline" onClick={() => {
                  setIsEditing(false);
                  fetchUserData(); // Reset to original data
                  toast.info("Changes discarded");
                }}>
                  Cancel
                </Button>
                <Button onClick={handleSave} className="gap-2">
                  <Check className="h-4 w-4" />
                  Save Changes
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}