import React from 'react';
import { useTheme } from '@/hooks';

interface InfinityLogoProps {
  size?: number;
  className?: string;
}

export const InfinityLogo: React.FC<InfinityLogoProps> = ({ 
  size = 120, 
  className = '' 
}) => {
  const { currentTheme } = useTheme();
  const logoSrc = currentTheme.isDark ? '/InfinityWhite.svg' : '/InfinityBlack.svg';
  
  return (
    <img
      src={logoSrc}
      alt="Infinity Logo"
      className={`${className}`}
      style={{ width: size, height: size }}
    />
  );
};