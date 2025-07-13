import { useCallback } from 'react';
import { useLoading } from '@/store/LoadingProvider';

interface UseLoadingWithTimeoutOptions {
  minDuration?: number;
  defaultText?: string;
}

export const useLoadingWithTimeout = (options: UseLoadingWithTimeoutOptions = {}) => {
  const { minDuration = 2000, defaultText = 'Loading...' } = options;
  const { showLoading, hideLoading, setLoadingText } = useLoading();

  const showLoadingWithTimeout = useCallback(async (
    asyncFunction: () => Promise<any>,
    loadingText?: string
  ) => {
    const startTime = Date.now();
    
    try {
      showLoading(loadingText || defaultText);
      
      // Execute the async function
      const result = await asyncFunction();
      
      // Calculate remaining time to reach minimum duration
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minDuration - elapsedTime);
      
      // Wait for remaining time if necessary
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      
      hideLoading();
      return result;
    } catch (error) {
      // Still respect minimum duration even on error
      const elapsedTime = Date.now() - startTime;
      const remainingTime = Math.max(0, minDuration - elapsedTime);
      
      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      
      hideLoading();
      throw error;
    }
  }, [showLoading, hideLoading, minDuration, defaultText]);

  return {
    showLoadingWithTimeout,
    showLoading,
    hideLoading,
    setLoadingText,
  };
};