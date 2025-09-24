
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, UserRole } from '../types';
import { findStudentById, adminUser } from '../utils/userData';

interface AuthContextType {
  user: User | null;
  login: (role: UserRole, id: string) => boolean;
  logout: () => void;
  updateUser: (updatedData: Partial<Omit<User, 'id' | 'role'>>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  const login = (role: UserRole, id: string): boolean => {
    let userData: User | null = null;

    if (role === UserRole.STUDENT) {
        userData = findStudentById(id);
    } else if (role === UserRole.ADMIN && id === adminUser.id) {
        userData = adminUser;
    }
    
    if (userData) {
        setUser(userData);
        return true;
    }

    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (updatedData: Partial<Omit<User, 'id' | 'role'>>) => {
    if (user) {
        const updatedUser = { ...user, ...updatedData };
        setUser(updatedUser);
    }
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};