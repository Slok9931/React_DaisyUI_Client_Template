import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { PrivateRoute, PublicRoute } from "@/routes";
import { PrivateLayout } from "@/layouts";
import {
  AuthPages,
  InfinityDashboardLanding,
  InfinitePage,
  UsersView,
} from "@/views";


export const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<InfinityDashboardLanding />} />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <AuthPages />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <AuthPages />
            </PublicRoute>
          }
        />
        <Route path="/auth" element={<Navigate to="/login" replace />} />
        <Route
          path="/infinity/administration/accessControls/users"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <UsersView />
              </PrivateLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="/infinity/:page/*"
          element={
            <PrivateRoute>
              <PrivateLayout>
                <InfinitePage />
              </PrivateLayout>
            </PrivateRoute>
          }
        />
        <Route
          path="*"
          element={
            <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
                <p className="text-xl text-base-content/70 mb-8">
                  Page not found in the infinite universe
                </p>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="btn btn-primary"
                >
                  Return to <span className="font-courgette">Infinity</span>
                </button>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
};
