import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuthStore } from '@/store';
import { FullPageLoader } from '@/components';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();
  const location = useLocation();

  if (isLoading) {
    return (
      <FullPageLoader text="Authenticating with Infinity..." />
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};