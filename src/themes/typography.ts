import type { TypographyConfig } from '@/types';

export const typography: TypographyConfig = {
  h1: {
    fontSize: '2.5rem',
    fontWeight: '700',
    lineHeight: '1.2'
  },
  h2: {
    fontSize: '2rem',
    fontWeight: '600',
    lineHeight: '1.3'
  },
  h3: {
    fontSize: '1.75rem',
    fontWeight: '600',
    lineHeight: '1.4'
  },
  h4: {
    fontSize: '1.5rem',
    fontWeight: '600',
    lineHeight: '1.4'
  },
  h5: {
    fontSize: '1.25rem',
    fontWeight: '500',
    lineHeight: '1.5'
  },
  h6: {
    fontSize: '1rem',
    fontWeight: '500',
    lineHeight: '1.5'
  },
  body1: {
    fontSize: '1rem',
    fontWeight: '400',
    lineHeight: '1.6'
  },
  body2: {
    fontSize: '0.875rem',
    fontWeight: '400',
    lineHeight: '1.6'
  },
  caption: {
    fontSize: '0.75rem',
    fontWeight: '400',
    lineHeight: '1.4'
  },
  div: {
    fontSize: '1rem',
    fontWeight: '400',
    lineHeight: '1.6'
  },
  span: {
    fontSize: '1rem',
    fontWeight: '400',
    lineHeight: '1.6'
  }
};

export const typographyClasses = {
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