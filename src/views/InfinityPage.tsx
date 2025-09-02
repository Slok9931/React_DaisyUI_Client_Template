import React from 'react';
import { getIconComponent } from '@/utils/utilityFunction';
import { Typography } from '@/components';

export const InfinitePage: React.FC = () => {

  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          {getIconComponent("Infinity", 32, "text-primary")}
          <Typography variant="h2" className="font-bold">
            Infinity Page
          </Typography>
        </div>
      </div>
    </div>
  );
};