export interface Module {
  id: number;
  name: string;
  label: string;
  icon: string;
  route: string;
  priority: number;
  is_active: boolean;
  created_at: string;
  route_count: number;
}

export interface ModulesListResponse {
  modules: Module[];
  total: number;
  skip: number;
  limit: number;
}

export interface ModulesQueryParams {
  skip?: number;
  limit?: number;
  search?: string;
  is_active?: boolean;
}

export interface CreateModuleRequest {
  name: string;
  label: string;
  icon: string;
  route: string;
  priority: number;
  is_active?: boolean;
}

export interface UpdateModuleRequest {
  name?: string;
  label?: string;
  icon?: string;
  route?: string;
  priority?: number;
  is_active?: boolean;
}