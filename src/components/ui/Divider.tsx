import React from 'react';

type DividerOrientation = 'horizontal' | 'vertical';

interface DividerProps {
  children?: React.ReactNode;
  orientation?: DividerOrientation;
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({
  children,
  orientation = 'horizontal',
  className = '',
}) => {
  const classes = [
    'divider',
    orientation === 'vertical' && 'divider-horizontal',
    className
  ].filter(Boolean).join(' ');

  return <div className={classes}>{children}</div>;
};