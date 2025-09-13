import { useState, useEffect } from "react";

type Theme = "light" | "dark" | "system";

interface ThemeState {
  theme: Theme;
  resolvedTheme: "light" | "dark";
}

export function useTheme() {
  const [themeState, setThemeState] = useState<ThemeState>(() => {
    // Initialize from localStorage or default to system
    const savedTheme = localStorage.getItem("theme") as Theme;
    const initialTheme = savedTheme || "system";

    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const resolvedTheme =
      initialTheme === "system"
        ? systemPrefersDark
          ? "dark"
          : "light"
        : initialTheme;

    return {
      theme: initialTheme,
      resolvedTheme,
    };
  });

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    // Remove existing theme classes
    root.classList.remove("light", "dark");

    // Add current theme class
    root.classList.add(themeState.resolvedTheme);

    // Update data attribute for CSS selectors
    root.setAttribute("data-theme", themeState.resolvedTheme);

    // Store in localStorage
    localStorage.setItem("theme", themeState.theme);
  }, [themeState]);

  // Listen for system theme changes
  useEffect(() => {
    if (themeState.theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      setThemeState((prev) => ({
        ...prev,
        resolvedTheme: e.matches ? "dark" : "light",
      }));
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [themeState.theme]);

  const setTheme = (newTheme: Theme) => {
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const resolvedTheme =
      newTheme === "system" ? (systemPrefersDark ? "dark" : "light") : newTheme;

    setThemeState({
      theme: newTheme,
      resolvedTheme,
    });
  };

  const toggleTheme = () => {
    const currentResolved = themeState.resolvedTheme;
    const newTheme = currentResolved === "light" ? "dark" : "light";
    setTheme(newTheme);
  };

  const cycleTheme = () => {
    const themeOrder: Theme[] = ["light", "dark", "system"];
    const currentIndex = themeOrder.indexOf(themeState.theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };

  const getSystemTheme = () => {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  return {
    theme: themeState.theme,
    resolvedTheme: themeState.resolvedTheme,
    setTheme,
    toggleTheme,
    cycleTheme,
    getSystemTheme,
    isLight: themeState.resolvedTheme === "light",
    isDark: themeState.resolvedTheme === "dark",
    isSystem: themeState.theme === "system",
  };
}
