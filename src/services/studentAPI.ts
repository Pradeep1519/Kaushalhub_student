// Get API Base URL from Vite Env
// Local: http://localhost:8080/api
// Production: https://kaushalhubbackend-production.up.railway.app/api
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// ==========================
// Types (keep as is)
// ==========================

export interface DashboardData {
  studentName: string;
  studentEmail: string;
  studentId: string;
  enrolledCourses: number;
  completedCourses: number;
  overallProgress: number;
  recentEnrollments: any[];
  joinDate: string;
  lastLogin: string;
}

export interface Course {
  _id: string;
  courseId: string;
  courseTitle: string;
  coursePrice: string;
  enrolledDate: string;
  progress: number;
  status: string;
  lastAccessed: string;
}

export interface ProfileData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    joinDate: string;
    lastLogin: string;
  };
  academicInfo: {
    totalEnrollments: number;
    completedCourses: number;
    ongoingCourses: number;
    averageProgress: number;
  };
  contactInfo: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
}

// Helper to get token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

// ==========================
// API FUNCTIONS
// ==========================

export const studentAPI = {
  // Check enrollment status
  checkEnrollment: async (
    email: string
  ): Promise<{ isEnrolled: boolean; enrolledCourses: any[] }> => {
    const response = await fetch(`${API_BASE}/students/check-enrollment`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      throw new Error("Failed to check enrollment status");
    }

    return await response.json();
  },

  // Dashboard Data
  getDashboardData: async (userId: string): Promise<DashboardData> => {
    const response = await fetch(`${API_BASE}/students/dashboard/${userId}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch dashboard data");
    }

    const result = await response.json();
    return result.data;
  },

  // Courses List
  getCourses: async (userId: string): Promise<Course[]> => {
    const response = await fetch(`${API_BASE}/students/courses/${userId}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch courses");
    }

    const result = await response.json();
    return result.data;
  },

  // Profile data
  getProfile: async (userId: string): Promise<ProfileData> => {
    const response = await fetch(`${API_BASE}/students/profile/${userId}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch profile");
    }

    const result = await response.json();
    return result.data;
  },

  // Update course progress
  updateProgress: async (enrollmentId: string, progress: number) => {
    const response = await fetch(
      `${API_BASE}/students/progress/${enrollmentId}`,
      {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ progress }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update progress");
    }

    return await response.json();
  },
};