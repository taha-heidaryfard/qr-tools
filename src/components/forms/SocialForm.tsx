'use client';

import React from 'react';
import { useI18n } from '@/context/I18nContext';
import { SocialData, SocialPlatform } from '@/types/qr';

interface SocialFormProps {
  data: SocialData;
  onChange: (data: SocialData) => void;
}

const PLATFORMS: { id: SocialPlatform; label: string; prefix: string; placeholder: string }[] = [
  { id: 'telegram', label: 'Telegram', prefix: 't.me/', placeholder: 'username' },
  { id: 'whatsapp', label: 'WhatsApp', prefix: 'wa.me/', placeholder: '+989120000000' },
  { id: 'instagram', label: 'Instagram', prefix: 'instagram.com/', placeholder: 'username' },
  { id: 'twitter', label: 'X (Twitter)', prefix: 'x.com/', placeholder: 'username' },
  { id: 'github', label: 'GitHub', prefix: 'github.com/', placeholder: 'username' },
  { id: 'linkedin', label: 'LinkedIn', prefix: 'linkedin.com/in/', placeholder: 'username' },
  { id: 'youtube', label: 'YouTube', prefix: 'youtube.com/@', placeholder: 'channel' },
  { id: 'facebook', label: 'Facebook', prefix: 'facebook.com/', placeholder: 'username' },
];

export function SocialForm({ data, onChange }: SocialFormProps) {
  const { t } = useI18n();
  const currentPlatform = PLATFORMS.find((p) => p.id === data.platform) || PLATFORMS[0];

  return (
    <div className="space-y-4">
      {/* Platform selector */}
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-slate-800 dark:text-zinc-200">
          {t.forms.platform}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PLATFORMS.map((platform) => (
            <button
              key={platform.id}
              type="button"
              onClick={() => onChange({ ...data, platform: platform.id })}
              className={`py-2 px-3 text-xs font-bold rounded-2xl border text-center transition-all active:scale-95 ${
                data.platform === platform.id
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30'
                  : 'bg-slate-50 dark:bg-zinc-950/80 border-slate-300 dark:border-zinc-750 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:border-slate-400'
              }`}
            >
              {platform.label}
            </button>
          ))}
        </div>
      </div>

      {/* Username / handle */}
      <div className="space-y-1.5">
        <label htmlFor="social-user" className="text-sm font-bold text-slate-800 dark:text-zinc-200">
          {t.forms.username} <span className="text-rose-500">*</span>
        </label>
        <div className="flex rounded-2xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950/80 overflow-hidden shadow-inner focus-within:bg-white dark:focus-within:bg-zinc-900 focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-500/15">
          <span
            dir="ltr"
            className="px-3.5 py-2.5 text-xs font-semibold text-slate-500 dark:text-zinc-400 bg-slate-200/80 dark:bg-zinc-900 border-e border-slate-300 dark:border-zinc-700 flex items-center select-none"
          >
            {currentPlatform.prefix}
          </span>
          <input
            id="social-user"
            type="text"
            dir="ltr"
            value={data.username}
            onChange={(e) => onChange({ ...data, username: e.target.value })}
            placeholder={currentPlatform.placeholder}
            className="flex-1 bg-transparent px-3 py-2.5 text-sm font-medium text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
}
