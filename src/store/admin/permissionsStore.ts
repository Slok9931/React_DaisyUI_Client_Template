import { create } from "zustand";
import { permissionsApi } from "@/api";
import type {
  Permission,
  PermissionsQueryParams,
  CreatePermissionRequest,
  UpdatePermissionRequest,
} from "@/types";

interface PermissionsState {
  // Data
  permissions: Permission[];
  selectedPermission: Permission | null;
  categories: string[];

  // UI State
  loading: boolean;
  error: string | null;

  // Pagination
  currentPage: number;
  pageSize: number;
  totalPermissions: number;
  totalPages: number;

  // Filters
  filters: {
    search: string;
    category?: string;
  };

  // Selection
  selectedPermissionIds: string[];
}

interface PermissionsActions {
  // Data fetching
  fetchPermissions: (params?: PermissionsQueryParams) => Promise<void>;
  fetchPermissionById: (id: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
  fetchTotalPermissions: () => Promise<void>;

  // CRUD operations
  createPermission: (permissionData: CreatePermissionRequest) => Promise<void>;
  updatePermission: (
    id: number,
    permissionData: UpdatePermissionRequest
  ) => Promise<void>;
  deletePermission: (id: number) => Promise<void>;
  bulkDeletePermissions: (ids: number[]) => Promise<void>;

  // UI actions
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFilters: (filters: Partial<PermissionsState["filters"]>) => void;
  clearFilters: () => void;
  setSelectedPermissionIds: (ids: string[]) => void;
  clearError: () => void;
  resetState: () => void;
}

const initialState: PermissionsState = {
  permissions: [],
  selectedPermission: null,
  categories: [],
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: 20,
  totalPermissions: 0,
  totalPages: 0,
  filters: {
    search: "",
    category: undefined,
  },
  selectedPermissionIds: [],
};

export const usePermissionsStore = create<
  PermissionsState & PermissionsActions
>((set, get) => ({
  ...initialState,

  fetchPermissions: async (params = {}) => {
    set({ loading: true, error: null });

    try {
      const state = get();
      const queryParams: PermissionsQueryParams = {
        skip: (state.currentPage - 1) * state.pageSize,
        limit: state.pageSize,
        search: state.filters.search || undefined,
        category: state.filters.category,
        ...params,
      };

      const response = await permissionsApi.getPermissions(queryParams);

      set({
        permissions: response.permissions,
        // DON'T update totalPermissions here - it should only be updated by fetchTotalPermissions
        // totalPermissions: response.total, // REMOVE THIS LINE
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch permissions",
        loading: false,
      });
    }
  },

  fetchPermissionById: async (id: number) => {
    set({ loading: true, error: null });

    try {
      const permission = await permissionsApi.getPermissionById(id);
      set({ selectedPermission: permission, loading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch permission",
        loading: false,
      });
    }
  },

  fetchCategories: async () => {
    try {
      const categories = await permissionsApi.getCategories();
      set({ categories });
    } catch (error: any) {
      console.error("Failed to fetch categories:", error);
      // Don't set error state for categories as it's not critical
    }
  },

  fetchTotalPermissions: async () => {
    try {
      const state = get();
      const total = await permissionsApi.getTotalPermissions();
      
      set({
        totalPermissions: total,
        totalPages: Math.ceil(total / state.pageSize),
      });
    } catch (error: any) {
      console.error("Failed to fetch total permissions:", error);
    }
  },

  createPermission: async (permissionData: CreatePermissionRequest) => {
    set({ loading: true, error: null });

    try {
      await permissionsApi.createPermission(permissionData);
      // Refresh the permissions list and categories
      await get().fetchPermissions();
      await get().fetchCategories();
      set({ loading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to create permission",
        loading: false,
      });
      throw error;
    }
  },

  updatePermission: async (
    id: number,
    permissionData: UpdatePermissionRequest
  ) => {
    set({ loading: true, error: null });

    try {
      const updatedPermission = await permissionsApi.updatePermission(
        id,
        permissionData
      );

      set((state) => ({
        permissions: state.permissions.map((permission) =>
          permission.id === id ? updatedPermission : permission
        ),
        selectedPermission:
          state.selectedPermission?.id === id
            ? updatedPermission
            : state.selectedPermission,
        loading: false,
      }));

      // Refresh categories in case category was updated
      await get().fetchCategories();
    } catch (error: any) {
      set({
        error: error.message || "Failed to update permission",
        loading: false,
      });
      throw error;
    }
  },

  deletePermission: async (id: number) => {
    set({ loading: true, error: null });

    try {
      await permissionsApi.deletePermission(id);

      set((state) => ({
        permissions: state.permissions.filter(
          (permission) => permission.id !== id
        ),
        selectedPermission:
          state.selectedPermission?.id === id ? null : state.selectedPermission,
        selectedPermissionIds: state.selectedPermissionIds.filter(
          (permissionId) => permissionId !== id.toString()
        ),
        totalPermissions: state.totalPermissions - 1,
        loading: false,
      }));

      // Refresh categories in case the last permission of a category was deleted
      await get().fetchCategories();
    } catch (error: any) {
      set({
        error: error.message || "Failed to delete permission",
        loading: false,
      });
      throw error;
    }
  },

  bulkDeletePermissions: async (ids: number[]) => {
    set({ loading: true, error: null });

    try {
      await permissionsApi.bulkDeletePermissions(ids);

      set((state) => ({
        permissions: state.permissions.filter(
          (permission) => !ids.includes(permission.id)
        ),
        selectedPermissionIds: [],
        totalPermissions: state.totalPermissions - ids.length,
        loading: false,
      }));

      // Refresh categories in case permissions from certain categories were deleted
      await get().fetchCategories();
    } catch (error: any) {
      set({
        error: error.message || "Failed to delete permissions",
        loading: false,
      });
      throw error;
    }
  },

  setCurrentPage: (page: number) => {
    set({ currentPage: page });
    // Don't call fetchPermissions here - let the component handle it
  },

  setPageSize: (size: number) => {
    set({ pageSize: size, currentPage: 1 });
    // Don't call fetchPermissions here - let the component handle it
  },

  setFilters: (newFilters: Partial<PermissionsState["filters"]>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      currentPage: 1,
    }));
    // Don't call fetchPermissions here - let the component handle it
  },

  clearFilters: () => {
    set({
      filters: {
        search: "",
        category: undefined,
      },
      currentPage: 1,
    });
    get().fetchPermissions();
  },

  setSelectedPermissionIds: (ids: string[]) => {
    set({ selectedPermissionIds: ids });
  },

  clearError: () => {
    set({ error: null });
  },

  resetState: () => {
    set(initialState);
  },
}));
