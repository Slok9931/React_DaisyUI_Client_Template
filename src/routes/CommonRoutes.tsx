import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { PrivateRoute, PublicRoute } from '@/routes';
import { PublicLayout, PrivateLayout } from '@/layouts';
import { ThemeDemo, Login, Register } from '@/views';

export const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes with public layout */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <PublicLayout>
                <Login />
              </PublicLayout>
            </PublicRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <PublicRoute>
              <PublicLayout>
                <Register />
              </PublicLayout>
            </PublicRoute>
          } 
        />
        
        {/* Private routes with private layout (sidebar + navbar) */}
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <PrivateLayout>
                <ThemeDemo />
              </PrivateLayout>
            </PrivateRoute>
          } 
        />
        
        {/* 404 */}
        <Route 
          path="*" 
          element={
            <PublicLayout>
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-error mb-4">404</h1>
                  <p className="text-xl mb-4">Page not found in the infinite universe</p>
                  <button 
                    onClick={() => window.location.href = '/'}
                    className="btn btn-primary"
                  >
                    Return to Infinity
                  </button>
                </div>
              </div>
            </PublicLayout>
          } 
        />
      </Routes>
    </Router>
  );
};