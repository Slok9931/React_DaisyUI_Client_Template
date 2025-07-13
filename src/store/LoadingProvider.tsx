import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { FullPageLoader } from '@/components';

interface LoadingContextType {
  isLoading: boolean;
  loadingText: string;
  showLoading: (text?: string) => void;
  hideLoading: () => void;
  setLoadingText: (text: string) => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: React.ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Loading Infinity...');
  const loadingStartTime = useRef<number | null>(null);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  const showLoading = useCallback((text?: string) => {
    // Clear any pending hide timeout
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }

    if (text) {
      setLoadingText(text);
    }
    
    loadingStartTime.current = Date.now();
    setIsLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    const currentTime = Date.now();
    const elapsedTime = loadingStartTime.current ? currentTime - loadingStartTime.current : 0;
    const minDisplayTime = 2000; // 2 seconds minimum

    if (elapsedTime < minDisplayTime) {
      // Wait for the remaining time to reach minimum display duration
      const remainingTime = minDisplayTime - elapsedTime;
      
      hideTimeout.current = setTimeout(() => {
        setIsLoading(false);
        loadingStartTime.current = null;
        hideTimeout.current = null;
      }, remainingTime);
    } else {
      // Already displayed for minimum time, hide immediately
      setIsLoading(false);
      loadingStartTime.current = null;
    }
  }, []);

  const updateLoadingText = useCallback((text: string) => {
    setLoadingText(text);
  }, []);

  const contextValue: LoadingContextType = {
    isLoading,
    loadingText,
    showLoading,
    hideLoading,
    setLoadingText: updateLoadingText,
  };

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
      {isLoading && (
        <FullPageLoader text={loadingText} />
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};