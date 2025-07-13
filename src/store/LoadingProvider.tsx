import React, { createContext, useContext, useState, useCallback } from 'react';
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

  const showLoading = useCallback((text?: string) => {
    if (text) {
      setLoadingText(text);
    }
    setIsLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
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