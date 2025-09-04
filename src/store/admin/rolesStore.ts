import { create } from "zustand";
import { permissionsApi, rolesApi } from "@/api";
import type {
  Role,
  RolesQueryParams,
  CreateRoleRequest,
  Permission,
  PermissionMatrixItem,
} from "@/types";

interface RolesState {
  // Data
  roles: Role[];
  selectedRole: Role | null;
  allPermissions: Permission[];
  permissionMatrix: PermissionMatrixItem[];

  // UI State
  loading: boolean;
  error: string | null;
  sheetOpen: boolean;

  // Pagination
  currentPage: number;
  pageSize: number;
  totalRoles: number;
  totalPages: number;

  // Filters
  filters: {
    search: string;
    is_system_role?: boolean;
  };

  // Selection
  selectedRoleIds: string[];
}

interface RolesActions {
  // Data fetching
  fetchRoles: (params?: RolesQueryParams) => Promise<void>;
  fetchRoleById: (id: number) => Promise<void>;
  fetchAllPermissions: () => Promise<void>;
  buildPermissionMatrix: (role: Role) => void;

  // CRUD operations
  createRole: (roleData: CreateRoleRequest) => Promise<void>;

  // Permission management
  togglePermission: (
    roleId: number,
    permissionId: number,
    hasPermission: boolean
  ) => Promise<void>;

  // UI actions
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFilters: (filters: Partial<RolesState["filters"]>) => void;
  clearFilters: () => void;
  setSelectedRoleIds: (ids: string[]) => void;
  setSheetOpen: (open: boolean) => void;
  clearError: () => void;
  resetState: () => void;
}

const initialState: RolesState = {
  roles: [],
  selectedRole: null,
  allPermissions: [],
  permissionMatrix: [],
  loading: false,
  error: null,
  sheetOpen: false,
  currentPage: 1,
  pageSize: 20,
  totalRoles: 0,
  totalPages: 0,
  filters: {
    search: "",
    is_system_role: undefined,
  },
  selectedRoleIds: [],
};

export const useRolesStore = create<RolesState & RolesActions>((set, get) => ({
  ...initialState,

  fetchRoles: async (params = {}) => {
    set({ loading: true, error: null });

    try {
      const state = get();
      const queryParams: RolesQueryParams = {
        skip: (state.currentPage - 1) * state.pageSize,
        limit: state.pageSize,
        search: state.filters.search || undefined,
        is_system_role: state.filters.is_system_role,
        ...params,
      };

      const response = await rolesApi.getRoles(queryParams);

      set({
        roles: response.roles,
        totalRoles: response.total,
        totalPages: Math.ceil(response.total / state.pageSize),
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch roles",
        loading: false,
      });
    }
  },

  fetchRoleById: async (id: number) => {
    set({ loading: true, error: null });

    try {
      const role = await rolesApi.getRoleById(id);
      set({ selectedRole: role, loading: false });
      get().buildPermissionMatrix(role);
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch role",
        loading: false,
      });
    }
  },

  fetchAllPermissions: async () => {
    try {
      const permissionsResponse = await permissionsApi.getPermissions();
      set({ allPermissions: permissionsResponse.permissions });
    } catch (error: any) {
      console.error("Failed to fetch permissions:", error);
    }
  },

  buildPermissionMatrix: (role: Role) => {
    const state = get();
    const rolePermissionIds = role.permissions.map((p) => p.id);

    // Group permissions by category
    const groupedPermissions: { [key: string]: Permission[] } = {};
    state.allPermissions.forEach((permission) => {
      const category = permission.category;
      if (!groupedPermissions[category]) {
        groupedPermissions[category] = [];
      }
      groupedPermissions[category].push(permission);
    });

    // Build matrix items
    const matrixItems: PermissionMatrixItem[] = [];

    Object.keys(groupedPermissions).forEach((category) => {
      const categoryPermissions = groupedPermissions[category];
      const readPerm = categoryPermissions.find((p) =>
        p.name.endsWith(":read")
      );
      const createPerm = categoryPermissions.find((p) =>
        p.name.endsWith(":create")
      );
      const updatePerm = categoryPermissions.find((p) =>
        p.name.endsWith(":update")
      );
      const deletePerm = categoryPermissions.find((p) =>
        p.name.endsWith(":delete")
      );

      if (readPerm) {
        matrixItems.push({
          id: readPerm.id,
          name: category,
          category: category,
          description: `${category} resource permissions`,
          read: rolePermissionIds.includes(readPerm.id),
          create: createPerm
            ? rolePermissionIds.includes(createPerm.id)
            : false,
          update: updatePerm
            ? rolePermissionIds.includes(updatePerm.id)
            : false,
          delete: deletePerm
            ? rolePermissionIds.includes(deletePerm.id)
            : false,
        });
      }
    });

    set({ permissionMatrix: matrixItems });
  },

  createRole: async (roleData: CreateRoleRequest) => {
    set({ loading: true, error: null });

    try {
      await rolesApi.createRole(roleData);
      await get().fetchRoles();
      set({ loading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to create role",
        loading: false,
      });
      throw error;
    }
  },

  togglePermission: async (
    roleId: number,
    permissionId: number,
    hasPermission: boolean
  ) => {
    try {
      if (hasPermission) {
        await rolesApi.removePermissionFromRole(roleId, permissionId);
      } else {
        await rolesApi.addPermissionToRole(roleId, permissionId);
      }

      // Refresh the role and matrix
      await get().fetchRoleById(roleId);
    } catch (error: any) {
      set({ error: error.message || "Failed to toggle permission" });
      throw error;
    }
  },

  setCurrentPage: (page: number) => {
    set({ currentPage: page });
    get().fetchRoles();
  },

  setPageSize: (size: number) => {
    set({ pageSize: size, currentPage: 1 });
    get().fetchRoles();
  },

  setFilters: (newFilters: Partial<RolesState["filters"]>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      currentPage: 1,
    }));
    get().fetchRoles();
  },

  clearFilters: () => {
    set({
      filters: {
        search: "",
        is_system_role: undefined,
      },
      currentPage: 1,
    });
    get().fetchRoles();
  },

  setSelectedRoleIds: (ids: string[]) => {
    set({ selectedRoleIds: ids });
  },

  setSheetOpen: (open: boolean) => {
    set({ sheetOpen: open });
  },

  clearError: () => {
    set({ error: null });
  },

  resetState: () => {
    set(initialState);
  },
}));