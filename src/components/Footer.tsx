'use client';

import React, { useEffect, useState } from 'react';
import { Download, Heart } from 'lucide-react';
import { useI18n } from '@/context/I18nContext';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function Footer() {
  const { t, locale } = useI18n();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  return (
    <footer className="w-full border-t border-slate-300/80 dark:border-zinc-800 bg-white/70 dark:bg-zinc-950/70 py-6 px-4 sm:px-6 lg:px-8 print:hidden transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-slate-600 dark:text-zinc-400">
        {/* Developer attribution */}
        <div className="flex items-center gap-1.5 text-center sm:text-start">
          <span>{locale === 'fa' ? 'توسعه داده شده توسط' : 'Developed by'}</span>
          <a
            href="https://taha-heidaryfard.ir/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 underline underline-offset-4 transition-colors"
            title={locale === 'fa' ? 'محمد طاها حیدری فرد | توسعه‌دهنده نرم‌افزار و وب' : 'Mohammad Taha Heidaryfard | Software & Web Developer'}
          >
            {locale === 'fa' ? 'محمد طاها حیدری فرد' : 'Mohammad Taha Heidaryfard'}
          </a>
        </div>

        {/* Action buttons (Support & optional PWA Install) */}
        <div className="flex items-center gap-3">
          {deferredPrompt && (
            <button
              type="button"
              onClick={handleInstallClick}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-850 active:scale-95 text-slate-800 dark:text-zinc-200 font-bold text-xs transition-all shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{t.footer.pwaInstall}</span>
            </button>
          )}

          <a
            href="https://reymit.ir/taxtander"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs shadow-md shadow-rose-500/20 hover:shadow-rose-500/35 transition-all duration-200 active:scale-95 cursor-pointer"
            title={locale === 'fa' ? 'رِیمیت | درگاه حمایت مالی از Taxtander' : 'Support Taxtander on Reymit'}
          >
            <Heart className="w-3.5 h-3.5 fill-current shrink-0" />
            <span>{locale === 'fa' ? 'حمایت از پروژه' : 'Support'}</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
