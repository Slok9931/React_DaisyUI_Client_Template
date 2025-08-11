import { apiClient } from '@/core';
import { SidebarModule } from '@/types';

export const sidebarApi = {
  getSidebarData: async (): Promise<SidebarModule[]> => {
    const response = await apiClient.get<SidebarModule[]>('/api/v1/routes/sidebar');
    return response.data;
  },
};