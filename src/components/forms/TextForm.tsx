'use client';

import React from 'react';
import { useI18n } from '@/context/I18nContext';

interface TextFormProps {
  value: string;
  onChange: (val: string) => void;
}

export function TextForm({ value, onChange }: TextFormProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor="text-input" className="text-sm font-bold text-slate-800 dark:text-zinc-200">
          {t.forms.textLabel}
        </label>
        <span className="text-xs font-mono font-semibold text-slate-500 dark:text-zinc-400 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
          {value.length} {t.customizer.qrSize ? 'chars' : ''}
        </span>
      </div>
      <textarea
        id="text-input"
        rows={4}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t.forms.textPlaceholder}
        className="w-full rounded-2xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950/80 p-3.5 text-sm font-medium text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 transition-all resize-none shadow-inner"
      />
    </div>
  );
}
