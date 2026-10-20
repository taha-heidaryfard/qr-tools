'use client';

import React from 'react';
import { useI18n } from '@/context/I18nContext';
import { VCardData } from '@/types/qr';

interface VCardFormProps {
  data: VCardData;
  onChange: (data: VCardData) => void;
}

export function VCardForm({ data, onChange }: VCardFormProps) {
  const { t } = useI18n();

  const update = (patch: Partial<VCardData>) => {
    onChange({ ...data, ...patch });
  };

  return (
    <div className="space-y-3.5">
      {/* Name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-800 dark:text-zinc-200">
            {t.forms.firstName} <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={data.firstName}
            onChange={(e) => update({ firstName: e.target.value })}
            placeholder={t.forms.firstName}
            className="w-full rounded-2xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950/80 px-3.5 py-2 text-sm font-medium text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 transition-all shadow-inner"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-800 dark:text-zinc-200">
            {t.forms.lastName}
          </label>
          <input
            type="text"
            value={data.lastName}
            onChange={(e) => update({ lastName: e.target.value })}
            placeholder={t.forms.lastName}
            className="w-full rounded-2xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950/80 px-3.5 py-2 text-sm font-medium text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Org and Job title */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-800 dark:text-zinc-200">
            {t.forms.org}
          </label>
          <input
            type="text"
            value={data.organization}
            onChange={(e) => update({ organization: e.target.value })}
            placeholder={t.forms.org}
            className="w-full rounded-2xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950/80 px-3.5 py-2 text-sm font-medium text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 transition-all shadow-inner"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-800 dark:text-zinc-200">
            {t.forms.jobTitle}
          </label>
          <input
            type="text"
            value={data.title}
            onChange={(e) => update({ title: e.target.value })}
            placeholder={t.forms.jobTitle}
            className="w-full rounded-2xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950/80 px-3.5 py-2 text-sm font-medium text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Phone numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-800 dark:text-zinc-200">
            {t.forms.mobilePhone}
          </label>
          <input
            type="tel"
            dir="ltr"
            value={data.cellPhone}
            onChange={(e) => update({ cellPhone: e.target.value })}
            placeholder="+98 912 000 0000"
            className="w-full rounded-2xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950/80 px-3.5 py-2 text-sm font-medium text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 transition-all shadow-inner"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-800 dark:text-zinc-200">
            {t.forms.workPhone}
          </label>
          <input
            type="tel"
            dir="ltr"
            value={data.phone}
            onChange={(e) => update({ phone: e.target.value })}
            placeholder="+98 21 0000 0000"
            className="w-full rounded-2xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950/80 px-3.5 py-2 text-sm font-medium text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Email & Website */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-800 dark:text-zinc-200">
            {t.forms.email}
          </label>
          <input
            type="email"
            dir="ltr"
            value={data.email}
            onChange={(e) => update({ email: e.target.value })}
            placeholder="user@example.com"
            className="w-full rounded-2xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950/80 px-3.5 py-2 text-sm font-medium text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 transition-all shadow-inner"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-800 dark:text-zinc-200">
            {t.forms.website}
          </label>
          <input
            type="url"
            dir="ltr"
            value={data.url}
            onChange={(e) => update({ url: e.target.value })}
            placeholder="https://example.com"
            className="w-full rounded-2xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950/80 px-3.5 py-2 text-sm font-medium text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Address */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="col-span-2 space-y-1">
          <label className="text-xs font-bold text-slate-800 dark:text-zinc-200">
            {t.forms.street}
          </label>
          <input
            type="text"
            value={data.street}
            onChange={(e) => update({ street: e.target.value })}
            placeholder={t.forms.street}
            className="w-full rounded-2xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950/80 px-3 py-2 text-xs font-medium text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:border-indigo-600 focus:outline-none transition-all shadow-inner"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-800 dark:text-zinc-200">
            {t.forms.city}
          </label>
          <input
            type="text"
            value={data.city}
            onChange={(e) => update({ city: e.target.value })}
            placeholder={t.forms.city}
            className="w-full rounded-2xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950/80 px-3 py-2 text-xs font-medium text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:border-indigo-600 focus:outline-none transition-all shadow-inner"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-bold text-slate-800 dark:text-zinc-200">
            {t.forms.country}
          </label>
          <input
            type="text"
            value={data.country}
            onChange={(e) => update({ country: e.target.value })}
            placeholder={t.forms.country}
            className="w-full rounded-2xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950/80 px-3 py-2 text-xs font-medium text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:border-indigo-600 focus:outline-none transition-all shadow-inner"
          />
        </div>
      </div>
    </div>
  );
}
