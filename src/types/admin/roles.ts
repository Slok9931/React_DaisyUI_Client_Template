import { Permission } from "@/types"

export interface Role {
  id: number;
  name: string;
  description: string;
  is_system_role: boolean;
  permissions: Permission[];
}

export interface RolesListResponse {
  roles: Role[];
  total: number;
  skip: number;
  limit: number;
}

export interface RolesQueryParams {
  skip?: number;
  limit?: number;
  search?: string;
  is_system_role?: boolean;
}

export interface CreateRoleRequest {
  name: string;
  description: string;
  is_system_role?: boolean;
}

export interface PermissionMatrixItem {
  id: number;
  name: string;
  category: string;
  description: string;
  read: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
}