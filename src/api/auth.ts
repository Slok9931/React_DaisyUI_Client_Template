import { apiClient } from '@/core';
import type { 
  UserLogin, 
  PublicUserCreate, 
  Token, 
  UserResponse, 
  RefreshTokenRequest,
  PasswordChangeRequest,
  MessageResponse,
  UserPermissions
} from '@/types';

export class AuthService {
  private readonly baseUrl = '/api/v1/auth';

  // Public registration endpoint
  async publicRegister(userData: PublicUserCreate): Promise<UserResponse> {
    const response = await apiClient.post<UserResponse>(
      `${this.baseUrl}/public-register`, 
      userData
    );
    return response.data;
  }

  // Registration endpoint
  async register(userData: PublicUserCreate): Promise<UserResponse> {
    const response = await apiClient.post<UserResponse>(
      `${this.baseUrl}/register`, 
      userData
    );
    return response.data;
  }

  // Login endpoint - Send as JSON, not form data
  async login(credentials: UserLogin): Promise<Token> {
    const response = await apiClient.post<Token>(
      `${this.baseUrl}/login`,
      credentials  // Send as JSON object directly
    );
    return response.data;
  }

  // Refresh token endpoint
  async refreshToken(refreshTokenData: RefreshTokenRequest): Promise<Token> {
    const response = await apiClient.post<Token>(
      `${this.baseUrl}/refresh`, 
      refreshTokenData
    );
    return response.data;
  }

  // Get current user
  async getCurrentUser(): Promise<UserResponse> {
    const response = await apiClient.get<UserResponse>(`${this.baseUrl}/me`);
    return response.data;
  }

  // Get user permissions
  async getUserPermissions(): Promise<UserPermissions> {
    const response = await apiClient.get<UserPermissions>(`${this.baseUrl}/permissions`);
    return response.data;
  }

  // Change password
  async changePassword(passwordData: PasswordChangeRequest): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>(
      `${this.baseUrl}/change-password`, 
      passwordData
    );
    return response.data;
  }

  // Logout
  async logout(): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>(`${this.baseUrl}/logout`);
    return response.data;
  }

  // Helper method to set tokens in API client
  setTokens(accessToken: string, refreshToken?: string): void {
    apiClient.setTokens(accessToken, refreshToken);
  }

  // Helper method to clear tokens
  clearTokens(): void {
    apiClient.clearAuth();
  }
}

// Export singleton instance
export const authService = new AuthService();