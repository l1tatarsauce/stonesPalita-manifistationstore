import React, { createContext, useContext, useState } from 'react';

export interface UserProfile {
  name: string;
  email: string;
  avatarUri: string;
  phone: string;
  address: string;
}

interface AuthContextType {
  isAdmin: boolean;
  userProfile: UserProfile;
  login: (role?: 'admin' | 'user') => void; // 🔑 เพิ่มlogin ใน Interface
  logout: () => void;
  updateUserProfile: (updatedData: Partial<UserProfile>) => void;
  toggleRole: () => void;
}

const DEFAULT_PROFILE: UserProfile = {
  name: 'Customer User',
  email: 'customer@example.com',
  avatarUri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
  phone: '0812345678',
  address: '123 Main Street',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // โหลดสิทธิ์เริ่มต้นจาก localStorage
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedRole = localStorage.getItem('user_role');
      return savedRole === 'admin';
    }
    return false;
  });

  // โหลดโปรไฟล์ถาวรจาก localStorage
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedProfile = localStorage.getItem('user_profile_data');
      if (savedProfile) {
        try {
          return JSON.parse(savedProfile);
        } catch (e) {
          console.error('Failed to parse saved profile:', e);
        }
      }
    }
    return DEFAULT_PROFILE;
  });

  // 🔑 ฟังก์ชัน Login เพื่อสลับบทบาทตามที่ผู้ใช้กดเลือกจากหน้า Login
  const login = (role?: 'admin' | 'user') => {
    const isUserAdmin = role === 'admin';
    setIsAdmin(isUserAdmin);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('user_role', isUserAdmin ? 'admin' : 'user');
    }
  };

  const logout = () => {
    setIsAdmin(false);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('user_role');
    }
  };

  const updateUserProfile = (updatedData: Partial<UserProfile>) => {
    setUserProfile((prev) => {
      const newProfile = { ...prev, ...updatedData };
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('user_profile_data', JSON.stringify(newProfile));
      }
      return newProfile;
    });
  };

  const toggleRole = () => {
    setIsAdmin((prev) => {
      const nextRole = !prev;
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem('user_role', nextRole ? 'admin' : 'user');
      }
      return nextRole;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        isAdmin,
        userProfile,
        login,
        logout,
        updateUserProfile,
        toggleRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};