'use client';

import React from 'react';
import { Globe, Link as LinkIcon } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

interface UrlFormProps {
  value: string;
  onChange: (val: string) => void;
}

export function UrlForm({ value, onChange }: UrlFormProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-2">
      <label htmlFor="url-input" className="text-sm font-bold text-slate-800 dark:text-zinc-200">
        {t.forms.urlLabel}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-400 dark:text-zinc-500">
          <Globe className="w-4 h-4" />
        </div>
        <input
          id="url-input"
          type="url"
          dir="ltr"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t.forms.urlPlaceholder}
          className="w-full rounded-2xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950/80 ps-10 pe-4 py-3 text-sm font-medium text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 transition-all shadow-inner"
        />
      </div>
      <p className="text-xs text-slate-500 dark:text-zinc-400 font-medium flex items-center gap-1">
        <LinkIcon className="w-3.5 h-3.5 text-indigo-500" />
        https://
      </p>
    </div>
  );
}
