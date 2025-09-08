import { Role } from "@/types"

export interface Route {
  id: number;
  route: string;
  label: string;
  icon: string;
  is_active: boolean;
  is_sidebar: boolean;
  module_id: number;
  parent_id: number | null;
  priority: number;
  created_at: string;
  updated_at?: string;
  module_name: string;
  parent_route: string | null;
  children_count: number;
  roles: Role[];
}

export interface RoutesListResponse {
  routes: Route[];
  total: number;
  skip: number;
  limit: number;
}

export interface RoutesQueryParams {
  skip?: number;
  limit?: number;
  search?: string;
  is_active?: boolean;
  is_sidebar?: boolean;
  module_id?: number;
  parent_id?: number;
}

export interface CreateRouteRequest {
  route: string;
  label: string;
  icon: string;
  is_active?: boolean;
  is_sidebar?: boolean;
  module_id: number;
  parent_id?: number | null;
  priority: number;
  role_ids: number[];
}

export interface UpdateRouteRequest {
  route?: string;
  label?: string;
  icon?: string;
  is_active?: boolean;
  is_sidebar?: boolean;
  module_id?: number;
  parent_id?: number | null;
  priority?: number;
  role_ids?: number[];
}