import { createContext } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
}

interface ThemeContextType extends ThemeState {
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  cycleTheme: () => void;
  getSystemTheme: () => 'light' | 'dark';
  isLight: boolean;
  isDark: boolean;
  isSystem: boolean;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export type { Theme, ThemeState, ThemeContextType };