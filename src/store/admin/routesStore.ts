import { create } from "zustand";
import { routesApi } from "@/api";
import { useRolesStore } from "@/store"; // Import roles store
import type {
  Route,
  CreateRouteRequest,
  UpdateRouteRequest,
  Role,
} from "@/types";

interface RoutesState {
  // Data
  allRoutes: Route[];
  routesByModule: Record<number, Route[]>;
  childRoutes: Record<number, Route[]>;
  selectedRoute: Route | null;
  allRoles: Role[]; // Add all roles for dropdowns

  // UI State
  loading: boolean;
  error: string | null;

  // Filters per module
  moduleFilters: Record<number, {
    search: string;
    is_active?: boolean;
    is_sidebar?: boolean;
  }>;

  // Selection per module
  selectedRouteIds: Record<number, string[]>;

  // Expanded rows tracking
  expandedRows: Record<number, string[]>;
}

interface RoutesActions {
  // Data fetching
  fetchAllRoutes: () => Promise<void>;
  fetchRoutesByModule: (moduleId: number) => Promise<void>;
  fetchChildRoutes: (parentId: number) => Promise<void>;
  fetchRouteById: (id: number) => Promise<void>;
  fetchAllRoles: () => Promise<void>; // Add this

  // CRUD operations
  createRoute: (routeData: CreateRouteRequest) => Promise<void>;
  updateRoute: (id: number, routeData: UpdateRouteRequest) => Promise<void>;
  deleteRoute: (id: number) => Promise<void>;

  // UI actions
  setModuleFilters: (moduleId: number, filters: Partial<RoutesState["moduleFilters"][0]>) => void;
  clearModuleFilters: (moduleId: number) => void;
  setSelectedRouteIds: (moduleId: number, ids: string[]) => void;
  setExpandedRows: (moduleId: number, rowIds: string[]) => void;
  clearError: () => void;
  resetState: () => void;

  // Helper methods
  getParentRoutes: (moduleId: number) => Route[];
  getChildRoutesByParent: (parentId: number) => Route[];
}

const initialState: RoutesState = {
  allRoutes: [],
  routesByModule: {},
  childRoutes: {},
  selectedRoute: null,
  allRoles: [], // Initialize empty roles array
  loading: false,
  error: null,
  moduleFilters: {},
  selectedRouteIds: {},
  expandedRows: {},
};

