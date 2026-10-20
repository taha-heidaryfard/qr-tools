'use client';

import React, { useRef, useState } from 'react';
import {
  Download,
  FileSpreadsheet,
  Printer,
  Sparkles,
  Trash2,
  Upload,
  Zap,
} from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { useToast } from '@/context/ToastContext';
import { renderToCanvas } from '@/lib/qr-renderer';
import { QROptions } from '@/types/qr';

interface BatchItem {
  id: string;
  text: string;
}

const DEFAULT_BATCH_OPTIONS: QROptions = {
  errorCorrectionLevel: 'M',
  size: 260,
  margin: 2,
  foregroundColor: '#0f172a',
  backgroundColor: '#ffffff',
  dotStyle: 'rounded',
  cornerSquareStyle: 'rounded',
  cornerDotStyle: 'rounded',
};

const SAMPLE_BATCH_DATA = [
  'https://google.com/search?q=qr-tools',
  'https://github.com/trending',
  'WIFI:T:WPA;S:CoffeeShop_Guest;P:Latte1234;;',
  'mailto:support@example.com?subject=Help',
  'tel:+989123456789',
  'https://t.me/durov',
];

function BatchItemCard({
  item,
  options,
  onDownload,
}: {
  item: BatchItem;
  options: QROptions;
  onDownload: (item: BatchItem, canvas: HTMLCanvasElement | null) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useI18n();

  React.useEffect(() => {
    if (canvasRef.current) {
      renderToCanvas(canvasRef.current, item.text, options);
    }
  }, [item.text, options]);

  return (
    <div className="card-elevated rounded-3xl p-4 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col items-center justify-between gap-3 break-inside-avoid group">
      <div className="p-3 bg-slate-100 dark:bg-zinc-950/70 rounded-2xl border border-slate-200 dark:border-zinc-800 flex items-center justify-center w-full aspect-square">
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain rounded-lg shadow-xs"
        />
      </div>
      <p
        dir="ltr"
        className="text-[11px] text-slate-700 dark:text-zinc-300 font-mono font-medium truncate max-w-full text-center px-1 select-all"
        title={item.text}
      >
        {item.text}
      </p>
      <button
        type="button"
        onClick={() => onDownload(item, canvasRef.current)}
        className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:border-slate-400 dark:hover:border-zinc-600 text-xs font-bold text-slate-800 dark:text-zinc-200 transition-colors print:hidden shadow-2xs"
      >
        <Download className="w-3.5 h-3.5" />
        {t.batch.downloadItem}
      </button>
    </div>
  );
}

export function BatchGenerator() {
  const { t, locale } = useI18n();
  const { showToast } = useToast();
  const [inputText, setInputText] = useState(
    'https://example.com/product-1\nhttps://example.com/product-2\nhttps://example.com/product-3'
  );
  const [items, setItems] = useState<BatchItem[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = () => {
    const lines = inputText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      showToast(locale === 'fa' ? 'لطفاً حداقل یک خط وارد کنید' : 'Please enter at least one line', 'error');
      return;
    }

    const newItems: BatchItem[] = lines.map((line, idx) => ({
      id: `${Date.now()}-${idx}`,
      text: line,
    }));

    setItems(newItems);
    showToast(`${newItems.length} ${t.batch.itemsCount}`, 'success');
  };

  const handleLoadSample = () => {
    setInputText(SAMPLE_BATCH_DATA.join('\n'));
    showToast(locale === 'fa' ? 'داده‌های نمونه بارگذاری شد' : 'Sample batch data loaded', 'info');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setInputText(content);
        showToast(locale === 'fa' ? 'فایل با موفقیت بارگذاری شد' : 'File uploaded successfully', 'success');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleSingleDownload = (item: BatchItem, canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-${item.text.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 20)}.png`;
    a.click();
  };

  const handleDownloadAll = () => {
    if (items.length === 0) return;

    items.forEach((item, index) => {
      setTimeout(async () => {
        const dummyCanvas = document.createElement('canvas');
        await renderToCanvas(dummyCanvas, item.text, DEFAULT_BATCH_OPTIONS);
        const url = dummyCanvas.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = `qr-${index + 1}-${item.text.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 15)}.png`;
        a.click();
      }, index * 200);
    });

    showToast(t.batch.downloadAll, 'info');
  };

  const handlePrintSheet = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Input Workspace Card */}
      <div className="card-elevated rounded-3xl p-6 sm:p-8 space-y-5 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-200 dark:border-zinc-800">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              {t.batch.title}
            </h2>
            <p className="text-xs font-medium text-slate-600 dark:text-zinc-400 mt-1">
              {t.batch.description}
            </p>
          </div>
          <button
            type="button"
            onClick={handleLoadSample}
            className="flex items-center gap-1.5 py-1.5 px-3.5 rounded-xl border border-indigo-300 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-xs font-bold text-indigo-700 dark:text-indigo-300 transition-colors w-fit active:scale-95 shadow-2xs"
          >
            <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            {locale === 'fa' ? 'بارگذاری داده‌های نمونه' : 'Load Sample Data'}
          </button>
        </div>

        {/* Text Area */}
        <textarea
          rows={6}
          dir="ltr"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={t.batch.textareaPlaceholder}
          className="w-full rounded-2xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950/80 p-4 text-xs font-mono font-medium text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:bg-white dark:focus:bg-zinc-900 focus:border-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/15 transition-all resize-y shadow-inner"
        />

        {/* Action Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.csv"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 py-2.5 px-4 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:border-slate-400 active:scale-95 text-xs font-bold text-slate-800 dark:text-zinc-200 transition-colors shadow-2xs"
            >
              <Upload className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
              {t.batch.uploadFile}
            </button>

            {items.length > 0 && (
              <button
                type="button"
                onClick={() => setItems([])}
                className="flex items-center gap-1.5 py-2.5 px-3 rounded-xl border border-rose-300 dark:border-rose-900/60 bg-white dark:bg-zinc-900 hover:bg-rose-50 dark:hover:bg-rose-950/40 active:scale-95 text-xs font-bold text-rose-600 transition-colors shadow-2xs"
              >
                <Trash2 className="w-4 h-4" />
                {t.batch.clear}
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            className="flex items-center gap-2 py-3 px-6 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/25 transition-all duration-200 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            {t.batch.generateAll}
          </button>
        </div>
      </div>

      {/* Generated Grid */}
      {items.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between print:hidden px-1">
            <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              {items.length} {t.batch.itemsCount}
            </span>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={handlePrintSheet}
                className="flex items-center gap-1.5 py-2 px-4 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 hover:border-slate-400 active:scale-95 text-xs font-bold text-slate-800 dark:text-zinc-200 transition-colors shadow-2xs"
              >
                <Printer className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
                {t.batch.printSheet}
              </button>

              <button
                type="button"
                onClick={handleDownloadAll}
                className="flex items-center gap-1.5 py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
              >
                <Download className="w-4 h-4" />
                {t.batch.downloadAll}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 print:grid-cols-3 print:gap-6">
            {items.map((item) => (
              <BatchItemCard
                key={item.id}
                item={item}
                options={DEFAULT_BATCH_OPTIONS}
                onDownload={handleSingleDownload}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
