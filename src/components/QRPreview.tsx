'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  Check,
  Copy,
  Download,
  FileCode,
  Image as ImageIcon,
  Printer,
  Sparkles,
} from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { useToast } from '@/context/ToastContext';
import { renderToCanvas, renderToSVG } from '@/lib/qr-renderer';
import { QROptions } from '@/types/qr';

interface QRPreviewProps {
  text: string;
  options: QROptions;
}

export function QRPreview({ text, options }: QRPreviewProps) {
  const { t, locale } = useI18n();
  const { showToast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);

  useEffect(() => {
    let isCancelled = false;

    async function draw() {
      if (!canvasRef.current) return;
      setIsRendering(true);
      try {
        await renderToCanvas(canvasRef.current, text || ' ', options);
      } catch (err) {
        console.error('Failed to render QR Code:', err);
      } finally {
        if (!isCancelled) setIsRendering(false);
      }
    }

    draw();

    return () => {
      isCancelled = true;
    };
  }, [text, options]);

  const handleDownloadPng = () => {
    if (!canvasRef.current) return;
    const url = canvasRef.current.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `qr-code-${Date.now()}.png`;
    a.click();
    showToast(t.preview.downloadPng, 'success');
  };

  const handleDownloadSvg = async () => {
    try {
      const svgString = await renderToSVG(text || ' ', options);
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `qr-code-${Date.now()}.svg`;
      a.click();
      URL.revokeObjectURL(url);
      showToast(t.preview.downloadSvg, 'success');
    } catch (err) {
      console.error(err);
      showToast('Error generating SVG', 'error');
    }
  };

  const handleCopyImage = async () => {
    if (!canvasRef.current) return;
    try {
      canvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        setCopiedImage(true);
        showToast(t.preview.imageCopied, 'success');
        setTimeout(() => setCopiedImage(false), 2000);
      });
    } catch {
      handleDownloadPng();
    }
  };

  const handleCopyText = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(true);
      showToast(t.preview.copied, 'success');
      setTimeout(() => setCopiedText(false), 2000);
    } catch {
      showToast('Failed to copy text', 'error');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="card-elevated rounded-3xl p-6 flex flex-col items-center justify-between space-y-6">
      {/* Title & Metadata chips */}
      <div className="w-full flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-zinc-800">
        <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          {t.preview.title}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300">
            {options.size}px
          </span>
          <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/70 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            EC: {options.errorCorrectionLevel}
          </span>
        </div>
      </div>

      {/* Canvas Presentation Frame */}
      <div className="print-area relative flex items-center justify-center p-6 rounded-3xl checkerboard-pattern border-2 border-slate-300/80 dark:border-zinc-800 shadow-xl shadow-slate-900/5 dark:shadow-2xl dark:shadow-black/70 max-w-full overflow-hidden transition-all duration-300 bg-white dark:bg-zinc-950">
        <canvas
          ref={canvasRef}
          className="max-w-[280px] sm:max-w-[320px] w-full h-auto rounded-xl shadow-md transition-transform duration-300 hover:scale-[1.02]"
          style={{
            imageRendering: 'pixelated',
          }}
        />
        {isRendering && (
          <div className="absolute inset-0 bg-white/85 dark:bg-zinc-950/85 backdrop-blur-xs flex items-center justify-center rounded-3xl">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 animate-pulse flex items-center gap-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              {locale === 'fa' ? 'در حال رندر...' : 'Rendering...'}
            </span>
          </div>
        )}
      </div>

      {/* Action Toolbar */}
      <div className="w-full space-y-3">
        {/* Main High-Impact Download Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleDownloadPng}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/25 transition-all duration-200 cursor-pointer"
          >
            <Download className="w-4 h-4 shrink-0" />
            <span>{t.preview.downloadPng}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadSvg}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-slate-900 hover:bg-black dark:bg-zinc-100 dark:hover:bg-white active:scale-95 text-white dark:text-zinc-950 font-bold text-xs sm:text-sm shadow-md shadow-slate-950/15 transition-all duration-200 cursor-pointer"
          >
            <FileCode className="w-4 h-4 shrink-0" />
            <span>{t.preview.downloadSvg}</span>
          </button>
        </div>

        {/* Secondary Utility Actions */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={handleCopyImage}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:border-slate-400 dark:hover:border-zinc-600 active:scale-95 text-slate-800 dark:text-zinc-200 text-xs font-bold transition-all"
            title={t.preview.copyImage}
          >
            {copiedImage ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <ImageIcon className="w-3.5 h-3.5 text-slate-600 dark:text-zinc-400" />
            )}
            <span className="truncate">
              {copiedImage ? t.preview.copied : t.preview.copyImage}
            </span>
          </button>

          <button
            type="button"
            onClick={handleCopyText}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:border-slate-400 dark:hover:border-zinc-600 active:scale-95 text-slate-800 dark:text-zinc-200 text-xs font-bold transition-all"
            title={t.preview.copyContent}
          >
            {copiedText ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5 text-slate-600 dark:text-zinc-400" />
            )}
            <span className="truncate">
              {copiedText ? t.preview.copied : t.preview.copyContent}
            </span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-2xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:border-slate-400 dark:hover:border-zinc-600 active:scale-95 text-slate-800 dark:text-zinc-200 text-xs font-bold transition-all"
            title={t.preview.print}
          >
            <Printer className="w-3.5 h-3.5 text-slate-600 dark:text-zinc-400" />
            <span className="truncate">{t.preview.print}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
