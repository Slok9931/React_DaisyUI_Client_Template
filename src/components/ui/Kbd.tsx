import React from 'react';

type KbdSize = 'xs' | 'sm' | 'md' | 'lg';

interface KbdProps {
  children: React.ReactNode;
  size?: KbdSize;
  className?: string;
}

export const Kbd: React.FC<KbdProps> = ({
  children,
  size = 'md',
  className = '',
}) => {
  const kbdClasses = [
    'kbd',
    `kbd-${size}`,
    className
  ].filter(Boolean).join(' ');

  return <kbd className={kbdClasses}>{children}</kbd>;
};