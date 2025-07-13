import React from 'react';

type ProgressVariant = 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';

interface ProgressProps {
  value?: number;
  max?: number;
  variant?: ProgressVariant;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  variant = 'primary',
  className = '',
}) => {
  const classes = [
    'progress',
    `progress-${variant}`,
    'w-full',
    className
  ].filter(Boolean).join(' ');

  return <progress className={classes} value={value} max={max}></progress>;
};