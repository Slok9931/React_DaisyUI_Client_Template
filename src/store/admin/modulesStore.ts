import { create } from "zustand";
import { modulesApi } from "@/api";
import type {
  Module,
  ModulesQueryParams,
  CreateModuleRequest,
  UpdateModuleRequest,
} from "@/types";

interface ModulesState {
  // Data
  modules: Module[];
  selectedModule: Module | null;

  // UI State
  loading: boolean;
  error: string | null;

  // Pagination
  currentPage: number;
  pageSize: number;
  totalModules: number;
  totalPages: number;

  // Filters
  filters: {
    search: string;
    is_active?: boolean;
  };

  // Selection
  selectedModuleIds: string[];
}

interface ModulesActions {
  // Data fetching
  fetchModules: (params?: ModulesQueryParams) => Promise<void>;
  fetchModuleById: (id: number) => Promise<void>;
  fetchTotalModules: () => Promise<void>; // Add this

  // CRUD operations
  createModule: (moduleData: CreateModuleRequest) => Promise<void>;
  updateModule: (id: number, moduleData: UpdateModuleRequest) => Promise<void>;
  deleteModule: (id: number) => Promise<void>;
  bulkDeleteModules: (ids: number[]) => Promise<void>;

  // UI actions
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setFilters: (filters: Partial<ModulesState["filters"]>) => void;
  clearFilters: () => void;
  setSelectedModuleIds: (ids: string[]) => void;
  clearError: () => void;
  resetState: () => void;
}

const initialState: ModulesState = {
  modules: [],
  selectedModule: null,
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: 10,
  totalModules: 0,
  totalPages: 0,
  filters: {
    search: "",
    is_active: undefined,
  },
  selectedModuleIds: [],
};

export const useModulesStore = create<ModulesState & ModulesActions>((set, get) => ({
  ...initialState,

  fetchModules: async (params = {}) => {
    set({ loading: true, error: null });

    try {
      const state = get();
      const queryParams: ModulesQueryParams = {
        skip: (state.currentPage - 1) * state.pageSize,
        limit: state.pageSize,
        search: state.filters.search || undefined,
        is_active: state.filters.is_active,
        ...params,
      };

      const response = await modulesApi.getModules(queryParams);

      set({
        modules: response.modules,
        // DON'T update totalModules here - it should only be updated by fetchTotalModules
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch modules",
        loading: false,
      });
    }
  },

  fetchModuleById: async (id: number) => {
    set({ loading: true, error: null });

    try {
      const module = await modulesApi.getModuleById(id);
      set({ selectedModule: module, loading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch module",
        loading: false,
      });
    }
  },

  createModule: async (moduleData: CreateModuleRequest) => {
    set({ loading: true, error: null });

    try {
      await modulesApi.createModule(moduleData);
      await get().fetchModules();
      set({ loading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to create module",
        loading: false,
      });
      throw error;
    }
  },

  updateModule: async (id: number, moduleData: UpdateModuleRequest) => {
    set({ loading: true, error: null });

    try {
      const updatedModule = await modulesApi.updateModule(id, moduleData);

      set((state) => ({
        modules: state.modules.map((module) => (module.id === id ? updatedModule : module)),
        selectedModule:
          state.selectedModule?.id === id ? updatedModule : state.selectedModule,
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to update module",
        loading: false,
      });
      throw error;
    }
  },

  deleteModule: async (id: number) => {
    set({ loading: true, error: null });

    try {
      await modulesApi.deleteModule(id);

      set((state) => ({
        modules: state.modules.filter((module) => module.id !== id),
        selectedModule: state.selectedModule?.id === id ? null : state.selectedModule,
        selectedModuleIds: state.selectedModuleIds.filter(
          (moduleId) => moduleId !== id.toString()
        ),
        totalModules: state.totalModules - 1,
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to delete module",
        loading: false,
      });
      throw error;
    }
  },

  bulkDeleteModules: async (ids: number[]) => {
    set({ loading: true, error: null });

    try {
      await modulesApi.bulkDeleteModules(ids);

      set((state) => ({
        modules: state.modules.filter((module) => !ids.includes(module.id)),
        selectedModuleIds: [],
        totalModules: state.totalModules - ids.length,
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to delete modules",
        loading: false,
      });
      throw error;
    }
  },

  fetchTotalModules: async () => {
    try {
      const state = get();
      const total = await modulesApi.getTotalModules();
      
      set({
        totalModules: total,
        totalPages: Math.ceil(total / state.pageSize),
      });
    } catch (error: any) {
      console.error("Failed to fetch total modules:", error);
    }
  },

  setCurrentPage: (page: number) => {
    set({ currentPage: page });
    // Don't call fetchModules here - let the component handle it
  },

  setPageSize: (size: number) => {
    set({ pageSize: size, currentPage: 1 });
    // Don't call fetchModules here - let the component handle it
  },

  setFilters: (newFilters: Partial<ModulesState["filters"]>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
      currentPage: 1,
    }));
    // Don't call fetchModules here - let the component handle it
  },

  clearFilters: () => {
    set({
      filters: {
        search: "",
        is_active: undefined,
      },
      currentPage: 1,
    });
    get().fetchModules();
  },

  setSelectedModuleIds: (ids: string[]) => {
    set({ selectedModuleIds: ids });
  },

  clearError: () => {
    set({ error: null });
  },

  resetState: () => {
    set(initialState);
  },
}));