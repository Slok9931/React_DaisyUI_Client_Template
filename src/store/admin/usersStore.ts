import { create } from "zustand";
import { usersApi } from "@/api";
import type {
  Users,
  UsersQueryParams,
  CreateUserRequest,
  UpdateUserRequest,
} from "@/types";

interface UsersState {
  // Data
  users: Users[];
  selectedUser: Users | null;

  // UI State
  loading: boolean;
  error: string | null;

  // Pagination
  currentPage: number;
  pageSize: number;
  totalUsers: number;
  totalPages: number;

  // Filters
  filters: {
    search: string;
    is_active?: boolean;
    role?: string;
  };

  // Selection
  selectedUserIds: string[];
}

interface UsersActions {
  // Data fetching
  fetchUsers: (params?: UsersQueryParams) => Promise<void>;
  fetchUserById: (id: number) => Promise<void>;

  // CRUD operations
  createUser: (userData: CreateUserRequest) => Promise<void>;
  updateUser: (id: number, userData: UpdateUserRequest) => Promise<void>;
  deleteUser: (id: number) => Promise<void>;
  bulkDeleteUsers: (ids: number[]) => Promise<void>;

  // UI actions
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFilters: (filters: Partial<UsersState["filters"]>) => void;
  clearFilters: () => void;
  setSelectedUserIds: (ids: string[]) => void;
  clearError: () => void;
  resetState: () => void;
}

const initialState: UsersState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: 20,
  totalUsers: 0,
  totalPages: 0,
  filters: {
    search: "",
    is_active: undefined,
    role: undefined,
  },
  selectedUserIds: [],
};

export const useUsersStore = create<UsersState & UsersActions>((set, get) => ({
  ...initialState,

  fetchUsers: async (params = {}) => {
    set({ loading: true, error: null });

    try {
      const state = get();
      const queryParams: UsersQueryParams = {
        skip: (state.currentPage - 1) * state.pageSize,
        limit: state.pageSize,
        search: state.filters.search || undefined,
        is_active: state.filters.is_active,
        role: state.filters.role,
        ...params,
      };

      const response = await usersApi.getUsers(queryParams);

      set({
        users: response.users,
        totalUsers: response.total,
        totalPages: Math.ceil(response.total / state.pageSize),
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch users",
        loading: false,
      });
    }
  },

  fetchUserById: async (id: number) => {
    set({ loading: true, error: null });

    try {
      const user = await usersApi.getUserById(id);
      set({ selectedUser: user, loading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch user",
        loading: false,
      });
    }
  },

  createUser: async (userData: CreateUserRequest) => {
    set({ loading: true, error: null });

    try {
      await usersApi.createUser(userData);
      // Refresh the users list
      await get().fetchUsers();
      set({ loading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to create user",
        loading: false,
      });
      throw error;
    }
  },

  updateUser: async (id: number, userData: UpdateUserRequest) => {
    set({ loading: true, error: null });

    try {
      const updatedUser = await usersApi.updateUser(id, userData);

      set((state) => ({
        users: state.users.map((user) => (user.id === id ? updatedUser : user)),
        selectedUser:
          state.selectedUser?.id === id ? updatedUser : state.selectedUser,
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to update user",
        loading: false,
      });
      throw error;
    }
  },

  deleteUser: async (id: number) => {
    set({ loading: true, error: null });

    try {
      await usersApi.deleteUser(id);

      set((state) => ({
        users: state.users.filter((user) => user.id !== id),
        selectedUser: state.selectedUser?.id === id ? null : state.selectedUser,
        selectedUserIds: state.selectedUserIds.filter(
          (userId) => userId !== id.toString()
        ),
        totalUsers: state.totalUsers - 1,
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to delete user",
        loading: false,
      });
      throw error;
    }
  },

  bulkDeleteUsers: async (ids: number[]) => {
    set({ loading: true, error: null });

    try {
      await usersApi.bulkDeleteUsers(ids);

      set((state) => ({
        users: state.users.filter((user) => !ids.includes(user.id)),
        selectedUserIds: [],
        totalUsers: state.totalUsers - ids.length,
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to delete users",
        loading: false,
      });
      throw error;
    }
  },

  setCurrentPage: (page: number) => {
    set({ currentPage: page });
    get().fetchUsers();
  },

  setPageSize: (size: number) => {
    set({ pageSize: size, currentPage: 1 });
    get().fetchUsers();
  },

  setFilters: (newFilters: Partial<UsersState["filters"]>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      currentPage: 1,
    }));
    get().fetchUsers();
  },

  clearFilters: () => {
    set({
      filters: {
        search: "",
        is_active: undefined,
        role: undefined,
      },
      currentPage: 1,
    });
    get().fetchUsers();
  },

  setSelectedUserIds: (ids: string[]) => {
    set({ selectedUserIds: ids });
  },

  clearError: () => {
    set({ error: null });
  },

  resetState: () => {
    set(initialState);
  },
}));
