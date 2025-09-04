import { apiClient } from "@/core";
import type {
  Users,
  UsersListResponse,
  UsersQueryParams,
  CreateUserRequest,
  UpdateUserRequest,
} from "@/types";

export const usersApi = {
  // Get all users with pagination and filters
  getUsers: async (
    params: UsersQueryParams = {}
  ): Promise<UsersListResponse> => {
    const searchParams = new URLSearchParams();

    if (params.skip !== undefined)
      searchParams.append("skip", params.skip.toString());
    if (params.limit !== undefined)
      searchParams.append("limit", params.limit.toString());
    if (params.search) searchParams.append("search", params.search);
    if (params.is_active !== undefined)
      searchParams.append("is_active", params.is_active.toString());
    if (params.role) searchParams.append("role", params.role);

    const response = await apiClient.get(
      `/api/v1/users/?${searchParams.toString()}`
    );

    // Transform the response to match our expected format
    return {
      users: response.data,
      total: response.data.length, // You might need to adjust this based on your API response
      skip: params.skip || 0,
      limit: params.limit || 100,
    };
  },

  // Get user by ID
  getUserById: async (id: number): Promise<Users> => {
    const response = await apiClient.get(`/api/v1/users/get-one/${id}`);
    return response.data;
  },

  // Create new user
  createUser: async (userData: CreateUserRequest): Promise<Users> => {
    const response = await apiClient.post("/api/v1/users/", userData);
    return response.data;
  },

  // Update user
  updateUser: async (
    id: number,
    userData: UpdateUserRequest
  ): Promise<Users> => {
    const response = await apiClient.put(`/api/v1/users/get-one/${id}`, userData);
    return response.data;
  },

  // Delete user
  deleteUser: async (id: number): Promise<void> => {
    await apiClient.delete(`/api/v1/users/${id}`);
  },

  // Bulk delete users
  bulkDeleteUsers: async (ids: number[]): Promise<void> => {
    await apiClient.post("/api/v1/users/bulk-delete", { user_ids: ids });
  },
};
