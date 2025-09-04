import { apiClient } from "@/core";
import type {
  Role,
  RolesListResponse,
  RolesQueryParams,
  CreateRoleRequest,
} from "@/types";

export const rolesApi = {
  // Get all roles with pagination and filters
  getRoles: async (params: RolesQueryParams = {}): Promise<RolesListResponse> => {
    const searchParams = new URLSearchParams();

    if (params.skip !== undefined)
      searchParams.append("skip", params.skip.toString());
    if (params.limit !== undefined)
      searchParams.append("limit", params.limit.toString());
    if (params.search) searchParams.append("search", params.search);
    if (params.is_system_role !== undefined)
      searchParams.append("is_system_role", params.is_system_role.toString());

    const response = await apiClient.get(
      `/api/v1/roles/?${searchParams.toString()}`
    );

    return {
      roles: response.data,
      total: response.data.length,
      skip: params.skip || 0,
      limit: params.limit || 100,
    };
  },

  // Get role by ID
  getRoleById: async (id: number): Promise<Role> => {
    const response = await apiClient.get(`/api/v1/roles/${id}`);
    return response.data;
  },

  // Create new role
  createRole: async (roleData: CreateRoleRequest): Promise<Role> => {
    const response = await apiClient.post("/api/v1/roles/", roleData);
    return response.data;
  },

  // Add permission to role
  addPermissionToRole: async (roleId: number, permissionId: number): Promise<void> => {
    await apiClient.post(`/api/v1/roles/${roleId}/permissions/${permissionId}`);
  },

  // Remove permission from role
  removePermissionFromRole: async (roleId: number, permissionId: number): Promise<void> => {
    await apiClient.delete(`/api/v1/roles/${roleId}/permissions/${permissionId}`);
  }
};