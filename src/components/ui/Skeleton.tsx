import React from 'react';

interface SkeletonProps {
  className?: string;
  lines?: number;
  avatar?: boolean;
  card?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  lines = 1,
  avatar = false,
  card = false,
}) => {
  if (card) {
    return (
      <div className={`card w-96 bg-base-100 shadow-xl ${className}`}>
        <figure className="skeleton h-48"></figure>
        <div className="card-body">
          <div className="skeleton h-4 w-full mb-2"></div>
          <div className="skeleton h-4 w-3/4"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {avatar && (
        <div className="flex items-center space-x-3">
          <div className="skeleton w-16 h-16 rounded-full shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-3/4"></div>
          </div>
        </div>
      )}
      {Array.from({ length: lines }, (_, index) => (
        <div key={index} className="skeleton h-4 w-full"></div>
      ))}
    </div>
  );
};