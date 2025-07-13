import React from 'react';

type RadialProgressSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type RadialProgressVariant = 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';

interface RadialProgressProps {
  value: number;
  max?: number;
  size?: RadialProgressSize;
  variant?: RadialProgressVariant;
  thickness?: string;
  showValue?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const RadialProgress: React.FC<RadialProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'primary',
  thickness = '2px',
  showValue = true,
  className = '',
  children,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const sizeClasses = {
    xs: 'w-8 h-8 text-xs',
    sm: 'w-12 h-12 text-sm',
    md: 'w-16 h-16 text-base',
    lg: 'w-20 h-20 text-lg',
    xl: 'w-24 h-24 text-xl',
  };

  const progressClasses = [
    'radial-progress',
    `text-${variant}`,
    sizeClasses[size],
    className
  ].filter(Boolean).join(' ');

  const style = {
    '--value': percentage,
    '--size': sizeClasses[size].split(' ')[0].replace('w-', '').replace('h-', '') + 'rem',
    '--thickness': thickness,
  } as React.CSSProperties;

  return (
    <div className={progressClasses} style={style} role="progressbar">
      {children || (showValue && `${Math.round(percentage)}%`)}
    </div>
  );
};