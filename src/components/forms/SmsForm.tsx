'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { SmsData } from '@/types/qr';

interface SmsFormProps {
  data: SmsData;
  onChange: (data: SmsData) => void;
}

export function SmsForm({ data, onChange }: SmsFormProps) {
  const { t } = useI18n();

  return (
    <div className="space-y-3.5">
      <div className="space-y-1.5">
        <label htmlFor="sms-phone" className="text-sm font-bold text-slate-800 dark:text-zinc-200">
          {t.forms.phoneLabel} <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-400 dark:text-zinc-500">
            <MessageSquare className="w-4 h-4" />
          </div>
          <input
            id="sms-phone"
            type="tel"
            dir="ltr"
            value={data.phone}
            onChange={(e) => onChange({ ...data, phone: e.target.value })}
            placeholder={t.forms.phonePlaceholder}
            className="w-full rounded-2xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950/80 ps-10 pe-4 py-2.5 text-sm font-medium text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 transition-all shadow-inner"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="sms-message" className="text-sm font-bold text-slate-800 dark:text-zinc-200">
          {t.forms.messageLabel}
        </label>
        <textarea
          id="sms-message"
          rows={3}
          value={data.message}
          onChange={(e) => onChange({ ...data, message: e.target.value })}
          placeholder={t.forms.messagePlaceholder}
          className="w-full rounded-2xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950/80 p-3 text-sm font-medium text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 transition-all resize-none shadow-inner"
        />
      </div>
    </div>
  );
}
