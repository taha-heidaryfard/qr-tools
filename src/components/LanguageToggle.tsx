'use client';

import React from 'react';
import { Languages } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

export function LanguageToggle() {
  const { locale, setLocale, t } = useI18n();

  const toggle = () => {
    setLocale(locale === 'fa' ? 'en' : 'fa');
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex items-center gap-1.5 h-9 px-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all active:scale-95 shadow-2xs"
      title={t.app.switchLang}
    >
      <Languages className="w-3.5 h-3.5 text-indigo-500" />
      <span>{locale === 'fa' ? 'English' : 'فارسی'}</span>
    </button>
  );
}
