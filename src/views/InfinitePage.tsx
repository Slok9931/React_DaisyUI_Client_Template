import React from 'react';
import { useLocation } from 'react-router-dom';
import { getIconComponent } from '@/utils';
import { Typography } from '@/components';

export const InfinitePage: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="text-center">
        {getIconComponent("Infinity", 64, "mx-auto text-primary mb-4")}
        <Typography variant='h1' className="text-4xl font-bold mb-4">Welcome to {path}</Typography>
        <Typography variant='body1' className="text-lg text-base-content/70">
          This is a dynamic page for <span className="font-mono">{path}</span>
        </Typography>
      </div>
    </div>
  );
};