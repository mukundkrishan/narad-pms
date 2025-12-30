import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiRequest, AUTH_ENDPOINTS } from '../api';

interface User {
  id: number;
  name: string;
  email: string;
  user_type: string;
  corporate_id?: number;
  permissions?: string[];
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('token') || localStorage.getItem('super_token')
  );

  useEffect(() => {
    if (token && !user) {
      fetchUser();
    }
  }, [token, user]);

  const fetchUser = async () => {
    try {
      const response = await apiRequest(AUTH_ENDPOINTS.ME);
      if (response.success) {
        setUser(response.data.user);
      }
    } catch (error) {
      logout();
    }
  };

  const login = (userData: User, userToken: string) => {
    setToken(userToken);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('super_token');
    localStorage.removeItem('user');
    localStorage.removeItem('corporate');
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.user_type === 'super_admin') return true;
    return user.permissions?.includes(permission) || false;
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      login,
      logout,
      isAuthenticated: !!user,
      hasPermission,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};