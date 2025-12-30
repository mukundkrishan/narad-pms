// API configuration and handlers
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';
export const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  SUPER_LOGIN: `${API_BASE_URL}/super/login`,
  LOGOUT: `${API_BASE_URL}/auth/logout`,
  REFRESH: `${API_BASE_URL}/auth/refresh`,
  ME: `${API_BASE_URL}/auth/me`,
};

// Dashboard endpoints
export const DASHBOARD_ENDPOINTS = {
  SUPER_ADMIN_STATS: `${API_BASE_URL}/dashboard/super-admin`,
  ADMIN_STATS: `${API_BASE_URL}/dashboard/admin`,
};

// Organization endpoints
export const ORGANIZATION_ENDPOINTS = {
  LIST: `${API_BASE_URL}/organizations`,
  CREATE: `${API_BASE_URL}/organizations`,
  SHOW: (id: number) => `${API_BASE_URL}/organizations/${id}`,
  UPDATE: (id: number) => `${API_BASE_URL}/organizations/${id}`,
  DELETE: (id: number) => `${API_BASE_URL}/organizations/${id}`,
};

// Settings endpoints
export const SETTINGS_ENDPOINTS = {
  LIST: `${API_BASE_URL}/settings`,
  STORE: `${API_BASE_URL}/settings`,
  SHOW: (key: string) => `${API_BASE_URL}/settings/${key}`,
  DELETE: (key: string) => `${API_BASE_URL}/settings/${key}`,
};

// API helper function with improved error handling
export const apiRequest = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token') || localStorage.getItem('super_token');
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('super_token');
      window.location.href = '/login';
      throw new Error('Unauthorized - redirecting to login');
    }
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Standardized response format
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
  pagination?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}