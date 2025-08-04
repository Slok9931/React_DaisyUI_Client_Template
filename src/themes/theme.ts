import type { Theme } from '@/types';

export const themes: Theme[] = [
  { name: 'light', displayName: 'Light', isDark: false },
  { name: 'dark', displayName: 'Dark', isDark: true },
  { name: 'cupcake', displayName: 'Cupcake', isDark: false },
  { name: 'bumblebee', displayName: 'Bumblebee', isDark: false },
  { name: 'emerald', displayName: 'Emerald', isDark: false },
  { name: 'corporate', displayName: 'Corporate', isDark: false },
  { name: 'synthwave', displayName: 'Synthwave', isDark: true },
  { name: 'retro', displayName: 'Retro', isDark: false },
  { name: 'cyberpunk', displayName: 'Cyberpunk', isDark: false },
  { name: 'valentine', displayName: 'Valentine', isDark: false },
  { name: 'halloween', displayName: 'Halloween', isDark: true },
  { name: 'garden', displayName: 'Garden', isDark: false },
  { name: 'forest', displayName: 'Forest', isDark: true },
  { name: 'aqua', displayName: 'Aqua', isDark: true },
  { name: 'lofi', displayName: 'Lo-Fi', isDark: false },
  { name: 'pastel', displayName: 'Pastel', isDark: false },
  { name: 'fantasy', displayName: 'Fantasy', isDark: false },
  { name: 'wireframe', displayName: 'Wireframe', isDark: false },
  { name: 'black', displayName: 'Black', isDark: true },
  { name: 'luxury', displayName: 'Luxury', isDark: true },
  { name: 'dracula', displayName: 'Dracula', isDark: true },
  { name: 'cmyk', displayName: 'CMYK', isDark: false },
  { name: 'autumn', displayName: 'Autumn', isDark: false },
  { name: 'business', displayName: 'Business', isDark: true },
  { name: 'acid', displayName: 'Acid', isDark: false },
  { name: 'lemonade', displayName: 'Lemonade', isDark: false },
  { name: 'night', displayName: 'Night', isDark: true },
  { name: 'coffee', displayName: 'Coffee', isDark: true },
  { name: 'winter', displayName: 'Winter', isDark: false },
  { name: 'dim', displayName: 'Dim', isDark: true },
  { name: 'nord', displayName: 'Nord', isDark: false },
  { name: 'sunset', displayName: 'Sunset', isDark: true },
  { name: 'caramellete', displayName: 'Caramellete', isDark: false },
  { name: 'abyss', displayName: 'Abyss', isDark: true },
  { name: 'silk', displayName: 'Silk', isDark: false },
];

export const applyTheme = (themeName: string): void => {
  document.documentElement.setAttribute('data-theme', themeName);
  localStorage.setItem('theme', themeName);
};

export const getStoredTheme = (): string => {
  return localStorage.getItem('theme') || 'dark';
};

export const getCurrentTheme = (): Theme => {
  const storedTheme = getStoredTheme();
  return themes.find(theme => theme.name === storedTheme) || themes[0];
};