import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { InfinityLogo, Typography, Tooltip, useToast } from '@/components';
import {
  LayoutDashboard,
  BarChart2,
  Users,
  UserCircle2,
  ShieldCheck,
  Settings as LucideSettings,
  LogOut,
  ChevronRight,
  ChevronLeft,
} from 'lucide-react';

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
  activeTab?: string;
  setActiveTab?: (id: string) => void;
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
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { addToast } = useToast();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string | undefined>(
    items.find(item => !item.children)?.id
  );

  useEffect(() => {
    if (activeTab) {
      localStorage.setItem('activeTab', activeTab);
    }
  }, [activeTab]);
  
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

  const handleSidebarItemClick = (item: SidebarItem) => {
    const hasChildren = item.children && item.children.length > 0;
    if (collapsed) {
      if (hasChildren) {
        onToggleCollapse?.();
        setTimeout(() => toggleExpanded(item.id), 300);
      } else {
        setActiveTab(item.id);
        localStorage.setItem('pageName', `${item.label}`)
        if (item.href) {
          navigate(item.href);
          addToast({ message: `Navigated to ${item.label}`, variant: 'info' });
        } else {
          item.onClick?.();
          addToast({ message: `${item.label} clicked`, variant: 'info' });
        }
      }
    } else {
      if (hasChildren) {
        toggleExpanded(item.id);
      } else {
        setActiveTab(item.id);
        localStorage.setItem('pageName', `${item.label}`)
        if (item.href) {
          navigate(item.href);
          addToast({ message: `Navigated to ${item.label}`, variant: 'info' });
        } else {
          item.onClick?.();
          addToast({ message: `${item.label} clicked`, variant: 'info' });
        }
      }
    }
  };

  const isActive = (item: SidebarItem) => {
    return activeTab === item.id;
  };

  const renderSidebarItem = (item: SidebarItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const itemIsActive = isActive(item);

    return (
      <div key={item.id} className="w-full">
        <Tooltip tip={item.label ?? ''} position={side === 'right' ? 'left' : 'right'}>
          <div
            className={`
              flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all duration-200
              ${!collapsed ? 'w-56': 'w-full'}
              ${itemIsActive ? 'bg-primary text-primary-content' : 'hover:bg-base-200'}
              ${level > 0 ? 'ml-4' : ''}
            `}
            style={{ cursor: 'pointer' }}
            onClick={() => handleSidebarItemClick(item)}
          >
            <div className="flex items-center gap-3 w-full">
              <span className={`${collapsed && level === 0 ? 'text-lg' : 'text-base'}`}>
                {item.icon}
              </span>
              {!collapsed && (
                <Typography variant="body2" className="font-medium w-full truncate">
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
                  <ChevronRight
                    className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                  />
                )}
              </div>
            )}
          </div>
        </Tooltip>
        {hasChildren && isExpanded && !collapsed && (
          <div className="ml-2 mt-1 space-y-1 w-full">
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
      {showHeader && (
        <div className="p-4 pb-[18px] border-b mb-2 border-base-300 flex-shrink-0 w-full">
          <div className="flex items-center justify-between w-full">
            {collapsed ? (
              <div
                className="flex items-center justify-center w-full cursor-pointer"
                onClick={onToggleCollapse}
              >
                <InfinityLogo size={48} />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <InfinityLogo size={48} />
                <Typography variant="h3" className="font-bold infinity-brand font-courgette">
                  Infinity
                </Typography>
              </div>
            )}

            {!collapsed && showToggle && onToggleCollapse && (
              <Tooltip tip="Close" position={side === 'right' ? 'left' : 'right'}>
                <button
                  onClick={onToggleCollapse}
                  className="btn btn-ghost btn-sm btn-square transition-transform duration-200 hover:scale-110 cursor-pointer"
                >
                  {side === 'right' ? (
                    <ChevronRight className="w-4 h-4" />
                  ) : (
                    <ChevronLeft className="w-4 h-4" />
                  )}
                </button>
              </Tooltip>
            )}

            {onClose && (
              <Tooltip tip="Close Sidebar" position={side === 'right' ? 'left' : 'right'}>
                <button
                  onClick={onClose}
                  className="btn btn-ghost btn-sm btn-circle transition-transform duration-200 hover:scale-110 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </Tooltip>
            )}
          </div>
        </div>
      )}

      <div className="p-2 space-y-1 overflow-y-auto flex-1">
        {items.map(item => renderSidebarItem(item))}
      </div>

      {authLogout && (
        <div className="p-2 border-t border-base-300 flex-shrink-0 w-full">
          <Tooltip tip="Logout" position={side === 'right' ? 'left' : 'right'}>
            <div
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-error hover:text-error-content transition-all duration-200"
              style={{ cursor: 'pointer' }}
            >
              <LogOut className="w-5 h-5" />
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

// Default sidebar items with lucide-react icons
const defaultSidebarItems: SidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/analytics',
    icon: <BarChart2 className="w-5 h-5" />,
    badge: 'New',
  },
  {
    id: 'users',
    label: 'Users',
    icon: <Users className="w-5 h-5" />,
    children: [
      {
        id: 'users-list',
        label: 'All Users',
        href: '/users',
        icon: <UserCircle2 className="w-4 h-4" />,
      },
      {
        id: 'users-roles',
        label: 'Roles & Permissions',
        href: '/users/roles',
        icon: <ShieldCheck className="w-4 h-4" />,
      },
    ],
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/dashboard/settings',
    icon: <LucideSettings className="w-5 h-5" />,
  },
];