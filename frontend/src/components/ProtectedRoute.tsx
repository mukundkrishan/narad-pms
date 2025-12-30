import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  permission?: string;
  userType?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  permission, 
  userType 
}) => {
  const token = localStorage.getItem('token') || localStorage.getItem('super_token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  console.log('ProtectedRoute Debug:', { token: !!token, user, userType });

  if (!token || !user) {
    return <Navigate to="/super/login" replace />;
  }

  if (userType && user?.user_type !== userType) {
    console.log('User type mismatch:', user?.user_type, 'expected:', userType);
    return <Navigate to="/super/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;