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
  login: (email: string, password: string) => Promise<boolean>;
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

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiRequest(AUTH_ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (response.success) {
        setToken(response.data.token);
        setUser(response.data.user);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('super_token');
    localStorage.removeItem('user');
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