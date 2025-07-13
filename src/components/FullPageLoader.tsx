import React from 'react';
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
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-base-100/95 backdrop-blur-sm ${className}`}>
      <div className="flex flex-col items-center justify-center space-y-6 p-8">
        <div className="relative scale-150">
          <Loading size="lg" />
        </div>
        
        {showText && (
          <div className="text-center space-y-2">
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
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/5 animate-ping"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-secondary/5 animate-ping animation-delay-1000"></div>
        </div>
      </div>
    </div>
  );
};