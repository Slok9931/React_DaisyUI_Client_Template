import { apiClient } from "@/core";
import type {
  Route,
  RoutesListResponse,
  RoutesQueryParams,
  CreateRouteRequest,
  UpdateRouteRequest,
} from "@/types";

export const routesApi = {
  // Get all routes with pagination and filters
  getRoutes: async (
    params: RoutesQueryParams = {}
  ): Promise<RoutesListResponse> => {
    const searchParams = new URLSearchParams();

    if (params.skip !== undefined)
      searchParams.append("skip", params.skip.toString());
    if (params.limit !== undefined)
      searchParams.append("limit", params.limit.toString());
    if (params.search) searchParams.append("search", params.search);
    if (params.is_active !== undefined)
      searchParams.append("is_active", params.is_active.toString());
    if (params.is_sidebar !== undefined)
      searchParams.append("is_sidebar", params.is_sidebar.toString());
    if (params.module_id !== undefined)
      searchParams.append("module_id", params.module_id.toString());
    if (params.parent_id !== undefined)
      searchParams.append("parent_id", params.parent_id.toString());

    const response = await apiClient.get(
      `/api/v1/routes/?${searchParams.toString()}`
    );

    return {
      routes: response.data,
      total: response.data.length,
      skip: params.skip || 0,
      limit: params.limit || 1000,
    };
  },

  // Get route by ID
  getRouteById: async (id: number): Promise<Route> => {
    const response = await apiClient.get(`/api/v1/routes/get-one/${id}`);
    return response.data;
  },

  // Get routes by module ID
  getRoutesByModule: async (moduleId: number): Promise<Route[]> => {
    const response = await routesApi.getRoutes({ module_id: moduleId });
    return response.routes;
  },

  // Get child routes by parent ID
  getChildRoutes: async (parentId: number): Promise<Route[]> => {
    const response = await routesApi.getRoutes({ parent_id: parentId });
    return response.routes;
  },

  // Create new route
  createRoute: async (routeData: CreateRouteRequest): Promise<Route> => {
    const response = await apiClient.post("/api/v1/routes/", routeData);
    return response.data;
  },

  // Update route
  updateRoute: async (
    id: number,
    routeData: UpdateRouteRequest
  ): Promise<Route> => {
    const response = await apiClient.put(`/api/v1/routes/get-one/${id}`, routeData);
    return response.data;
  },

  // Delete route
  deleteRoute: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/v1/routes/${id}`);
  },

  // Bulk delete routes
  bulkDeleteRoutes: async (ids: number[]): Promise<void> => {
    await apiClient.post("/api/v1/routes/bulk-delete", { route_ids: ids });
  },
};