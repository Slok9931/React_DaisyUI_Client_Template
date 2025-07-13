import React from 'react';

type LoadingSize = 'xs' | 'sm' | 'md' | 'lg';

interface LoadingProps {
  size?: LoadingSize;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  className = '',
}) => {
  const classes = [
    'loading',
    `loading-infinity`,
    `loading-${size}`,
    className
  ].filter(Boolean).join(' ');

  return <span className={classes}></span>;
};