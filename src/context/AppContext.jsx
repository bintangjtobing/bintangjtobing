import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { i18n } from '../i18n';
import { trackThemeToggle, trackLanguageSwitch } from '../utils/tracking';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [lang, setLangState] = useState(() => localStorage.getItem('lang') || 'en');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
  }, [lang]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      trackThemeToggle(next);
      return next;
    });
  }, []);

  const setLang = useCallback((newLang) => {
    setLangState(newLang);
    trackLanguageSwitch(newLang);
  }, []);

  const t = useCallback((key) => {
    return i18n[lang]?.[key] || i18n.en[key] || key;
  }, [lang]);

  return (
    <AppContext.Provider value={{ theme, toggleTheme, lang, setLang, t }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
