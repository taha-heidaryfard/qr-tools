'use client';

import React from 'react';
import { Mail } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { EmailData } from '@/types/qr';

interface EmailFormProps {
  data: EmailData;
  onChange: (data: EmailData) => void;
}

export function EmailForm({ data, onChange }: EmailFormProps) {
  const { t } = useI18n();

  const update = (patch: Partial<EmailData>) => {
    onChange({ ...data, ...patch });
  };

  return (
    <div className="space-y-3.5">
      <div className="space-y-1.5">
        <label htmlFor="email-to" className="text-sm font-bold text-slate-800 dark:text-zinc-200">
          {t.forms.toLabel} <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-400 dark:text-zinc-500">
            <Mail className="w-4 h-4" />
          </div>
          <input
            id="email-to"
            type="email"
            dir="ltr"
            value={data.to}
            onChange={(e) => update({ to: e.target.value })}
            placeholder={t.forms.toPlaceholder}
            className="w-full rounded-2xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950/80 ps-10 pe-4 py-2.5 text-sm font-medium text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 transition-all shadow-inner"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email-subject" className="text-sm font-bold text-slate-800 dark:text-zinc-200">
          {t.forms.subjectLabel}
        </label>
        <input
          id="email-subject"
          type="text"
          value={data.subject}
          onChange={(e) => update({ subject: e.target.value })}
          placeholder={t.forms.subjectPlaceholder}
          className="w-full rounded-2xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950/80 px-4 py-2.5 text-sm font-medium text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 transition-all shadow-inner"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="email-body" className="text-sm font-bold text-slate-800 dark:text-zinc-200">
          {t.forms.bodyLabel}
        </label>
        <textarea
          id="email-body"
          rows={3}
          value={data.body}
          onChange={(e) => update({ body: e.target.value })}
          placeholder={t.forms.bodyPlaceholder}
          className="w-full rounded-2xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950/80 p-3 text-sm font-medium text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 transition-all resize-none shadow-inner"
        />
      </div>
    </div>
  );
}
