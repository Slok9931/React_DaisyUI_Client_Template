import React from 'react';

type BadgeVariant = 'neutral' | 'primary' | 'secondary' | 'accent' | 'ghost' | 'info' | 'success' | 'warning' | 'error';
type BadgeSize = 'xs' | 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  outline?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  outline = false,
  className = '',
}) => {
  const classes = [
    'badge',
    `badge-${variant}`,
    `badge-${size}`,
    outline && 'badge-outline',
    className
  ].filter(Boolean).join(' ');

  return <div className={classes}>{children}</div>;
};