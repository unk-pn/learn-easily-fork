import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'midnight' | 'daylight';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'midnight',
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'midnight';
    const saved = localStorage.getItem('le-theme');
    return saved === 'daylight' ? 'daylight' : 'midnight';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('le-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'midnight' ? 'daylight' : 'midnight'));

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  return useContext(ThemeContext);
}
