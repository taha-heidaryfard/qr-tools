'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations } from '@/lib/i18n';
import { Locale, Translations } from '@/types/i18n';

interface I18nContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Translations;
  isRtl: boolean;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = 'qr_tools_locale';

function getInitialLocale(): Locale {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (saved === 'fa' || saved === 'en') {
        return saved;
      }
    } catch {
      // Ignore
    }
  }
  return 'fa';
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem(STORAGE_KEY, newLocale);
    } catch {
      // Ignore
    }
  };

  const isRtl = locale === 'fa';

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = locale;
      document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    }
  }, [locale, isRtl]);

  const value: I18nContextValue = {
    locale,
    setLocale,
    t: translations[locale],
    isRtl,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