export const useRoutesStore = create<RoutesState & RoutesActions>((set, get) => ({
  ...initialState,

  fetchAllRoles: async () => {
    try {
      // Use the roles store to get all roles
      const rolesStore = useRolesStore.getState();
      await rolesStore.fetchAllPermissions(); // This might fetch roles too
      
      // If roles store has a method to get all roles, use that
      const roles = rolesStore.roles || [];
      set({ allRoles: roles });
    } catch (error: any) {
      console.error("Failed to fetch roles:", error);
    }
  },

  fetchAllRoutes: async () => {
    set({ loading: true, error: null });

    try {
      const response = await routesApi.getRoutes();
      const routes = response.routes;

      // Group routes by module
      const routesByModule: Record<number, Route[]> = {};
      routes.forEach(route => {
        if (!routesByModule[route.module_id]) {
          routesByModule[route.module_id] = [];
        }
        routesByModule[route.module_id].push(route);
      });

      // Sort routes within each module by priority
      Object.keys(routesByModule).forEach(moduleId => {
        routesByModule[parseInt(moduleId)].sort((a, b) => a.priority - b.priority);
      });

      set({
        allRoutes: routes,
        routesByModule,
        loading: false,
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch routes",
        loading: false,
      });
    }
  },

  fetchRoutesByModule: async (moduleId: number) => {
    set({ loading: true, error: null });

    try {
      const routes = await routesApi.getRoutesByModule(moduleId);
      const sortedRoutes = routes.sort((a, b) => a.priority - b.priority);

      set((state) => ({
        routesByModule: {
          ...state.routesByModule,
          [moduleId]: sortedRoutes,
        },
        loading: false,
      }));
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch routes",
        loading: false,
      });
    }
  },

  fetchChildRoutes: async (parentId: number) => {
    try {
      // Fetch child routes from API with parent_id filter
      const response = await routesApi.getRoutes({ parent_id: parentId, limit: 1000 });
      const childRoutes = response.routes;
      const sortedChildRoutes = childRoutes.sort((a, b) => a.priority - b.priority);

      set((state) => ({
        childRoutes: {
          ...state.childRoutes,
          [parentId]: sortedChildRoutes,
        },
      }));
    } catch (error: any) {
      console.error("Failed to fetch child routes:", error);
    }
  },

  fetchRouteById: async (id: number) => {
    set({ loading: true, error: null });

    try {
      const route = await routesApi.getRouteById(id);
      set({ selectedRoute: route, loading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to fetch route",
        loading: false,
      });
    }
  },

  createRoute: async (routeData: CreateRouteRequest) => {
    set({ loading: true, error: null });

    try {
      await routesApi.createRoute(routeData);
      
      // Refresh the affected module's routes
      await get().fetchRoutesByModule(routeData.module_id);
      
      // If it's a child route, refresh parent's children
      if (routeData.parent_id) {
        await get().fetchChildRoutes(routeData.parent_id);
      }
      
      set({ loading: false });
    } catch (error: any) {
      set({
        error: error.message || "Failed to create route",
        loading: false,
      });
      throw error;
    }
  },

  updateRoute: async (id: number, routeData: UpdateRouteRequest) => {
    set({ loading: true, error: null });

    try {
      const updatedRoute = await routesApi.updateRoute(id, routeData);
      const moduleId = updatedRoute.module_id;

      set((state) => ({
        allRoutes: state.allRoutes.map((route) => (route.id === id ? updatedRoute : route)),
        routesByModule: {
          ...state.routesByModule,
          [moduleId]: state.routesByModule[moduleId]?.map((route) => 
            route.id === id ? updatedRoute : route
          ) || [],
        },
        selectedRoute: state.selectedRoute?.id === id ? updatedRoute : state.selectedRoute,
        loading: false,
      }));

      // If parent changed, refresh child routes
      if (updatedRoute.parent_id) {
        await get().fetchChildRoutes(updatedRoute.parent_id);
      }
    } catch (error: any) {
      set({
        error: error.message || "Failed to update route",
        loading: false,
      });
      throw error;
    }
  },

  deleteRoute: async (id: number) => {
    set({ loading: true, error: null });

    try {
      await routesApi.deleteRoute(id);

      set((state) => {
        const updatedAllRoutes = state.allRoutes.filter((route) => route.id !== id);
        const updatedRoutesByModule = { ...state.routesByModule };
        
        // Remove from all modules
        Object.keys(updatedRoutesByModule).forEach(moduleId => {
          updatedRoutesByModule[parseInt(moduleId)] = updatedRoutesByModule[parseInt(moduleId)].filter(
            route => route.id !== id
          );
        });

        return {
          allRoutes: updatedAllRoutes,
          routesByModule: updatedRoutesByModule,
          selectedRoute: state.selectedRoute?.id === id ? null : state.selectedRoute,
          loading: false,
        };
      });
    } catch (error: any) {
      set({
        error: error.message || "Failed to delete route",
        loading: false,
      });
      throw error;
    }
  },

  setModuleFilters: (moduleId: number, newFilters: Partial<RoutesState["moduleFilters"][0]>) => {
    set((state) => ({
      moduleFilters: {
        ...state.moduleFilters,
        [moduleId]: {
          ...state.moduleFilters[moduleId],
          ...newFilters,
        },
      },
    }));
  },

  clearModuleFilters: (moduleId: number) => {
    set((state) => ({
      moduleFilters: {
        ...state.moduleFilters,
        [moduleId]: {
          search: "",
          is_active: undefined,
          is_sidebar: undefined,
        },
      },
    }));
  },

  setSelectedRouteIds: (moduleId: number, ids: string[]) => {
    set((state) => ({
      selectedRouteIds: {
        ...state.selectedRouteIds,
        [moduleId]: ids,
      },
    }));
  },

  setExpandedRows: (moduleId: number, rowIds: string[]) => {
    set((state) => ({
      expandedRows: {
        ...state.expandedRows,
        [moduleId]: rowIds,
      },
    }));
  },

  clearError: () => {
    set({ error: null });
  },

  resetState: () => {
    set(initialState);
  },

  // Helper methods
  getParentRoutes: (moduleId: number) => {
    const state = get();
    const moduleRoutes = state.routesByModule[moduleId] || [];
    return moduleRoutes.filter(route => route.parent_id === null);
  },

  getChildRoutesByParent: (parentId: number) => {
    const state = get();
    // First check if we have cached child routes for this parent
    if (state.childRoutes[parentId]) {
      return state.childRoutes[parentId];
    }
    
    // If not cached, find children from all routes
    const allRoutes = state.allRoutes;
    const childRoutes = allRoutes.filter(route => route.parent_id === parentId);
    
    // Also check in routesByModule for the child routes
    const moduleRoutes = Object.values(state.routesByModule).flat();
    const additionalChildren = moduleRoutes.filter(route => route.parent_id === parentId);
    
    // Combine and deduplicate
    const combinedChildren = [...childRoutes];
    additionalChildren.forEach(child => {
      if (!combinedChildren.find(existing => existing.id === child.id)) {
        combinedChildren.push(child);
      }
    });
    
    return combinedChildren.sort((a, b) => a.priority - b.priority);
  },
}));