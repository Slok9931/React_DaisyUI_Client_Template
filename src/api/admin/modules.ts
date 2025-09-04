import { apiClient } from "@/core";
import type {
  Module,
  ModulesListResponse,
  ModulesQueryParams,
  CreateModuleRequest,
  UpdateModuleRequest,
} from "@/types";

export const modulesApi = {
  // Get all modules with pagination and filters
  getModules: async (
    params: ModulesQueryParams = {}
  ): Promise<ModulesListResponse> => {
    const searchParams = new URLSearchParams();

    if (params.skip !== undefined)
      searchParams.append("skip", params.skip.toString());
    if (params.limit !== undefined)
      searchParams.append("limit", params.limit.toString());
    if (params.search) searchParams.append("search", params.search);
    if (params.is_active !== undefined)
      searchParams.append("is_active", params.is_active.toString());

    const response = await apiClient.get(
      `/api/v1/modules/?${searchParams.toString()}`
    );

    return {
      modules: response.data,
      total: response.data.length,
      skip: params.skip || 0,
      limit: params.limit || 100,
    };
  },

  // Get module by ID
  getModuleById: async (id: number): Promise<Module> => {
    const response = await apiClient.get(`/api/v1/modules/get-one/${id}`);
    return response.data;
  },

  // Create new module
  createModule: async (moduleData: CreateModuleRequest): Promise<Module> => {
    const response = await apiClient.post("/api/v1/modules/", moduleData);
    return response.data;
  },

  // Update module
  updateModule: async (
    id: number,
    moduleData: UpdateModuleRequest
  ): Promise<Module> => {
    const response = await apiClient.put(`/api/v1/modules/get-one/${id}`, moduleData);
    return response.data;
  },

  // Delete module
  deleteModule: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/v1/modules/${id}`);
  },

  // Bulk delete modules
  bulkDeleteModules: async (ids: number[]): Promise<void> => {
    await apiClient.post("/api/v1/modules/bulk-delete", { module_ids: ids });
  },
};