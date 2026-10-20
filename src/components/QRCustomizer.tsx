/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useRef, useState } from 'react';
import {
  Check,
  Circle,
  Eye,
  Image as ImageIcon,
  Layers,
  Palette,
  RefreshCw,
  Sliders,
  Sparkles,
  Square,
  Trash2,
  Upload,
} from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { QR_TEMPLATES } from '@/lib/templates';
import { checkReadability } from '@/lib/validator';
import {
  CornerDotStyle,
  CornerSquareStyle,
  DotStyle,
  ErrorCorrectionLevel,
  LogoShape,
  QROptions,
} from '@/types/qr';

interface QRCustomizerProps {
  text: string;
  options: QROptions;
  onChange: (options: QROptions) => void;
}

type TabType = 'templates' | 'styles' | 'colors' | 'logo' | 'settings';

const QUICK_COLORS = [
  { name: 'Slate Dark', hex: '#0f172a' },
  { name: 'OLED Black', hex: '#000000' },
  { name: 'Indigo Electric', hex: '#4338ca' },
  { name: 'Royal Violet', hex: '#6d28d9' },
  { name: 'Emerald Forest', hex: '#047857' },
  { name: 'Ocean Cyan', hex: '#0284c7' },
  { name: 'Crimson Rose', hex: '#be123c' },
  { name: 'Amber Gold', hex: '#b45309' },
];

