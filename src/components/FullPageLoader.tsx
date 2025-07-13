import React, { useEffect, useState } from 'react';
import { Loading, Typography } from '@/components';

interface FullPageLoaderProps {
  text?: string;
  className?: string;
  showText?: boolean;
}

export const FullPageLoader: React.FC<FullPageLoaderProps> = ({
  text = 'Loading Infinity...',
  className = '',
  showText = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`
      fixed inset-0 z-50 flex items-center justify-center bg-base-100/95 backdrop-blur-sm
      transition-all duration-300 ease-in-out
      ${isVisible ? 'opacity-100' : 'opacity-0'}
      ${className}
    `}>
      <div className={`
        flex flex-col items-center justify-center space-y-6 p-8
        transform transition-all duration-500 ease-out
        ${isVisible ? 'translate-y-0 scale-100' : 'translate-y-4 scale-95'}
      `}>
        <div className="relative scale-150">
          <Loading size="lg" />
        </div>
        
        {showText && (
          <div className={`
            text-center space-y-2
            transform transition-all duration-700 ease-out delay-200
            ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0'}
          `}>
            <Typography 
              variant="h4" 
              className="text-base-content infinity-brand"
            >
              {text}
            </Typography>
            <Typography 
              variant="body2" 
              className="text-base-content/60"
            >
              Please wait while we prepare your experience
            </Typography>
          </div>
        )}

        {/* Optional pulse animation background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className={`
            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
            w-96 h-96 rounded-full bg-primary/5 animate-ping
            transition-opacity duration-1000 delay-300
            ${isVisible ? 'opacity-100' : 'opacity-0'}
          `}></div>
          <div className={`
            absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
            w-64 h-64 rounded-full bg-secondary/5 animate-ping animation-delay-1000
            transition-opacity duration-1000 delay-500
            ${isVisible ? 'opacity-100' : 'opacity-0'}
          `}></div>
        </div>
      </div>
    </div>
  );
};