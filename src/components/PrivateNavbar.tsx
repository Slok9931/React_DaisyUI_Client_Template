import React from 'react';
import { useAuthStore } from '@/store';
import { Typography } from '@/components';

interface PrivateNavbarProps {
  onToggleSidebar?: () => void;
  sidebarCollapsed?: boolean;
  className?: string;
}

export const PrivateNavbar: React.FC<PrivateNavbarProps> = ({
  onToggleSidebar,
  className = '',
}) => {
  const { user } = useAuthStore();

  return (
    <div className={`navbar bg-base-100 border-b border-base-300 min-h-16 sticky top-0 z-20 ${className}`}>
      {/* Navbar Start */}
      <div className="navbar-start">
        <button
          onClick={onToggleSidebar}
          className="btn btn-ghost btn-square lg:hidden"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Breadcrumb or Page Title */}
        <div className="hidden lg:flex items-center">
          <Typography variant="h5" className="text-base-content">
            Welcome back, {user?.username}!
          </Typography>
        </div>
      </div>

      {/* Navbar Center */}
      <div className="navbar-end">
        {/* Search Bar */}
        <div className="form-control hidden md:flex">
          <div className="input-group">
            <input
              type="text"
              placeholder="Search infinite possibilities..."
              className="input input-bordered input-sm w-64 focus:input-primary"
            />
            <button className="btn btn-square btn-sm">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};