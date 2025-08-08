import React from 'react';
import { Loading } from '@/components/ui/Loading';

interface ScreenLoaderProps {
  show?: boolean;
  text?: string;
}

function capitalizeText(text: string) {
  return text.toUpperCase();
}

export const ScreenLoader: React.FC<ScreenLoaderProps> = ({ show = false, text }) => {
  if (!show) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col pointer-events-auto">
      <div className="w-full h-1 bg-base-300">
        <div className="h-full rounded-full bg-primary animate-progress-bar" />
      </div>
      {/* Centered Loader */}
      <div className="flex-1 flex flex-col items-center justify-center bg-base-100/70">
        <Loading size="lg" className='text-primary' />
        {text && (
          <div className="mt-4 text-lg text-primary-content">
            Loading {capitalizeText(text)}
          </div>
        )}
      </div>
      <style>
        {`
          @keyframes progressBar {
            0% { width: 0%; }
            80% { width: 90%; }
            100% { width: 100%; }
          }
          .animate-progress-bar {
            animation: progressBar 1.2s cubic-bezier(.4,0,.2,1) infinite;
            width: 100%;
          }
        `}
      </style>
    </div>
  );
};