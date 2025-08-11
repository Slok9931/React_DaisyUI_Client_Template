import * as LucideIcons from 'lucide-react';
import React from 'react';

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const getIconComponent = (iconName: string, size: number = 20) => {
  const Icon = (LucideIcons as any)[iconName];
  const IconComponent = Icon as React.ComponentType<{ size?: number }>;
  return React.createElement(IconComponent, { size });
};