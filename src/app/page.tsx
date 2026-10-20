'use client';

import React, { useState } from 'react';
import { FileCheck, Shield, Sparkles, Zap } from 'lucide-react';
import { BatchGenerator } from '@/components/BatchGenerator';
import { Footer } from '@/components/Footer';
import { Header, MainTab } from '@/components/Header';
import { QRGenerator } from '@/components/QRGenerator';
import { QRScanner } from '@/components/QRScanner';
import { useI18n } from '@/context/I18nContext';

export default function Home() {
  const [activeTab, setActiveTab] = useState<MainTab>('generate');
  const { t, locale } = useI18n();

  return (
    <div className="min-h-screen flex flex-col bg-ambient-pattern text-zinc-900 dark:text-zinc-100 transition-colors relative overflow-x-hidden">
      {/* Ambient background light spot */}
      <div
        className="pointer-events-none absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-indigo-500/5 via-indigo-500/0 to-transparent dark:from-indigo-500/10 dark:via-indigo-500/0 blur-3xl -z-10"
        aria-hidden="true"
      />

      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Hero headline & feature pills (Hidden during print) */}
        <section className="text-center space-y-4 max-w-3xl mx-auto print:hidden">
          {/* Top Feature Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-50/80 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>
              {locale === 'fa'
                ? 'استودیو مدرن و حرفه‌ای تولید و اسکن کدهای QR'
                : 'Modern Studio for Professional QR Code Creation & Scanning'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-950 dark:text-white leading-tight">
            {activeTab === 'generate' && t.app.title}
            {activeTab === 'batch' && t.batch.title}
            {activeTab === 'scan' && t.scanner.title}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed max-w-2xl mx-auto font-medium">
            {activeTab === 'generate' && t.app.subtitle}
            {activeTab === 'batch' && t.batch.description}
            {activeTab === 'scan' &&
              (locale === 'fa'
                ? 'اسکن آنی کدهای QR با دوربین دستگاه یا بارگذاری فایل تصویری بدون ارسال حتی یک بایت به سرور'
                : 'Instant QR code decoding using your device camera or image files with zero network footprint')}
          </p>

          {/* Feature Highlights Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1 text-[11px] font-semibold">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 shadow-2xs">
              <Shield className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              {locale === 'fa' ? 'حریم خصوصی ۱۰۰٪ مرورگر' : '100% In-Browser Privacy'}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-300 dark:border-indigo-800 text-indigo-800 dark:text-indigo-300 shadow-2xs">
              <FileCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
              {locale === 'fa' ? 'خروجی PNG و وکتور SVG' : 'PNG & Scalable SVG'}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-300 shadow-2xs">
              <Zap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              {locale === 'fa' ? 'پیش‌نمایش زنده و تولید گروهی' : 'Live Preview & Batch Engine'}
            </span>
          </div>
        </section>

        {/* Tab Content */}
        <div className="pt-2">
          {activeTab === 'generate' && <QRGenerator />}
          {activeTab === 'batch' && <BatchGenerator />}
          {activeTab === 'scan' && <QRScanner />}
        </div>
      </main>

      <Footer />
    </div>
  );
}
