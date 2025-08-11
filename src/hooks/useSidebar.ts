import { useState, useEffect } from 'react';
import { sidebarApi } from '@/api';
import { SidebarModule } from '@/types';
import { useToast } from '@/components';

export const useSidebar = () => {
  const [sidebarData, setSidebarData] = useState<SidebarModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();

  const fetchSidebarData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await sidebarApi.getSidebarData();
      setSidebarData(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch sidebar data';
      setError(errorMessage);
      addToast({ 
        message: 'Failed to load sidebar menu', 
        variant: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSidebarData();
  }, []);

  return {
    sidebarData,
    loading,
    error,
    refetch: fetchSidebarData,
  };
};