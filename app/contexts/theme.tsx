import React, { createContext, useMemo } from 'react';

interface ThemeInterface {
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const ThemeContext = createContext({} as ThemeInterface);

export function useThemeContext() {
  const context = React.useContext(ThemeContext);
  if (!context?.theme)
    throw Error('Must use Theme Context inside of Provider tree');
  return context;
}

export function ThemeContextProvider({
  children,
}: {
  children: React.ReactElement;
}) {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const toggleTheme = () =>
    setTheme((theme) => (theme === 'light' ? 'dark' : 'light'));
  const value = useMemo(() => ({ theme, toggleTheme }), [theme, toggleTheme]);
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
