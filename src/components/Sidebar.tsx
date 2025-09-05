import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store';
import { InfinityLogo, Typography, Tooltip, useToast, Loading } from '@/components';
import { useSidebar } from '@/hooks';
import { SidebarModule, SidebarRoute } from '@/types';
import { getIconComponent } from '@/utils';

interface SidebarItem {
  id: string;
  label: string;
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

const convertRouteToSidebarItem = (route: SidebarRoute): SidebarItem => {
  return {
    id: route.id.toString(),
    label: route.label,
    href: route.route,
    icon: getIconComponent(route.icon, 20),
    children: route.children?.map(convertRouteToSidebarItem),
  };
};

const convertModuleToSidebarItem = (module: SidebarModule): SidebarItem => {
  return {
    id: module.id.toString(),
    label: module.label,
    href: module.routes.length === 0 ? module.route : undefined,
    icon: getIconComponent(module.icon, 20),
    children: module.routes?.map(convertRouteToSidebarItem),
  };
};

export const Sidebar: React.FC<SidebarProps> = ({
  items,
  className = '',
  collapsed = false,
  authLogout = false,
  side = 'left',
  onClose,
  showHeader = true,
  showToggle = true,
  onToggleCollapse,
  activeTab: controlledActiveTab,
  setActiveTab: controlledSetActiveTab,
}) => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const { addToast } = useToast();
  const { sidebarData, loading, error } = useSidebar();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [uncontrolledActiveTab, setUncontrolledActiveTab] = useState<string | undefined>(
    () => localStorage.getItem('activeTab') || "Dashboard"
  );
  const [hasExpanded, setHasExpanded] = useState(false);

  const activeTab = controlledActiveTab !== undefined ? controlledActiveTab : uncontrolledActiveTab;
  const setActiveTab = controlledSetActiveTab !== undefined ? controlledSetActiveTab : setUncontrolledActiveTab;

  const backendSidebarItems: SidebarItem[] = sidebarData.map(convertModuleToSidebarItem);
  
  const sidebarItems = backendSidebarItems.length > 0 ? backendSidebarItems : (items || []);

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
        setActiveTab(item.label);
        localStorage.setItem('pageName', `${item.label}`)
        if (item.href) {
          setActiveTab(item.label);
          navigate(item.href);
          addToast({ message: `Navigated to ${item.label}`, variant: 'info' });
        } else {
          item.onClick?.();
          setActiveTab(item.label);
          addToast({ message: `${item.label} clicked`, variant: 'info' });
        }
      }
    } else {
      if (hasChildren) {
        toggleExpanded(item.id);
      } else {
        setActiveTab(item.label);
        localStorage.setItem('pageName', `${item.label}`)
        if (item.href) {
          setActiveTab(item.label);
          navigate(item.href);
          addToast({ message: `Navigated to ${item.label}`, variant: 'info' });
        } else {
          item.onClick?.();
          setActiveTab(item.label);
          addToast({ message: `${item.label} clicked`, variant: 'info' });
        }
      }
    }
  };

  const isActive = (item: SidebarItem) => {
    return activeTab === item.label;
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
                  getIconComponent("ChevronRight", 16, `w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`)
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
                    getIconComponent("ChevronRight", 16, "w-4 h-4")
                  ) : (
                    getIconComponent("ChevronLeft", 16, "w-4 h-4")
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
                  {getIconComponent("ChevronLeft", 16, "w-4 h-4")}
                </button>
              </Tooltip>
            )}
          </div>
        </div>
      )}

      <div className="p-2 space-y-1 overflow-y-auto flex-1">
        {loading ? (
          <div className="flex items-center justify-center p-4">
            <Loading />
          </div>
        ) : error ? (
          <div className="p-4 text-center text-error">
            <Typography variant="body2">Failed to load menu</Typography>
          </div>
        ) : (
          sidebarItems.map(item => renderSidebarItem(item))
        )}
      </div>

      {authLogout && (
        <div className="p-2 border-t border-base-300 flex-shrink-0 w-full">
          <Tooltip tip="Logout" position={side === 'right' ? 'left' : 'right'}>
            <div
              onClick={handleLogout}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer hover:bg-error hover:text-error-content transition-all duration-200
              ${!collapsed ? 'w-56': 'w-full'}`}
              style={{ cursor: 'pointer' }}
            >
              {getIconComponent("LogOut", 16, "w-5 h-5")}
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

  const findAncestorIds = (items: SidebarItem[], targetLabel: string, path: string[] = []): string[] | null => {
    for (const item of items) {
      const newPath = [...path, item.id];
      if (item.label === targetLabel) {
        return path;
      }
      if (item.children) {
        const found = findAncestorIds(item.children, targetLabel, newPath);
        if (found) return found;
      }
    }
    return null;
  };

  useEffect(() => {
    if (!sidebarItems.length || !activeTab || hasExpanded) return;
    const ancestorIds = findAncestorIds(sidebarItems, activeTab);
    if (ancestorIds && ancestorIds.length > 0) {
      setExpandedItems(prev => Array.from(new Set([...prev, ...ancestorIds])));
    }
    setHasExpanded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sidebarItems]);

  return sidebarContent;
};