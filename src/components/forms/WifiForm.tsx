'use client';

import React from 'react';
import { Eye, EyeOff, Lock, Wifi } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { WifiData, WifiEncryption } from '@/types/qr';

interface WifiFormProps {
  data: WifiData;
  onChange: (data: WifiData) => void;
}

export function WifiForm({ data, onChange }: WifiFormProps) {
  const { t } = useI18n();
  const [showPassword, setShowPassword] = React.useState(false);

  const update = (patch: Partial<WifiData>) => {
    onChange({ ...data, ...patch });
  };

  return (
    <div className="space-y-4">
      {/* SSID */}
      <div className="space-y-1.5">
        <label htmlFor="wifi-ssid" className="text-sm font-bold text-slate-800 dark:text-zinc-200">
          {t.forms.ssidLabel} <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-400 dark:text-zinc-500">
            <Wifi className="w-4 h-4" />
          </div>
          <input
            id="wifi-ssid"
            type="text"
            value={data.ssid}
            onChange={(e) => update({ ssid: e.target.value })}
            placeholder={t.forms.ssidPlaceholder}
            className="w-full rounded-2xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950/80 ps-10 pe-4 py-2.5 text-sm font-medium text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Encryption */}
      <div className="space-y-1.5">
        <label className="text-sm font-bold text-slate-800 dark:text-zinc-200">
          {t.forms.encryptionLabel}
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(['WPA', 'WEP', 'nopass'] as WifiEncryption[]).map((enc) => (
            <button
              key={enc}
              type="button"
              onClick={() => update({ encryption: enc })}
              className={`py-2 px-3 text-xs font-bold rounded-2xl border transition-all active:scale-95 ${
                data.encryption === enc
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/30'
                  : 'bg-slate-50 dark:bg-zinc-950/80 border-slate-300 dark:border-zinc-750 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:border-slate-400'
              }`}
            >
              {enc === 'WPA' ? 'WPA/WPA2/WPA3' : enc === 'WEP' ? 'WEP' : 'No Password'}
            </button>
          ))}
        </div>
      </div>

      {/* Password (if not nopass) */}
      {data.encryption !== 'nopass' && (
        <div className="space-y-1.5">
          <label htmlFor="wifi-pass" className="text-sm font-bold text-slate-800 dark:text-zinc-200">
            {t.forms.passwordLabel}
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3.5 pointer-events-none text-slate-400 dark:text-zinc-500">
              <Lock className="w-4 h-4" />
            </div>
            <input
              id="wifi-pass"
              type={showPassword ? 'text' : 'password'}
              dir="ltr"
              value={data.password}
              onChange={(e) => update({ password: e.target.value })}
              placeholder={t.forms.passwordPlaceholder}
              className="w-full rounded-2xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950/80 ps-10 pe-11 py-2.5 text-sm font-medium text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:bg-white dark:focus:bg-zinc-900 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 transition-all shadow-inner"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 end-0 flex items-center pe-3 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Hidden network checkbox */}
      <label className="flex items-center gap-2.5 cursor-pointer pt-1">
        <input
          type="checkbox"
          checked={data.hidden}
          onChange={(e) => update({ hidden: e.target.checked })}
          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-zinc-700 dark:bg-zinc-950"
        />
        <span className="text-sm font-semibold text-slate-700 dark:text-zinc-300 select-none">
          {t.forms.hiddenLabel}
        </span>
      </label>
    </div>
  );
}
