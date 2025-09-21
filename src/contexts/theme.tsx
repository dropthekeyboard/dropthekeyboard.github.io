import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import {
  ThemeContext,
  type Theme,
  type ThemeState,
  type ThemeContextType,
} from './themeContext';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [themeState, setThemeState] = useState<ThemeState>(() => {
    // Initialize from localStorage or default to system
    const savedTheme = localStorage.getItem('theme') as Theme;
    const initialTheme = savedTheme || 'system';

    const systemPrefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    const resolvedTheme =
      initialTheme === 'system'
        ? systemPrefersDark
          ? 'dark'
          : 'light'
        : initialTheme;

    return {
      theme: initialTheme,
      resolvedTheme,
    };
  });

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    // Only toggle the 'dark' class. Tailwind and our CSS expect '.dark' to be present for dark mode.
    if (themeState.resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Update data attribute for CSS selectors (keeps compatibility with other code)
    root.setAttribute('data-theme', themeState.resolvedTheme);

    // Store user preference in localStorage
    localStorage.setItem('theme', themeState.theme);
  }, [themeState]);

  // Listen for system theme changes
  useEffect(() => {
    if (themeState.theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      setThemeState((prev) => ({
        ...prev,
        resolvedTheme: e.matches ? 'dark' : 'light',
      }));
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeState.theme]);

  // Listen for theme changes dispatched globally (to sync multiple hook instances)
  useEffect(() => {
    const onThemeChange = (e: Event) => {
      // Prefer detail.theme if provided, otherwise read from localStorage
      const custom = e as CustomEvent<Record<string, unknown>>;
      const detailTheme = custom?.detail?.theme as Theme | undefined;
      const stored = localStorage.getItem('theme') as Theme | null;
      const savedTheme: Theme =
        (detailTheme as Theme) || (stored as Theme) || 'system';

      // Compute resolved theme (must be 'light' or 'dark')
      const systemPrefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
      ).matches;
      const resolvedTheme: 'light' | 'dark' =
        savedTheme === 'system'
          ? systemPrefersDark
            ? 'dark'
            : 'light'
          : (savedTheme as 'light' | 'dark');

      setThemeState((prev) => ({ ...prev, theme: savedTheme, resolvedTheme }));
    };

    const onStorage = (e: StorageEvent) => {
      if (e.key === 'theme') {
        onThemeChange(
          new CustomEvent('theme-change', { detail: { theme: e.newValue } })
        );
      }
    };

    window.addEventListener('theme-change', onThemeChange as EventListener);
    window.addEventListener('storage', onStorage as EventListener);

    return () => {
      window.removeEventListener(
        'theme-change',
        onThemeChange as EventListener
      );
      window.removeEventListener('storage', onStorage as EventListener);
    };
  }, []);

  const setTheme = (newTheme: Theme) => {
    const systemPrefersDark = window.matchMedia(
      '(prefers-color-scheme: dark)'
    ).matches;
    const resolvedTheme =
      newTheme === 'system' ? (systemPrefersDark ? 'dark' : 'light') : newTheme;

    setThemeState({
      theme: newTheme,
      resolvedTheme,
    });

    // Persist and notify other hook instances in the same window and other tabs
    localStorage.setItem('theme', newTheme);
    window.dispatchEvent(
      new CustomEvent('theme-change', { detail: { theme: newTheme } })
    );
  };

  const toggleTheme = () => {
    const currentResolved = themeState.resolvedTheme;
    const newTheme = currentResolved === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const cycleTheme = () => {
    const themeOrder: Theme[] = ['light', 'dark', 'system'];
    const currentIndex = themeOrder.indexOf(themeState.theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };

  const getSystemTheme = () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  };

  const contextValue: ThemeContextType = {
    ...themeState,
    setTheme,
    toggleTheme,
    cycleTheme,
    getSystemTheme,
    isLight: themeState.resolvedTheme === 'light',
    isDark: themeState.resolvedTheme === 'dark',
    isSystem: themeState.theme === 'system',
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}
