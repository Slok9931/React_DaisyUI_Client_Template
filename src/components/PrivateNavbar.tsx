import React from 'react';
import { useAuthStore } from '@/store';
import { ThemeSelector, Avatar, Typography } from '@/components';

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
    <div className={`navbar bg-base-100 border-b border-base-300 min-h-16 ${className}`}>
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
            Welcome back, {user?.first_name || user?.username}!
          </Typography>
        </div>
      </div>

      {/* Navbar Center */}
      <div className="navbar-center">
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

      {/* Navbar End */}
      <div className="navbar-end">
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle btn-sm">
              <div className="indicator">
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
                    d="M15 17h5l-5 5v-5zM10.97 4.97a.75.75 0 0 0-1.08 1.05l-3.99 4.99a.75.75 0 0 0 1.08.02L10.97 6.04a.75.75 0 0 0 0-1.07zM15.5 7.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"
                  />
                </svg>
                <span className="badge badge-primary badge-xs indicator-item">3</span>
              </div>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-80"
            >
              <li className="menu-title">
                <Typography variant="body2">Notifications</Typography>
              </li>
              <li>
                <a className="flex flex-col items-start gap-1">
                  <Typography variant="body2" className="font-medium">
                    New user registered
                  </Typography>
                  <Typography variant="caption" className="text-base-content/60">
                    2 minutes ago
                  </Typography>
                </a>
              </li>
              <li>
                <a className="flex flex-col items-start gap-1">
                  <Typography variant="body2" className="font-medium">
                    System update available
                  </Typography>
                  <Typography variant="caption" className="text-base-content/60">
                    1 hour ago
                  </Typography>
                </a>
              </li>
              <li>
                <a className="flex flex-col items-start gap-1">
                  <Typography variant="body2" className="font-medium">
                    Backup completed
                  </Typography>
                  <Typography variant="caption" className="text-base-content/60">
                    3 hours ago
                  </Typography>
                </a>
              </li>
            </ul>
          </div>

          {/* Theme Selector */}
          <ThemeSelector />

          {/* User Avatar */}
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <Avatar
                src={user?.avatar}
                alt={user?.username}
                placeholder={user?.username}
                size="sm"
              />
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li className="menu-title">
                <Typography variant="body2">
                  {user?.first_name && user?.last_name 
                    ? `${user.first_name} ${user.last_name}`
                    : user?.username
                  }
                </Typography>
                <Typography variant="caption" className="opacity-60">
                  {user?.email}
                </Typography>
              </li>
              <li><div className="divider my-0"></div></li>
              <li>
                <a href="/profile" className="flex items-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <Typography variant="body2">Profile</Typography>
                </a>
              </li>
              <li>
                <a href="/settings" className="flex items-center">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <Typography variant="body2">Settings</Typography>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};