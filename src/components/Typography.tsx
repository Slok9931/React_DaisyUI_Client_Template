import React, { type JSX } from 'react';
import { useTypographyStore } from '@/store';

interface TypographyProps {
  variant: keyof typeof import('@/themes/typography').typographyClasses;
  children: React.ReactNode;
  className?: string;
  component?: keyof JSX.IntrinsicElements;
}

export const Typography: React.FC<TypographyProps> = ({ 
  variant, 
  children, 
  className = '', 
  component 
}) => {
  const { customTypographyClasses } = useTypographyStore();
  const Component = component || getDefaultComponent(variant);
  
  // Combine the custom typography class with additional classes
  const classes = `${customTypographyClasses[variant] || typographyClasses[variant]} ${className}`;

  return React.createElement(Component, { className: classes }, children);
};

// Fallback to default classes if custom ones aren't available
const typographyClasses = {
  h1: 'text-4xl font-bold leading-tight',
  h2: 'text-3xl font-semibold leading-snug',
  h3: 'text-2xl font-semibold leading-normal',
  h4: 'text-xl font-semibold leading-normal',
  h5: 'text-lg font-medium leading-relaxed',
  h6: 'text-base font-medium leading-relaxed',
  body1: 'text-base font-normal leading-relaxed',
  body2: 'text-sm font-normal leading-relaxed',
  caption: 'text-xs font-normal leading-snug',
  div: 'text-base font-normal leading-relaxed',
  span: 'text-base font-normal leading-relaxed'
};

const getDefaultComponent = (variant: string): keyof JSX.IntrinsicElements => {
  const componentMap: Record<string, keyof JSX.IntrinsicElements> = {
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4',
    h5: 'h5',
    h6: 'h6',
    body1: 'p',
    body2: 'p',
    span: 'span',
    div: 'div',
    caption: 'p'
  };
  
  return componentMap[variant] || 'div';
};