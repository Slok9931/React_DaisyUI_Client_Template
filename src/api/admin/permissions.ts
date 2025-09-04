import { apiClient } from "@/core";
import type {
  Permission,
  PermissionsListResponse,
  PermissionsQueryParams,
  CreatePermissionRequest,
  UpdatePermissionRequest,
} from "@/types";

export const permissionsApi = {
  // Get all permissions with pagination and filters
  getPermissions: async (
    params: PermissionsQueryParams = {}
  ): Promise<PermissionsListResponse> => {
    const searchParams = new URLSearchParams();

    if (params.skip !== undefined)
      searchParams.append("skip", params.skip.toString());
    if (params.limit !== undefined)
      searchParams.append("limit", params.limit.toString());
    if (params.search) searchParams.append("search", params.search);
    if (params.category) searchParams.append("category", params.category);

    const response = await apiClient.get(
      `/api/v1/permissions/?${searchParams.toString()}`
    );

    // Transform the response to match our expected format
    return {
      permissions: response.data,
      total: response.data.length,
      skip: params.skip || 0,
      limit: params.limit || 100,
    };
  },

  // Get permission by ID
  getPermissionById: async (id: number): Promise<Permission> => {
    const response = await apiClient.get(`/api/v1/permissions/get-one/${id}`);
    return response.data;
  },

  // Create new permission
  createPermission: async (
    permissionData: CreatePermissionRequest
  ): Promise<Permission> => {
    const response = await apiClient.post(
      "/api/v1/permissions/",
      permissionData
    );
    return response.data;
  },

  // Update permission
  updatePermission: async (
    id: number,
    permissionData: UpdatePermissionRequest
  ): Promise<Permission> => {
    const response = await apiClient.put(
      `/api/v1/permissions/get-one/${id}`,
      permissionData
    );
    return response.data;
  },

  // Delete permission
  deletePermission: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/v1/permissions/${id}`);
  },

  // Bulk delete permissions
  bulkDeletePermissions: async (ids: number[]): Promise<void> => {
    await apiClient.post("/api/v1/permissions/bulk-delete", {
      permission_ids: ids,
    });
  },

  // Get all unique categories
  getCategories: async (): Promise<string[]> => {
    const response = await apiClient.get("/api/v1/permissions/categories");
    return response.data;
  },
};