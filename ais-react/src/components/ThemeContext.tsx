import { useEffect, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { ThemeContext, type Theme } from '../hooks/useTheme';

const STORAGE_KEY = 'ais-theme';
// Tracks whether the THEME was picked explicitly via the toggle, as opposed
// to merely resolved from the OS preference and cached by the sync effect
// below. Without this distinction, the "auto-follow OS" listener would stop
// working after the very first render, since that effect writes STORAGE_KEY
// on every mount regardless of how the theme was determined.
const EXPLICIT_KEY = 'ais-theme-explicit';

function getInitialTheme(): Theme {
  // Check localStorage first
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'dark' || stored === 'light') return stored;

  // Fall back to system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';

  return 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  // Apply dark class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => {
      // Only auto-switch if the user hasn't explicitly picked a theme
      if (localStorage.getItem(EXPLICIT_KEY) !== '1') {
        setThemeState(e.matches ? 'dark' : 'light');
      }
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const toggleTheme = useCallback(() => {
    localStorage.setItem(EXPLICIT_KEY, '1');
    setThemeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const setTheme = useCallback((t: Theme) => {
    localStorage.setItem(EXPLICIT_KEY, '1');
    setThemeState(t);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
