import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { authService } from '@/api';
import type { 
  UserResponse, 
  UserLogin, 
  PublicUserCreate, 
  AuthState,
  Token,
  UserPermissions
} from '@/types';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: UserLogin) => Promise<Token>;
  register: (userData: PublicUserCreate) => Promise<UserResponse>;
  logout: () => Promise<void>;
  clearError: () => void;
  checkAuth: () => Promise<void>;
  refreshAuthToken: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  getUserPermissions: () => Promise<UserPermissions | null>;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      clearError: () => {
        set({ error: null });
      },

      login: async (credentials: UserLogin) => {
        try {
          set({ isLoading: true, error: null });
          
          const tokenResponse = await authService.login(credentials);
          
          // Set tokens in auth service
          authService.setTokens(tokenResponse.access_token, tokenResponse.refresh_token);
          
          // Get user data
          const user = await authService.getCurrentUser();
          
          set({
            user,
            token: tokenResponse.access_token,
            refreshToken: tokenResponse.refresh_token || null,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });

          return tokenResponse;
        } catch (error: any) {
          // Handle ApiError properly
          const errorMessage = error?.message || 'Login failed';
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      register: async (userData: PublicUserCreate) => {
        try {
          set({ isLoading: true, error: null });
          
          // Register user (only creates user, doesn't log them in)
          const userResponse = await authService.publicRegister(userData);
          
          set({
            isLoading: false,
            error: null,
          });

          return userResponse;
        } catch (error: any) {
          // Handle ApiError properly
          const errorMessage = error?.message || 'Registration failed';
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: errorMessage,
          });
          throw error;
        }
      },

      refreshAuthToken: async () => {
        try {
          const refreshToken = localStorage.getItem('refresh_token');
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const tokenResponse = await authService.refreshToken({ refresh_token: refreshToken });
          
          // Update tokens in auth service
          authService.setTokens(tokenResponse.access_token, tokenResponse.refresh_token);
          
          set({
            token: tokenResponse.access_token,
            refreshToken: tokenResponse.refresh_token || null,
            error: null,
          });
        } catch (error) {
          // Refresh failed, logout user
          get().logout();
          throw error;
        }
      },

      logout: async () => {
        try {
          // Call logout API
          await authService.logout();
        } catch (error) {
          // Ignore logout API errors, still clear local state
          console.warn('Logout API call failed:', error);
        } finally {
          // Clear tokens and user data
          authService.clearTokens();
          
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });

          localStorage.removeItem('auth-storage');
        }
      },

      checkAuth: async () => {
        const token = localStorage.getItem('auth_token');
        
        if (!token) {
          set({ isAuthenticated: false, user: null, token: null });
          return;
        }

        try {
          set({ isLoading: true });
          const user = await authService.getCurrentUser();
          
          set({
            user,
            token,
            refreshToken: localStorage.getItem('refresh_token'),
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error) {
          // Token is invalid, try to refresh
          try {
            await get().refreshAuthToken();
            // If refresh succeeds, try getting user again
            const user = await authService.getCurrentUser();
            set({
              user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            });
          } catch (refreshError) {
            // Both token and refresh failed, clear auth state
            authService.clearTokens();
            
            set({
              user: null,
              token: null,
              refreshToken: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            });
          }
        }
      },

      getUserPermissions: async () => {
        try {
          const permissions = await authService.getUserPermissions();
          return permissions;
        } catch (error) {
          console.error('Failed to get user permissions:', error);
          return null;
        }
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);