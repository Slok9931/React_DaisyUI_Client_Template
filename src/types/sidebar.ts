export interface SidebarRoute {
  id: number;
  name: string;
  route: string;
  label: string;
  icon: string;
  module_name: string;
  children: SidebarRoute[];
}

export interface SidebarModule {
  id: number;
  name: string;
  label: string;
  icon: string;
  route: string;
  is_active: boolean;
  routes: SidebarRoute[];
}

export interface SidebarApiResponse {
  data: SidebarModule[];
  message?: string;
}

export interface SidebarItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  icon: React.ReactNode;
  children?: SidebarItem[];
  badge?: string | number;
  active?: boolean;
}

export interface SidebarProps {
  items?: SidebarItem[];
  className?: string;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  authLogout?: boolean;
  side?: "left" | "right";
  isOpen?: boolean;
  onClose?: () => void;
  showHeader?: boolean;
  showToggle?: boolean;
  activeTab?: string;
  setActiveTab?: (id: string) => void;
}