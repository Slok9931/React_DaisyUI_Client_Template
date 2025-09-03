export interface Permission {
  id: number;
  name: string;
  description: string;
  category: string;
}

export interface Roles {
  id: number;
  name: string;
  description: string;
  is_system_role: boolean;
  permissions: Permission[];
}

export interface Users {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
  roles: Roles[];
}

export interface UsersListResponse {
  users: Users[];
  total: number;
  skip: number;
  limit: number;
}

export interface UsersQueryParams {
  skip?: number;
  limit?: number;
  search?: string;
  is_active?: boolean;
  role?: string;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  is_active?: boolean;
  role_ids?: number[];
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  is_active?: boolean;
  role_ids?: number[];
}