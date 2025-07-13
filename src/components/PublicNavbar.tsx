import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuthStore } from '@/store';
import { Avatar, Button, Typography, InfinityLogo, SettingsButton } from '@/components';

interface NavItem {
  label: string;
  href?: string;
  onClick?: () => void;
  children?: NavItem[];
  icon?: React.ReactNode;
}

interface NavbarProps {
  title?: string;
  logo?: React.ReactNode;
  items?: NavItem[];
  className?: string;
}

export const PublicNavbar: React.FC<NavbarProps> = ({
  title = 'Infinity',
  logo,
  items = [],
  className = '',
}) => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const renderNavItem = (item: NavItem, index: number) => {
    // Handle dropdown items
    if (item.children && item.children.length > 0) {
      return (
        <div key={index} className="dropdown dropdown-end">
          <div tabIndex={0} role="button" className="btn btn-ghost">
            {item.icon && <span className="mr-2">{item.icon}</span>}
            <Typography variant="body2">{item.label}</Typography>
            <svg
              className="fill-current ml-1 w-4 h-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            {item.children.map((child, childIndex) => (
              <li key={childIndex}>
                {child.href ? (
                  <Link to={child.href} onClick={() => setIsMobileMenuOpen(false)}>
                    {child.icon && <span className="mr-2">{child.icon}</span>}
                    <Typography variant="body2">{child.label}</Typography>
                  </Link>
                ) : (
                  <a onClick={() => {
                    child.onClick?.();
                    setIsMobileMenuOpen(false);
                  }}>
                    {child.icon && <span className="mr-2">{child.icon}</span>}
                    <Typography variant="body2">{child.label}</Typography>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      );
    }

    return (
      <div key={index}>
        {item.href ? (
          <Link 
            to={item.href} 
            className="btn btn-ghost"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            <Typography variant="body2">{item.label}</Typography>
          </Link>
        ) : (
          <button 
            className="btn btn-ghost"
            onClick={() => {
              item.onClick?.();
              setIsMobileMenuOpen(false);
            }}
          >
            {item.icon && <span className="mr-2">{item.icon}</span>}
            <Typography variant="body2">{item.label}</Typography>
          </button>
        )}
      </div>
    );
  };

  const userMenuItems = [
    {
      label: 'Profile',
      href: '/profile',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      )
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      label: 'Logout',
      onClick: handleLogout,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      )
    }
  ];

  return (
    <div className={`navbar bg-base-100 border-b border-base-300 min-h-16 sticky top-0 z-40 ${className}`}>
      {/* Navbar Start */}
      <div className="navbar-start">
        {/* Mobile Menu Button */}
        <div className="dropdown">
          <div 
            tabIndex={0} 
            role="button" 
            className="btn btn-ghost lg:hidden"
            onClick={toggleMobileMenu}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          {isMobileMenuOpen && (
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              {items.map((item, index) => (
                <li key={index}>
                  {item.href ? (
                    <Link to={item.href} onClick={() => setIsMobileMenuOpen(false)}>
                      {item.icon && <span className="mr-2">{item.icon}</span>}
                      <Typography variant="body2">{item.label}</Typography>
                    </Link>
                  ) : (
                    <a onClick={() => {
                      item.onClick?.();
                      setIsMobileMenuOpen(false);
                    }}>
                      {item.icon && <span className="mr-2">{item.icon}</span>}
                      <Typography variant="body2">{item.label}</Typography>
                    </a>
                  )}
                  {item.children && (
                    <ul className="p-2">
                      {item.children.map((child, childIndex) => (
                        <li key={childIndex}>
                          {child.href ? (
                            <Link to={child.href} onClick={() => setIsMobileMenuOpen(false)}>
                              {child.icon && <span className="mr-2">{child.icon}</span>}
                              <Typography variant="body2">{child.label}</Typography>
                            </Link>
                          ) : (
                            <a onClick={() => {
                              child.onClick?.();
                              setIsMobileMenuOpen(false);
                            }}>
                              {child.icon && <span className="mr-2">{child.icon}</span>}
                              <Typography variant="body2">{child.label}</Typography>
                            </a>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Logo and Title */}
        <Link to="/" className="btn btn-ghost text-xl">
          {logo ? (
            <span className="mr-2">{logo}</span>
          ) : (
            <InfinityLogo size={32} className="mr-2" />
          )}
          <Typography variant="h5" className="infinity-brand">
            {title}
          </Typography>
        </Link>
      </div>

      {/* Navbar Center - Desktop Menu */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          {items.map((item, index) => (
            <li key={index}>
              {renderNavItem(item, index)}
            </li>
          ))}
        </ul>
      </div>

      {/* Navbar End */}
      <div className="navbar-end">
        {/* Settings Button */}
        <div className="mr-2">
          <SettingsButton />
        </div>

        {/* User Menu or Login Button */}
        {isAuthenticated && user ? (
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <Avatar
                src={user?.avatar}
                alt={user.username}
                placeholder={user.username}
                size="sm"
              />
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li className="menu-title">
                <Typography variant="body2">
                  {user.first_name && user.last_name 
                    ? `${user.first_name} ${user.last_name}`
                    : user.username
                  }
                </Typography>
                <Typography variant="caption" className="opacity-60">
                  {user.email}
                </Typography>
              </li>
              <li><div className="divider my-0"></div></li>
              {userMenuItems.map((item, index) => (
                <li key={index}>
                  {item.href ? (
                    <Link to={item.href} className="flex items-center">
                      {item.icon}
                      <Typography variant="body2">{item.label}</Typography>
                    </Link>
                  ) : (
                    <a onClick={item.onClick} className="flex items-center">
                      {item.icon}
                      <Typography variant="body2">{item.label}</Typography>
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/login')}
            >
              Login
            </Button>
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => navigate('/register')}
            >
              Sign Up
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};