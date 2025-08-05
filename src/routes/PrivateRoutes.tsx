import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuthStore } from '@/store';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <div
      className="w-screen h-screen overflow-hidden"
      style={{ maxHeight: '100vh', maxWidth: '100vw', overflow: 'hidden' }}
    >
      {children}
    </div>
  );
};