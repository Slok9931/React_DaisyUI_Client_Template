import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { InfinityLogo, Typography, Tooltip, useToast } from '@/components';

interface SidebarItem {
  id: string;
  label?: string;
  href?: string;
  onClick?: () => void;
  icon: React.ReactNode;
  children?: SidebarItem[];
  badge?: string | number;
  active?: boolean;
}

interface SidebarProps {
  items?: SidebarItem[];
  className?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  authLogout?: boolean;
  side?: 'left' | 'right';
  isOpen?: boolean;
  onClose?: () => void;
  showHeader?: boolean;
  showToggle?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  items = defaultSidebarItems,
  className = '',
  collapsed = false,
  authLogout = false,
  side = 'left',
  onClose,
  showHeader = true,
  showToggle = true,
  onToggleCollapse,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { addToast } = useToast();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      addToast({ message: 'Logged out successfully', variant: 'info' });
    } catch (error) {
      addToast({ message: 'Logout failed', variant: 'error' });
    }
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (href?: string, active?: boolean) => {
    if (active !== undefined) return active;
    if (!href) return false;
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  const renderSidebarItem = (item: SidebarItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const itemIsActive = isActive(item.href, item.active);

    return (
      <div key={item.id}>
        <Tooltip tip={item.label ?? ''} position={side === 'right' ? 'left' : 'right'}>
          <div
            className={`
              flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all duration-200
              ${itemIsActive ? 'bg-primary text-primary-content' : 'hover:bg-base-200'}
              ${level > 0 ? 'ml-4' : ''}
            `}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (hasChildren && !collapsed) {
                toggleExpanded(item.id);
                addToast({ message: `${item.label} expanded`, variant: 'info' });
              } else if (item.href) {
                navigate(item.href);
                addToast({ message: `Navigated to ${item.label}`, variant: 'info' });
              } else {
                item.onClick?.();
                addToast({ message: `${item.label} clicked`, variant: 'info' });
              }
            }}
          >
            <div className="flex items-center gap-3">
              <span className={`${collapsed && level === 0 ? 'text-lg' : 'text-base'}`}>
                {item.icon}
              </span>
              {!collapsed && (
                <Typography variant="body2" className="font-medium">
                  {item.label}
                </Typography>
              )}
            </div>
            
            {!collapsed && (
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="badge badge-primary badge-sm">
                    {item.badge}
                  </span>
                )}
                {hasChildren && (
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                )}
              </div>
            )}
          </div>
        </Tooltip>
        {/* Children */}
        {hasChildren && isExpanded && !collapsed && (
          <div className="ml-2 mt-1 space-y-1">
            {item.children!.map(child => renderSidebarItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  const sidebarContent = (
    <div className={`h-full bg-base-100 border-base-300 transition-all duration-300 ease-in-out flex flex-col ${
      side === 'right' ? 'border-l' : 'border-r'
    } ${collapsed ? 'w-16' : 'w-64'} ${className}`}>
      {/* Sidebar Header */}
      {showHeader && (
        <div className="p-4 border-b border-base-300 flex-shrink-0">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <div className="flex items-center gap-2">
                <InfinityLogo size={24} />
                <Typography variant="h6" className="font-bold infinity-brand">
                  Infinity
                </Typography>
              </div>
            )}
            
            {showToggle && onToggleCollapse && (
              <Tooltip tip={collapsed ? "Expand Sidebar" : "Collapse Sidebar"} position={side === 'right' ? 'left' : 'right'}>
                <button
                  onClick={() => {
                    onToggleCollapse();
                    addToast({ message: collapsed ? 'Sidebar expanded' : 'Sidebar collapsed', variant: 'info' });
                  }}
                  className="btn btn-ghost btn-sm btn-square transition-transform duration-200 hover:scale-110 cursor-pointer"
                >
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      collapsed ? (side === 'right' ? 'rotate-180' : '') : (side === 'right' ? '' : 'rotate-180')
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                </button>
              </Tooltip>
            )}

            {onClose && (
              <Tooltip tip="Close Sidebar" position={side === 'right' ? 'left' : 'right'}>
                <button
                  onClick={onClose}
                  className="btn btn-ghost btn-sm btn-circle transition-transform duration-200 hover:scale-110 cursor-pointer"
                >
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </Tooltip>
            )}
          </div>
        </div>
      )}

      {/* Sidebar Content */}
      <div className="p-2 space-y-1 overflow-y-auto flex-1">
        {items.map(item => renderSidebarItem(item))}
      </div>

      {/* Sidebar Footer */}
      {authLogout && (
        <div className="p-2 border-t border-base-300 flex-shrink-0">
          <Tooltip tip="Logout" position={side === 'right' ? 'left' : 'right'}>
            <div
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-error hover:text-error-content transition-all duration-200"
              style={{ cursor: 'pointer' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {!collapsed && (
                <Typography variant="body2" className="font-medium">
                  Logout
                </Typography>
              )}
            </div>
          </Tooltip>
        </div>
      )}
    </div>
  );

  return sidebarContent;
};

// Default sidebar items
const defaultSidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v14l-5-3-5 3V5z" />
      </svg>
    ),
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/analytics',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    badge: 'New',
  },
  {
    id: 'users',
    label: 'Users',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    children: [
      {
        id: 'users-list',
        label: 'All Users',
        href: '/users',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        ),
      },
      {
        id: 'users-roles',
        label: 'Roles & Permissions',
        href: '/users/roles',
        icon: (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        ),
      },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];