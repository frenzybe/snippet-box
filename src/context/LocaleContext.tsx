import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { en } from '../locales/en';
import { ru } from '../locales/ru';
import { Translations } from '../locales/en';

export type Locale = 'en' | 'ru';

const locales: Record<Locale, Translations> = { en, ru };

interface LocaleContextType {
  locale: Locale;
  t: Translations;
  setLocale: (l: Locale) => void;
}

const LocaleContext = createContext<LocaleContextType>({
  locale: 'en',
  t: en,
  setLocale: () => { },
});

export function LocaleProvider({
  children,
  initialLocale = 'en',
  onLocaleChange,
}: {
  children: ReactNode;
  initialLocale?: Locale;
  onLocaleChange?: (l: Locale) => void;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    onLocaleChange?.(l);
  };

  useEffect(() => {
    setLocaleState(initialLocale);
  }, [initialLocale]);

  return (
    <LocaleContext.Provider value={{ locale, t: locales[locale], setLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
