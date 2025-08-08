import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { typography, typographyClasses } from '@/themes/typography';
import type { TypographyCustomization, TypographyConfig } from '@/types/typography';

interface TypographyStore {
  customization: TypographyCustomization;
  customTypography: TypographyConfig;
  customTypographyClasses: Record<string, string>;
  
  // Actions
  updateCustomization: (updates: Partial<TypographyCustomization>) => void;
  resetCustomization: () => void;
  applyCustomization: () => void;
  
  // Font family presets
  fontFamilies: Array<{ name: string; value: string; preview: string }>;
  setFontFamily: (fontFamily: string) => void;
}

const defaultCustomization: TypographyCustomization = {
  fontFamily: 'Inter, system-ui, sans-serif',
  fontScale: 1,
  fontWeightScale: 1,
  lineHeightScale: 1,
  letterSpacing: 0,
  wordSpacing: 0,
};

const availableFontFamilies = [
  { name: 'Inter', value: 'Inter, system-ui, sans-serif', preview: 'Modern & Clean' },
  { name: 'Poppins', value: 'Poppins, system-ui, sans-serif', preview: 'Friendly & Rounded' },
  { name: 'Playfair Display', value: '"Playfair Display", serif', preview: 'Elegant & Serif' },
  { name: 'Fira Code', value: '"Fira Code", monospace', preview: 'Code & Monospace' },
  { name: 'Playwrite AU QLD', value: '"Playwrite AU QLD", cursive', preview: 'Playful & Cursive' },
];

export const useTypographyStore = create<TypographyStore>()(
  persist(
    (set, get) => ({
      customization: defaultCustomization,
      customTypography: typography as TypographyConfig,
      customTypographyClasses: { ...typographyClasses },
      fontFamilies: availableFontFamilies,

      updateCustomization: (updates) => {
        const newCustomization = { ...get().customization, ...updates };
        set({ customization: newCustomization });
        get().applyCustomization();
      },

      resetCustomization: () => {
        set({ customization: defaultCustomization });
        get().applyCustomization();
      },

      applyCustomization: () => {
        const { customization } = get();
        const newCustomTypography: TypographyConfig = {} as TypographyConfig;
        const newCustomTypographyClasses: Record<string, string> = {};

        // Apply to CSS custom properties first
        const root = document.documentElement;
        root.style.setProperty('--font-family-primary', customization.fontFamily);
        root.style.setProperty('--font-scale', customization.fontScale.toString());
        root.style.setProperty('--font-weight-scale', customization.fontWeightScale.toString());
        root.style.setProperty('--line-height-scale', customization.lineHeightScale.toString());
        root.style.setProperty('--letter-spacing', customization.letterSpacing === 0 ? 'normal' : `${customization.letterSpacing}em`);
        root.style.setProperty('--word-spacing', customization.wordSpacing === 0 ? 'normal' : `${customization.wordSpacing}em`);

        // Create custom typography classes that use CSS custom properties
        Object.entries(typography).forEach(([key, variant]) => {
          const typedKey = key as keyof typeof typography;
          
          // Create custom typography config
          newCustomTypography[typedKey] = {
            ...variant,
            fontFamily: customization.fontFamily,
            letterSpacing: customization.letterSpacing === 0 ? 'normal' : `${customization.letterSpacing}em`,
            wordSpacing: customization.wordSpacing === 0 ? 'normal' : `${customization.wordSpacing}em`,
          };

          // Create CSS classes that use our custom CSS classes
          newCustomTypographyClasses[typedKey] = `typography-custom-${key}`;
        });

        set({ 
          customTypography: newCustomTypography,
          customTypographyClasses: newCustomTypographyClasses 
        });
      },

      setFontFamily: (fontFamily) => {
        get().updateCustomization({ fontFamily });
      },
    }),
    {
      name: 'infinity-typography-store',
      onRehydrateStorage: () => (state) => {
        // Apply customization on app load
        if (state) {
          setTimeout(() => {
            state.applyCustomization();
          }, 100);
        }
      },
    }
  )
);