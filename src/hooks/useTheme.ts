import { applyTheme, getCurrentTheme, themes } from '@/themes';
import { Theme } from '@/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  currentTheme: Theme;
  themes: Theme[];
  changeTheme: (themeName: string) => void;
}

export const useTheme = create<ThemeState>()(
  persist(
    (set) => ({
      currentTheme: getCurrentTheme(),
      themes: themes,
      changeTheme: (themeName: string) => {
        const theme = themes.find(t => t.name === themeName);
        if (theme) {
          applyTheme(theme.name);
          set({ currentTheme: theme });
        }
      },
    }),
    {
      name: 'infinity-theme-store',
      onRehydrateStorage: () => (state) => {
        if (state?.currentTheme) {
          applyTheme(state.currentTheme.name);
        }
      },
    }
  )
);