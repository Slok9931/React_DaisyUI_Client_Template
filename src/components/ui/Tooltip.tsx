import React from 'react';

type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';
type TooltipVariant = 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';

interface TooltipProps {
  children: React.ReactNode;
  tip: string;
  position?: TooltipPosition;
  variant?: TooltipVariant;
  open?: boolean;
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  tip,
  position = 'top',
  variant,
  open = false,
  className = '',
}) => {
  const classes = [
    'tooltip',
    `tooltip-${position}`,
    variant && `tooltip-${variant}`,
    open && 'tooltip-open',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} data-tip={tip}>
      {children}
    </div>
  );
};