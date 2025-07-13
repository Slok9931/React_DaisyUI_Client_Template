import React from 'react';
import { Navigate } from 'react-router-dom';

import { useAuthStore } from '@/store';
import { FullPageLoader } from '@/components';

interface PublicRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ 
  children, 
  redirectTo = '/' 
}) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <FullPageLoader text="Checking Infinity credentials..." />
    );
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};