export function QRCustomizer({ text, options, onChange }: QRCustomizerProps) {
  const { t, locale } = useI18n();
  const [activeTab, setActiveTab] = useState<TabType>('templates');
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = (patch: Partial<QROptions>) => {
    onChange({ ...options, ...patch });
  };

  const readability = checkReadability(text, options);

  const processUploadedFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const defaultBg =
        options.backgroundColor && options.backgroundColor !== 'transparent'
          ? options.backgroundColor
          : '#ffffff';

      update({
        errorCorrectionLevel:
          options.errorCorrectionLevel === 'L' || options.errorCorrectionLevel === 'M'
            ? 'H'
            : options.errorCorrectionLevel,
        logo: {
          src: result,
          sizeRatio: 0.22,
          padding: 6,
          bgColor: defaultBg,
          borderRadius: 22,
          shape: 'rounded',
        },
      });
    };
    reader.readAsDataURL(file);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    processUploadedFile(file);
    e.target.value = '';
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingLogo(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processUploadedFile(file);
    }
  };

  const removeLogo = () => {
    update({ logo: undefined });
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'templates', label: t.customizer.templates, icon: <Sparkles className="w-4 h-4" /> },
    { id: 'styles', label: t.customizer.styles, icon: <Layers className="w-4 h-4" /> },
    { id: 'colors', label: t.customizer.colors, icon: <Palette className="w-4 h-4" /> },
    { id: 'logo', label: t.customizer.logo, icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'settings', label: t.customizer.settings, icon: <Sliders className="w-4 h-4" /> },
  ];

  return (
    <div className="card-elevated rounded-3xl p-6 space-y-5">
      {/* Tab Navigation */}
      <div className="bg-slate-200/80 dark:bg-zinc-950 p-1.5 rounded-2xl border border-slate-300 dark:border-zinc-800 flex gap-1.5 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold rounded-xl whitespace-nowrap transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                  : 'text-slate-700 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-zinc-100 hover:bg-slate-300/50 dark:hover:bg-zinc-850/60'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab 1: Templates */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <p className="text-xs font-medium text-slate-600 dark:text-zinc-400">
            {locale === 'fa'
              ? 'یکی از قالب‌های آماده زیر را انتخاب کنید تا ترکیب استایل، گوشه‌ها و رنگ‌ها فوراً اعمال شود:'
              : 'Choose a pre-designed template to immediately apply curated style, corners, and color palettes:'}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {QR_TEMPLATES.map((tmpl) => {
              const fg = tmpl.options.foregroundColor || '#000000';
              const bg = tmpl.options.backgroundColor || '#ffffff';
              const isSelected =
                options.foregroundColor === fg && options.backgroundColor === bg;

              return (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => onChange({ ...options, ...tmpl.options })}
                  className={`flex flex-col items-start p-3.5 rounded-2xl border text-start transition-all duration-200 hover:-translate-y-0.5 active:scale-95 ${
                    isSelected
                      ? 'border-2 border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/80 dark:bg-indigo-950/40 shadow-sm'
                      : 'border-slate-300 dark:border-zinc-800 hover:border-slate-400 dark:hover:border-zinc-700 bg-slate-50 dark:bg-zinc-950/50'
                  }`}
                >
                  <div className="flex items-center gap-2 w-full mb-2.5">
                    <span
                      className="w-5 h-5 rounded-full border border-slate-300 dark:border-zinc-700 shrink-0 shadow-xs"
                      style={{ backgroundColor: fg }}
                    />
                    <span
                      className="w-5 h-5 rounded-full border border-slate-300 dark:border-zinc-700 shrink-0 -ms-2.5 shadow-xs"
                      style={{ backgroundColor: bg }}
                    />
                    {isSelected && (
                      <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400 ms-auto shrink-0" />
                    )}
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate w-full">
                    {tmpl.name[locale]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Style & Shape */}
      {activeTab === 'styles' && (
        <div className="space-y-6">
          {/* Dot Style */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
              {t.customizer.dotStyle}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'square', label: t.customizer.dotSquare, icon: <Square className="w-3.5 h-3.5" /> },
                { id: 'rounded', label: t.customizer.dotRounded, icon: <Square className="w-3.5 h-3.5 rounded-sm" /> },
                { id: 'dots', label: t.customizer.dotDots, icon: <Circle className="w-3.5 h-3.5 fill-current" /> },
                { id: 'classy', label: t.customizer.dotClassy, icon: <Sparkles className="w-3.5 h-3.5" /> },
              ].map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => update({ dotStyle: style.id as DotStyle })}
                  className={`flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-bold rounded-2xl border transition-all duration-200 active:scale-95 ${
                    options.dotStyle === style.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-zinc-950/60 border-slate-300 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:border-slate-400'
                  }`}
                >
                  {style.icon}
                  <span>{style.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Corner Square Style */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
              {t.customizer.cornerSquareStyle}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                { id: 'square', label: t.customizer.cornerSquare },
                { id: 'rounded', label: t.customizer.cornerRounded },
                { id: 'extra-rounded', label: t.customizer.cornerExtraRounded },
                { id: 'dot', label: t.customizer.cornerDot },
              ].map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => update({ cornerSquareStyle: style.id as CornerSquareStyle })}
                  className={`py-2.5 px-3 text-xs font-bold rounded-2xl border transition-all duration-200 active:scale-95 ${
                    options.cornerSquareStyle === style.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-zinc-950/60 border-slate-300 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:border-slate-400'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>

          {/* Corner Dot Style */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
              {t.customizer.cornerDotStyle}
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'square', label: t.customizer.cornerDotSquare },
                { id: 'rounded', label: t.customizer.cornerDotRounded },
                { id: 'dot', label: t.customizer.cornerDotCircle },
              ].map((style) => (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => update({ cornerDotStyle: style.id as CornerDotStyle })}
                  className={`py-2.5 px-3 text-xs font-bold rounded-2xl border transition-all duration-200 active:scale-95 ${
                    options.cornerDotStyle === style.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-zinc-950/60 border-slate-300 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:border-slate-400'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Colors */}
      {activeTab === 'colors' && (
        <div className="space-y-5">
          {/* Quick Curated Color Palette */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
              {locale === 'fa' ? 'پالت‌های آماده رنگ سریع' : 'Curated Color Presets'}
            </label>
            <div className="flex flex-wrap gap-2">
              {QUICK_COLORS.map((color) => (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => update({ foregroundColor: color.hex })}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950/60 hover:bg-slate-100 dark:hover:bg-zinc-850 hover:border-slate-400 transition-all text-xs font-semibold"
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-2xs"
                    style={{ backgroundColor: color.hex }}
                  />
                  <span className="text-[11px] text-slate-800 dark:text-zinc-200">
                    {color.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Foreground */}
            <div className="space-y-2 p-3.5 rounded-2xl border border-slate-300 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-950/60">
              <label className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center justify-between">
                <span>{t.customizer.foregroundColor}</span>
                <span dir="ltr" className="text-[11px] font-mono font-bold text-slate-500 dark:text-zinc-400">
                  {options.foregroundColor}
                </span>
              </label>
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={options.foregroundColor}
                  onChange={(e) => update({ foregroundColor: e.target.value })}
                  className="w-10 h-10 rounded-xl border border-slate-300 dark:border-zinc-700 cursor-pointer bg-white dark:bg-zinc-900 shadow-xs"
                />
                <input
                  type="text"
                  dir="ltr"
                  value={options.foregroundColor}
                  onChange={(e) => update({ foregroundColor: e.target.value })}
                  className="flex-1 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-mono font-semibold text-slate-900 dark:text-zinc-100 shadow-inner focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Background */}
            <div className="space-y-2 p-3.5 rounded-2xl border border-slate-300 dark:border-zinc-800 bg-slate-50/80 dark:bg-zinc-950/60">
              <label className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center justify-between">
                <span>{t.customizer.backgroundColor}</span>
                <span dir="ltr" className="text-[11px] font-mono font-bold text-slate-500 dark:text-zinc-400">
                  {options.backgroundColor}
                </span>
              </label>
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  disabled={options.backgroundColor === 'transparent'}
                  value={
                    options.backgroundColor === 'transparent'
                      ? '#ffffff'
                      : options.backgroundColor
                  }
                  onChange={(e) => update({ backgroundColor: e.target.value })}
                  className="w-10 h-10 rounded-xl border border-slate-300 dark:border-zinc-700 cursor-pointer bg-white dark:bg-zinc-900 shadow-xs disabled:opacity-40"
                />
                <input
                  type="text"
                  dir="ltr"
                  disabled={options.backgroundColor === 'transparent'}
                  value={options.backgroundColor}
                  onChange={(e) => update({ backgroundColor: e.target.value })}
                  className="flex-1 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-xs font-mono font-semibold text-slate-900 dark:text-zinc-100 shadow-inner disabled:opacity-40 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={options.backgroundColor === 'transparent'}
                  onChange={(e) =>
                    update({
                      backgroundColor: e.target.checked ? 'transparent' : '#ffffff',
                    })
                  }
                  className="w-3.5 h-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-xs font-medium text-slate-700 dark:text-zinc-300 select-none">
                  {t.customizer.transparentBg}
                </span>
              </label>
            </div>
          </div>

          {/* Advanced Finder Corner Colors */}
          <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
              {locale === 'fa' ? 'رنگ‌بندی مجزای چشم‌های گوشه' : 'Independent Finder Eye Colors'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-3 rounded-2xl border border-slate-300 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-950/50">
                <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                  {t.customizer.cornerSquareColor}
                </span>
                <input
                  type="color"
                  value={options.cornerSquareColor || options.foregroundColor}
                  onChange={(e) => update({ cornerSquareColor: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-slate-300 dark:border-zinc-700"
                />
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl border border-slate-300 dark:border-zinc-800 bg-slate-50/60 dark:bg-zinc-950/50">
                <span className="text-xs font-bold text-slate-800 dark:text-zinc-200">
                  {t.customizer.cornerDotColor}
                </span>
                <input
                  type="color"
                  value={options.cornerDotColor || options.foregroundColor}
                  onChange={(e) => update({ cornerDotColor: e.target.value })}
                  className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border border-slate-300 dark:border-zinc-700"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Logo (Custom user-uploaded logo with professional badge styling) */}
      {activeTab === 'logo' && (
        <div className="space-y-6">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/svg+xml,image/webp"
            onChange={handleLogoUpload}
            className="hidden"
          />

          {/* If logo is present: active badge details & appearance controls */}
          {options.logo?.src ? (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-2xl border-2 border-indigo-200 dark:border-indigo-900/80 bg-indigo-50/80 dark:bg-indigo-950/30 shadow-xs gap-4">
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-14 h-14 rounded-2xl border border-slate-300 dark:border-zinc-700 flex items-center justify-center p-2 shadow-sm bg-white dark:bg-zinc-800"
                    style={{
                      backgroundColor: options.logo.shape === 'none' ? 'transparent' : options.logo.bgColor || '#ffffff',
                      borderRadius: options.logo.shape === 'circle' ? '9999px' : `${options.logo.borderRadius || 22}%`,
                    }}
                  >
                    <img
                      src={options.logo.src}
                      alt="Active logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-zinc-100 block">
                      {locale === 'fa' ? 'لوگو در مرکز QR فعال است' : 'Logo Active in QR Center'}
                    </span>
                    <span className="text-[11px] font-medium text-slate-600 dark:text-zinc-400">
                      {locale === 'fa'
                        ? 'سطح تصحیح خطا روی H (۳۰٪) تنظیم شده تا اسکن کاملاً بدون خطا باشد'
                        : 'Error correction boosted to High (H 30%) for flawless scanning'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-xs font-bold text-slate-800 dark:text-zinc-200 transition-colors shadow-2xs cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    {locale === 'fa' ? 'بارگذاری تصویر جدید' : t.customizer.replaceLogo}
                  </button>
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="flex items-center gap-1.5 py-1.5 px-3 rounded-xl border border-rose-300 dark:border-rose-900/60 bg-white dark:bg-zinc-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold text-rose-600 transition-colors shadow-2xs cursor-pointer"
                    title={t.customizer.removeLogo}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {t.customizer.removeLogo}
                  </button>
                </div>
              </div>

              {/* Badge Shape Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
                  {t.customizer.logoShape}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'rounded' as LogoShape, label: t.customizer.shapeRounded },
                    { id: 'circle' as LogoShape, label: t.customizer.shapeCircle },
                    { id: 'square' as LogoShape, label: t.customizer.shapeSquare },
                    { id: 'none' as LogoShape, label: t.customizer.shapeNone },
                  ].map((shapeOption) => {
                    const isSelected = (options.logo?.shape || 'rounded') === shapeOption.id;
                    return (
                      <button
                        key={shapeOption.id}
                        type="button"
                        onClick={() =>
                          update({
                            logo: {
                              ...options.logo!,
                              shape: shapeOption.id,
                              borderRadius:
                                shapeOption.id === 'circle'
                                  ? 50
                                  : shapeOption.id === 'square'
                                  ? 8
                                  : 22,
                            },
                          })
                        }
                        className={`py-2 px-3 text-xs font-bold rounded-2xl border transition-all active:scale-95 ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                            : 'bg-slate-50 dark:bg-zinc-950/60 border-slate-300 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:border-slate-400'
                        }`}
                      >
                        {shapeOption.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Logo Sliders & Appearance Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-zinc-800">
                {/* Size Ratio */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50/80 dark:bg-zinc-950/60 border border-slate-300 dark:border-zinc-800">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-zinc-200">
                      {t.customizer.logoSize}
                    </span>
                    <span className="font-mono text-slate-900 dark:text-zinc-100 font-bold">
                      {Math.round(options.logo.sizeRatio * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.16"
                    max="0.28"
                    step="0.01"
                    value={options.logo.sizeRatio}
                    onChange={(e) =>
                      update({
                        logo: { ...options.logo!, sizeRatio: parseFloat(e.target.value) },
                      })
                    }
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <span className="text-[10px] font-medium text-slate-500 dark:text-zinc-400 block">
                    {locale === 'fa' ? 'پیشنهاد بهینه: ۲۰٪ تا ۲۴٪' : 'Optimal range: 20% to 24%'}
                  </span>
                </div>

                {/* Inner Padding */}
                <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50/80 dark:bg-zinc-950/60 border border-slate-300 dark:border-zinc-800">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-slate-800 dark:text-zinc-200">
                      {t.customizer.logoPadding}
                    </span>
                    <span className="font-mono text-slate-900 dark:text-zinc-100 font-bold">
                      {options.logo.padding ?? 6}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="16"
                    step="1"
                    value={options.logo.padding ?? 6}
                    onChange={(e) =>
                      update({
                        logo: { ...options.logo!, padding: parseInt(e.target.value, 10) },
                      })
                    }
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <span className="text-[10px] font-medium text-slate-500 dark:text-zinc-400 block">
                    {locale === 'fa' ? 'تنظیم فاصله نشان از لبه قاب' : 'Controls whitespace inside badge'}
                  </span>
                </div>

                {/* Badge Background Color (if not shape 'none') */}
                {options.logo.shape !== 'none' && (
                  <div className="col-span-1 sm:col-span-2 space-y-2 p-3.5 rounded-2xl bg-slate-50/80 dark:bg-zinc-950/60 border border-slate-300 dark:border-zinc-800">
                    <label className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center justify-between">
                      <span>{t.customizer.logoBackground}</span>
                      <span dir="ltr" className="text-[11px] font-mono text-slate-500 dark:text-zinc-400">
                        {options.logo.bgColor || '#ffffff'}
                      </span>
                    </label>
                    <div className="flex items-center gap-2.5">
                      <input
                        type="color"
                        value={options.logo.bgColor || '#ffffff'}
                        onChange={(e) =>
                          update({
                            logo: { ...options.logo!, bgColor: e.target.value },
                          })
                        }
                        className="w-9 h-9 rounded-xl border border-slate-300 dark:border-zinc-700 cursor-pointer bg-transparent"
                      />
                      <input
                        type="text"
                        dir="ltr"
                        value={options.logo.bgColor || '#ffffff'}
                        onChange={(e) =>
                          update({
                            logo: { ...options.logo!, bgColor: e.target.value },
                          })
                        }
                        className="flex-1 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-1.5 text-xs font-mono font-semibold text-slate-900 dark:text-zinc-100"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          update({
                            logo: {
                              ...options.logo!,
                              bgColor:
                                options.backgroundColor === 'transparent'
                                  ? '#ffffff'
                                  : options.backgroundColor,
                            },
                          })
                        }
                        className="px-3 py-2 text-xs font-bold rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200 transition-colors shadow-2xs"
                      >
                        {locale === 'fa' ? 'هماهنگ با QR' : 'Match QR'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Upload drop zone when no logo is set */
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingLogo(true);
              }}
              onDragLeave={() => setIsDraggingLogo(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-3xl p-8 sm:p-10 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${
                isDraggingLogo
                  ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/50 scale-[1.01]'
                  : 'border-slate-300 dark:border-zinc-700 hover:border-indigo-600 dark:hover:border-indigo-400 bg-slate-50/80 dark:bg-zinc-950/50 hover:shadow-xs'
              }`}
            >
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center transition-transform hover:scale-110 shadow-xs border border-indigo-200 dark:border-indigo-800">
                <Upload className="w-6 h-6" />
              </div>
              <div className="text-center space-y-1">
                <span className="text-sm font-bold text-slate-900 dark:text-zinc-100 block">
                  {t.customizer.uploadLogo}
                </span>
                <span className="text-xs font-medium text-slate-600 dark:text-zinc-400 block max-w-sm">
                  {t.customizer.uploadLogoHelp}
                </span>
                <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 block pt-1">
                  {locale === 'fa' ? 'یا تصویر را اینجا بکشید و رها کنید (Drag & Drop)' : 'Or drag and drop your image file here'}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Settings & Readability */}
      {activeTab === 'settings' && (
        <div className="space-y-5">
          {/* Error Correction Level */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
              {t.customizer.errorCorrection}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['L', 'M', 'Q', 'H'] as ErrorCorrectionLevel[]).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => update({ errorCorrectionLevel: lvl })}
                  className={`py-2 px-3 text-xs font-bold rounded-2xl border transition-all duration-200 active:scale-95 ${
                    options.errorCorrectionLevel === lvl
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-slate-50 dark:bg-zinc-950/60 border-slate-300 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:border-slate-400'
                  }`}
                >
                  {lvl === 'L'
                    ? t.customizer.errorCorrectionL
                    : lvl === 'M'
                    ? t.customizer.errorCorrectionM
                    : lvl === 'Q'
                    ? t.customizer.errorCorrectionQ
                    : t.customizer.errorCorrectionH}
                </button>
              ))}
            </div>
          </div>

          {/* Size and Quiet Zone Margin */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50/80 dark:bg-zinc-950/60 border border-slate-300 dark:border-zinc-800">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-zinc-200">
                  {t.customizer.qrSize}
                </span>
                <span className="font-mono text-slate-900 dark:text-zinc-100 font-bold">
                  {options.size} x {options.size} px
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="1024"
                step="32"
                value={options.size}
                onChange={(e) => update({ size: parseInt(e.target.value, 10) })}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>

            <div className="space-y-1.5 p-3 rounded-2xl bg-slate-50/80 dark:bg-zinc-950/60 border border-slate-300 dark:border-zinc-800">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-zinc-200">
                  {t.customizer.margin}
                </span>
                <span className="font-mono text-slate-900 dark:text-zinc-100 font-bold">
                  {options.margin} modules
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="1"
                value={options.margin}
                onChange={(e) => update({ margin: parseInt(e.target.value, 10) })}
                className="w-full accent-indigo-600 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Readability Indicator Banner */}
      <div
        className={`p-4 rounded-2xl border text-xs flex items-start gap-3 transition-colors shadow-2xs ${
          readability.score === 'good'
            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-100'
            : readability.score === 'warning'
            ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700 text-amber-950 dark:text-amber-100'
            : 'bg-rose-50 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700 text-rose-950 dark:text-rose-100'
        }`}
      >
        <Eye className="w-4 h-4 shrink-0 mt-0.5" />
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <span className="font-bold text-sm">
              {t.customizer.readabilityScore}:{' '}
              {readability.score === 'good'
                ? t.customizer.good
                : readability.score === 'warning'
                ? t.customizer.warning
                : t.customizer.danger}
            </span>
          </div>
          <p className="text-[11px] font-medium leading-relaxed opacity-95">
            {readability.messages[0]?.[locale]}
          </p>
        </div>
      </div>
    </div>
  );
}
