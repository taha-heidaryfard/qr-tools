'use client';

import React from 'react';
import { Phone } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { PhoneData } from '@/types/qr';

interface PhoneFormProps {
  data: PhoneData;
  onChange: (data: PhoneData) => void;
}

export function PhoneForm({ data, onChange }: PhoneFormProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-2">
      <label htmlFor="phone-input" className="text-sm font-bold text-slate-800 dark:text-zinc-200">
        {t.forms.phoneLabel} <span className="text-rose-500">*</span>
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-400 dark:text-zinc-500">
          <Phone className="w-4 h-4" />
        </div>
        <input
          id="phone-input"
          type="tel"
          dir="ltr"
          value={data.phone}
          onChange={(e) => onChange({ phone: e.target.value })}
          placeholder={t.forms.phonePlaceholder}
          className="w-full rounded-2xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950/80 ps-10 pe-4 py-2.5 text-sm font-medium text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 transition-all shadow-inner"
        />
      </div>
    </div>
  );
}
