import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ApiError {
  message: string;
  status: number;
  detail?: string;
  errors?: any[];
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success?: boolean;
}

class ApiClient {
  private instance: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    
    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor - Add auth token
    this.instance.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(this.handleError(error));
      }
    );

    // Response interceptor - Handle common errors
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        const originalRequest = error.config;

        // Handle 401 errors
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Try to refresh token
            const refreshToken = this.getRefreshToken();
            if (refreshToken) {
              await this.refreshToken(refreshToken);
              // Retry original request with new token
              const newToken = this.getToken();
              if (newToken) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return this.instance(originalRequest);
              }
            }
          } catch (refreshError) {
            // Refresh failed, logout user
            this.clearTokens();
            window.location.href = '/login';
            return Promise.reject(this.handleError(refreshError));
          }
        }

        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: any): ApiError {
    if (error.response) {
      // Server responded with error status
      const errorData = error.response.data;
      
      let message = 'An error occurred';
      
      // Handle different error response formats
      if (typeof errorData === 'string') {
        message = errorData;
      } else if (errorData?.detail) {
        if (typeof errorData.detail === 'string') {
          message = errorData.detail;
        } else if (Array.isArray(errorData.detail)) {
          // Handle validation errors from FastAPI
          message = errorData.detail.map((err: any) => {
            if (typeof err === 'string') return err;
            if (err.msg) return `${err.loc?.[1] || 'Field'}: ${err.msg}`;
            return JSON.stringify(err);
          }).join(', ');
        }
      } else if (errorData?.message) {
        message = errorData.message;
      }

      return {
        message,
        status: error.response.status,
        detail: errorData?.detail,
        errors: Array.isArray(errorData?.detail) ? errorData.detail : undefined,
      };
    } else if (error.request) {
      // Request made but no response received
      return {
        message: 'Network error - please check your connection',
        status: 0,
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
        status: 0,
      };
    }
  }

  private getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  private getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  private clearTokens(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
  }

  private async refreshToken(refreshToken: string): Promise<void> {
    try {
      const response = await axios.post(`${this.baseURL}/api/v1/auth/refresh`, {
        refresh_token: refreshToken,
      });
      
      const { access_token, refresh_token: newRefreshToken } = response.data;
      
      localStorage.setItem('auth_token', access_token);
      if (newRefreshToken) {
        localStorage.setItem('refresh_token', newRefreshToken);
      }
    } catch (error) {
      this.clearTokens();
      throw error;
    }
  }

  // Public methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(url, config);
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(url, data, config);
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.put<T>(url, data, config);
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.patch<T>(url, data, config);
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(url, config);
  }

  // Special method for form data (URL-encoded)
  async postFormData<T = any>(url: string, data: Record<string, string>, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const formData = new URLSearchParams();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value);
    });

    return this.instance.post<T>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  // Special method for multipart form data (file uploads)
  async postMultipart<T = any>(url: string, data: FormData, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(url, data, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  // Method to set auth tokens
  setTokens(accessToken: string, refreshToken?: string): void {
    localStorage.setItem('auth_token', accessToken);
    if (refreshToken) {
      localStorage.setItem('refresh_token', refreshToken);
    }
  }

  // Method to clear auth tokens
  clearAuth(): void {
    this.clearTokens();
  }

  // Get base URL
  getBaseURL(): string {
    return this.baseURL;
  }
}

// Create singleton instance
export const apiClient = new ApiClient();
export default apiClient;