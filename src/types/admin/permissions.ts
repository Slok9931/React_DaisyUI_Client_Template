export interface Permissions {
  id: number;
  name: string;
  description: string;
  category: string;
}

export interface PermissionsListResponse {
  permissions: Permissions[];
  total: number;
  skip: number;
  limit: number;
}

export interface PermissionsQueryParams {
  skip?: number;
  limit?: number;
  search?: string;
  category?: string;
}

export interface CreatePermissionRequest {
  name: string;
  description: string;
  category: string;
}

export interface UpdatePermissionRequest {
  name?: string;
  description?: string;
  category?: string;
}