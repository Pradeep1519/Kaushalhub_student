import { createContext, useContext, useState, useEffect } from 'react';

// Backend URLs
const LOCAL_BACKEND = 'http://localhost:8080/api';
const PRODUCTION_BACKEND = 'https://kaushalhubbackend-production-f76b.up.railway.app/api';

// Smart URL selector with auto-detection
const getBackendUrl = async () => {
  const isDevelopment = import.meta.env.MODE === 'development';
  
  console.log('🔧 Environment:', import.meta.env.MODE);
  console.log('🏷️ Is development?', isDevelopment);
  
  // If production mode, always use production backend
  if (!isDevelopment) {
    console.log('🚀 Production mode detected - using Railway');
    return PRODUCTION_BACKEND;
  }
  
  // Development mode: Try local first, fallback to production
  console.log('🔧 Development mode - checking local backend...');
  
  try {
    // Quick check if local backend is running (2 second timeout)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    
    const response = await fetch(`${LOCAL_BACKEND}/health`, {
      method: 'HEAD',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (response.ok) {
      console.log('✅ Local backend is running');
      return LOCAL_BACKEND;
    }
  } catch (error) {
    console.log('❌ Local backend not available');
  }
  
  console.log('🔄 Falling back to Railway backend');
  return PRODUCTION_BACKEND;
};

// Store the promise to avoid multiple checks
let backendUrlPromise: Promise<string>;

const getBackendUrlOnce = () => {
  if (!backendUrlPromise) {
    backendUrlPromise = getBackendUrl();
  }
  return backendUrlPromise;
};

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  enrolledCourses: any[];
  isEnrolled: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [backendUrl, setBackendUrl] = useState<string>('');

  // Initialize backend URL on mount
  useEffect(() => {
    const initBackendUrl = async () => {
      const url = await getBackendUrlOnce();
      setBackendUrl(url);
      console.log('🎯 Backend URL set to:', url);
    };
    
    initBackendUrl();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      setUser(JSON.parse(userData));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('🔐 Login attempt');
    console.log('📧 Email:', email);
    
    // Get backend URL (wait if not initialized)
    let currentUrl = backendUrl;
    if (!currentUrl) {
      console.log('⏳ Getting backend URL...');
      currentUrl = await getBackendUrlOnce();
      setBackendUrl(currentUrl);
    }
    
    console.log('🌐 Using backend:', currentUrl);
    
    try {
      const response = await fetch(`${currentUrl}/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        console.error('❌ HTTP Error:', response.status);
        const errorText = await response.text();
        console.error('❌ Error details:', errorText);
        
        // If local fails, try production as fallback
        if (currentUrl === LOCAL_BACKEND) {
          console.log('🔄 Local failed, trying Railway...');
          return await tryRailwayLogin(email, password);
        }
        
        return false;
      }
      
      const data = await response.json();
      console.log('📦 Response data:', data);
      
      if (data.success) {
        const userWithEnrollment = {
          ...data.user,
          isEnrolled: data.user.isEnrolled || false,
          enrolledCourses: data.user.enrolledCourses || []
        };
        
        setUser(userWithEnrollment);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(userWithEnrollment));
        
        console.log('✅ Login successful!');
        console.log('📍 Backend used:', currentUrl);
        return true;
      }
      
      console.error('❌ API Error:', data.message);
      return false;
      
    } catch (error: any) {
      console.error('🚨 Network Error:', error.message);
      
      // If local fails, try production as fallback
      if (currentUrl === LOCAL_BACKEND) {
        console.log('🔄 Local network error, trying Railway...');
        return await tryRailwayLogin(email, password);
      }
      
      return false;
    }
  };

  // Helper function to try Railway login when local fails
  const tryRailwayLogin = async (email: string, password: string): Promise<boolean> => {
    console.log('🚂 Trying Railway backend...');
    
    try {
      const response = await fetch(`${PRODUCTION_BACKEND}/auth/login`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      console.log('📡 Railway response:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        
        if (data.success) {
          const userWithEnrollment = {
            ...data.user,
            isEnrolled: data.user.isEnrolled || false,
            enrolledCourses: data.user.enrolledCourses || []
          };
          
          setUser(userWithEnrollment);
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(userWithEnrollment));
          
          console.log('✅ Login via Railway successful!');
          setBackendUrl(PRODUCTION_BACKEND); // Update backend URL for future requests
          return true;
        }
      }
      
      console.error('❌ Railway login failed');
      return false;
    } catch (railwayError) {
      console.error('❌ Railway also failed:', railwayError);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};