/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import {
  Camera,
  Heart,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { LanguageToggle } from './LanguageToggle';
import { ThemeToggle } from './ThemeToggle';

export type MainTab = 'generate' | 'batch' | 'scan';

interface HeaderProps {
  activeTab: MainTab;
  onTabChange: (tab: MainTab) => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const { t, locale } = useI18n();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-zinc-800 bg-white/95 dark:bg-[#0e131f]/95 backdrop-blur-xl transition-colors print:hidden shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl overflow-hidden border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 shadow-md shadow-indigo-600/10 flex items-center justify-center transition-all hover:scale-105 active:scale-95 shrink-0">
              <img
                src={`${basePath}/logo.png`}
                alt="QR Tools Logo"
                className="w-full h-full object-contain p-1"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-base sm:text-xl tracking-tight text-slate-900 dark:text-white">
                  QR Tools
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-medium hidden sm:block">
                {locale === 'fa' ? 'موتور پردازش محلی مرورگر' : '100% Client-Side Engine'}
              </p>
            </div>
          </div>

          {/* Center Navigation Tabs (Pill style with crisp contrast) */}
          <nav
            role="tablist"
            aria-label="Main Navigation"
            className="flex items-center p-1 sm:p-1.5 rounded-2xl bg-slate-200/80 dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 shadow-inner"
          >
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'generate'}
              onClick={() => onTabChange('generate')}
              className={`flex items-center gap-2 px-3 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 active:scale-95 ${
                activeTab === 'generate'
                  ? 'bg-white dark:bg-zinc-850 text-indigo-700 dark:text-indigo-300 shadow-sm border border-slate-300/80 dark:border-zinc-700'
                  : 'text-slate-700 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-300/60 dark:hover:bg-zinc-850/60'
              }`}
            >
              <Sparkles className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
              <span>{t.nav.generate}</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'batch'}
              onClick={() => onTabChange('batch')}
              className={`flex items-center gap-2 px-3 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 active:scale-95 ${
                activeTab === 'batch'
                  ? 'bg-white dark:bg-zinc-850 text-indigo-700 dark:text-indigo-300 shadow-sm border border-slate-300/80 dark:border-zinc-700'
                  : 'text-slate-700 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-300/60 dark:hover:bg-zinc-850/60'
              }`}
            >
              <Layers className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
              <span>{t.nav.batch}</span>
            </button>

            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'scan'}
              onClick={() => onTabChange('scan')}
              className={`flex items-center gap-2 px-3 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 active:scale-95 ${
                activeTab === 'scan'
                  ? 'bg-white dark:bg-zinc-850 text-indigo-700 dark:text-indigo-300 shadow-sm border border-slate-300/80 dark:border-zinc-700'
                  : 'text-slate-700 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-300/60 dark:hover:bg-zinc-850/60'
              }`}
            >
              <Camera className="w-4 h-4 shrink-0 text-indigo-600 dark:text-indigo-400" />
              <span>{t.nav.scan}</span>
            </button>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            <a
              href="https://reymit.ir/taxtander"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 py-1.5 px-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-300 dark:border-rose-800/80 text-rose-700 dark:text-rose-300 font-bold text-xs transition-all active:scale-95 shadow-2xs"
              title={locale === 'fa' ? 'حمایت از این پروژه' : 'Support this Project'}
            >
              <Heart className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 fill-rose-600 dark:fill-rose-400" />
              <span className="hidden sm:inline">{locale === 'fa' ? 'حمایت' : 'Support'}</span>
            </a>
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
