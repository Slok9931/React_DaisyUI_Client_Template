export interface SidebarRoute {
  id: number;
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