import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  compact?: boolean;
  bordered?: boolean;
  imageFull?: boolean;
  glass?: boolean;
  side?: boolean;
}

interface CardTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface CardActionsProps {
  children: React.ReactNode;
  className?: string;
  justify?: 'start' | 'center' | 'end';
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  compact = false,
  bordered = false,
  imageFull = false,
  glass = false,
  side = false,
}) => {
  const classes = [
    'card',
    compact && 'card-compact',
    bordered && 'card-bordered',
    imageFull && 'image-full',
    glass && 'glass',
    side && 'card-side',
    'bg-base-100 shadow-xl',
    className
  ].filter(Boolean).join(' ');

  return <div className={classes}>{children}</div>;
};

export const CardTitle: React.FC<CardTitleProps> = ({ children, className = '' }) => (
  <h2 className={`card-title ${className}`}>{children}</h2>
);

export const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => (
  <div className={`card-body ${className}`}>{children}</div>
);

export const CardActions: React.FC<CardActionsProps> = ({ 
  children, 
  className = '', 
  justify = 'end' 
}) => (
  <div className={`card-actions justify-${justify} ${className}`}>
    {children}
  </div>
);