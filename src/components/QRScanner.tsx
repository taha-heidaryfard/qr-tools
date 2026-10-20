'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BrowserQRCodeReader, IScannerControls } from '@zxing/browser';
import {
  AlertTriangle,
  Camera,
  Check,
  Copy,
  ExternalLink,
  FileImage,
  Key,
  Mail,
  Phone,
  RefreshCw,
  ShieldCheck,
  Upload,
  UserCheck,
  Video,
  VideoOff,
  Wifi,
} from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import { useToast } from '@/context/ToastContext';
import { parseQRContent, ParsedQR } from '@/lib/formats';

type ScanMode = 'camera' | 'file';

export function QRScanner() {
  const { t, locale } = useI18n();
  const { showToast } = useToast();

  const [mode, setMode] = useState<ScanMode>('camera');
  const [isScanning, setIsScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [result, setResult] = useState<ParsedQR | null>(null);
  const [copied, setCopied] = useState(false);
  const [showConfirmUrlModal, setShowConfirmUrlModal] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const codeReaderRef = useRef<BrowserQRCodeReader | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stopCamera = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.stop();
      controlsRef.current = null;
    }
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  }, []);

  // Initialize CodeReader once
  useEffect(() => {
    codeReaderRef.current = new BrowserQRCodeReader();
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  const startCamera = async (overrideFacing?: 'environment' | 'user') => {
    stopCamera();
    setCameraError(null);

    const activeFacing = overrideFacing || facingMode;

    try {
      if (!codeReaderRef.current || !videoRef.current) return;

      setIsScanning(true);

      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: activeFacing },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      };

      const controls = await codeReaderRef.current.decodeFromConstraints(
        constraints,
        videoRef.current,
        (res) => {
          if (res) {
            const rawText = res.getText();
            const parsed = parseQRContent(rawText);
            setResult(parsed);
            showToast(t.scanner.resultTitle, 'success');
            // Audio feedback
            try {
              const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
              if (AudioCtxClass) {
                const audioCtx = new AudioCtxClass();
                const osc = audioCtx.createOscillator();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, audioCtx.currentTime);
                osc.connect(audioCtx.destination);
                osc.start();
                osc.stop(audioCtx.currentTime + 0.1);
              }
            } catch {
              // Ignore audio errors
            }
          }
        }
      );

      controlsRef.current = controls;
    } catch (err: unknown) {
      console.error('Camera access error:', err);
      setIsScanning(false);
      const message =
        err instanceof Error && err.name === 'NotAllowedError'
          ? t.scanner.permissionDenied
          : t.scanner.cameraError;
      setCameraError(message);
    }
  };

  const toggleCameraFacing = () => {
    const nextFacing = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextFacing);
    if (isScanning) {
      startCamera(nextFacing);
    }
  };

  // Handle image file scan
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = URL.createObjectURL(file);
      const reader = new BrowserQRCodeReader();
      const res = await reader.decodeFromImageUrl(url);
      URL.revokeObjectURL(url);

      if (res) {
        const parsed = parseQRContent(res.getText());
        setResult(parsed);
        showToast(t.scanner.resultTitle, 'success');
      }
    } catch (err) {
      console.error('File scan error:', err);
      showToast(t.scanner.noQrFoundInImage, 'error');
    }
    e.target.value = '';
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      showToast(t.preview.copied, 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast('Copy failed', 'error');
    }
  };

  const downloadVCardFile = (vcardText: string, name: string) => {
    const blob = new Blob([vcardText], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${name || 'contact'}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Mode switcher */}
      <div className="flex justify-center">
        <div className="bg-slate-200/80 dark:bg-zinc-950 p-1.5 rounded-2xl flex gap-1 border border-slate-300 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => {
              setMode('camera');
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 ${
              mode === 'camera'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                : 'text-slate-700 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-zinc-100 hover:bg-slate-300/50 dark:hover:bg-zinc-850/60'
            }`}
          >
            <Camera className="w-4 h-4" />
            {t.scanner.cameraTab}
          </button>
          <button
            type="button"
            onClick={() => {
              stopCamera();
              setMode('file');
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 ${
              mode === 'file'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                : 'text-slate-700 dark:text-zinc-400 hover:text-slate-950 dark:hover:text-zinc-100 hover:bg-slate-300/50 dark:hover:bg-zinc-850/60'
            }`}
          >
            <FileImage className="w-4 h-4" />
            {t.scanner.fileTab}
          </button>
        </div>
      </div>

      {/* Camera View */}
      {mode === 'camera' && (
        <div className="card-elevated rounded-3xl p-5 sm:p-6 space-y-4">
          <div className="relative aspect-video max-w-lg mx-auto bg-black rounded-2xl overflow-hidden flex items-center justify-center shadow-lg border border-slate-800">
            <video
              ref={videoRef}
              className={`w-full h-full object-cover ${
                facingMode === 'user' ? 'scale-x-[-1]' : ''
              }`}
              muted
              playsInline
              autoPlay
            />

            {!isScanning && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-zinc-950/90 text-zinc-200 p-6 text-center">
                <VideoOff className="w-12 h-12 text-slate-500" />
                <span className="text-sm font-bold">
                  {cameraError || (locale === 'fa' ? 'دوربین در حال حاضر خاموش است' : 'Camera is currently stopped')}
                </span>
                <button
                  type="button"
                  onClick={() => startCamera()}
                  className="mt-2 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs sm:text-sm font-bold shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  {t.scanner.startCamera}
                </button>
              </div>
            )}

            {/* Viewfinder Target Overlay */}
            {isScanning && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-56 h-56 border-2 border-white/60 rounded-2xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]">
                  {/* Corner accents */}
                  <span className="absolute -top-1 -start-1 w-6 h-6 border-t-4 border-s-4 border-indigo-500 rounded-tl-lg shadow-[0_0_8px_#6366f1]" />
                  <span className="absolute -top-1 -end-1 w-6 h-6 border-t-4 border-e-4 border-indigo-500 rounded-tr-lg shadow-[0_0_8px_#6366f1]" />
                  <span className="absolute -bottom-1 -start-1 w-6 h-6 border-b-4 border-s-4 border-indigo-500 rounded-bl-lg shadow-[0_0_8px_#6366f1]" />
                  <span className="absolute -bottom-1 -end-1 w-6 h-6 border-b-4 border-e-4 border-indigo-500 rounded-br-lg shadow-[0_0_8px_#6366f1]" />
                  {/* Scanning beam animation */}
                  <div className="absolute inset-x-2 top-0 h-0.5 bg-indigo-400 shadow-[0_0_12px_#6366f1] animate-bounce" />
                </div>
              </div>
            )}
          </div>

          {/* Camera controls toolbar */}
          {isScanning && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={stopCamera}
                className="flex items-center gap-1.5 py-2 px-4 rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-600 text-xs sm:text-sm font-bold transition-colors shadow-2xs"
              >
                <VideoOff className="w-4 h-4" />
                {t.scanner.stopCamera}
              </button>

              <button
                type="button"
                onClick={toggleCameraFacing}
                className="flex items-center gap-1.5 py-2 px-4 rounded-xl border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 text-xs sm:text-sm font-bold transition-colors shadow-2xs"
              >
                <RefreshCw className="w-4 h-4" />
                {t.scanner.switchCamera}
              </button>
            </div>
          )}
        </div>
      )}

      {/* File View */}
      {mode === 'file' && (
        <div className="card-elevated rounded-3xl p-8 text-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 dark:border-zinc-700 hover:border-indigo-600 dark:hover:border-indigo-400 rounded-2xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all bg-slate-50/80 dark:bg-zinc-950/40"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center transition-transform hover:scale-110 shadow-xs border border-indigo-200 dark:border-indigo-800">
              <Upload className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold text-slate-800 dark:text-zinc-200">
              {t.scanner.dropFile}
            </span>
            <button
              type="button"
              className="mt-2 py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/20"
            >
              {t.scanner.selectFile}
            </button>
          </div>
        </div>
      )}

      {/* Scanned Result Card */}
      {result && (
        <div className="card-elevated border-2 border-emerald-500/40 dark:border-emerald-500/30 rounded-3xl p-6 shadow-md space-y-4 animate-in fade-in slide-in-from-bottom-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
                {t.scanner.resultTitle}
              </h3>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-mono font-bold uppercase border border-indigo-200 dark:border-indigo-800">
              {result.type}
            </span>
          </div>

          {/* Structured card display based on type */}
          {result.type === 'wifi' && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-300 dark:border-zinc-800 space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-zinc-300">
                <Wifi className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-bold text-slate-900 dark:text-zinc-100">
                  SSID:
                </span>
                <span className="font-mono font-bold">{result.data.ssid}</span>
              </div>
              {result.data.password && (
                <div className="flex items-center justify-between gap-2 text-slate-700 dark:text-zinc-300">
                  <div className="flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-500" />
                    <span className="font-bold text-slate-900 dark:text-zinc-100">
                      {locale === 'fa' ? 'رمز:' : 'Password:'}
                    </span>
                    <span className="font-mono font-bold select-all">
                      {result.data.password}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(String(result.data.password))}
                    className="py-1 px-2.5 rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-slate-100 active:scale-95 text-xs font-bold transition-all shadow-2xs"
                  >
                    {t.scanner.copyPassword}
                  </button>
                </div>
              )}
            </div>
          )}

          {result.type === 'vcard' && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-zinc-950/60 border border-slate-300 dark:border-zinc-800 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-900 dark:text-zinc-100">
                <UserCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="font-bold text-sm">{result.data.name || 'Contact'}</span>
                {result.data.org && (
                  <span className="text-slate-500 dark:text-zinc-400 font-medium">({result.data.org})</span>
                )}
              </div>
              {result.data.phone && (
                <div className="text-slate-700 dark:text-zinc-300 font-mono font-bold">
                  Tel: {result.data.phone}
                </div>
              )}
              {result.data.email && (
                <div className="text-slate-700 dark:text-zinc-300 font-mono font-bold">
                  Email: {result.data.email}
                </div>
              )}
              <button
                type="button"
                onClick={() =>
                  downloadVCardFile(result.raw, String(result.data.name))
                }
                className="mt-2 flex items-center gap-1.5 py-1.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold shadow-xs"
              >
                <UserCheck className="w-3.5 h-3.5" />
                {t.scanner.saveContact}
              </button>
            </div>
          )}

          {/* Raw Text Box */}
          <div
            dir="ltr"
            className="p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-950/80 border border-slate-300 dark:border-zinc-700 text-xs font-mono font-medium text-slate-900 dark:text-zinc-100 break-all select-all max-h-48 overflow-y-auto shadow-inner"
          >
            {result.raw}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-2">
            <button
              type="button"
              onClick={() => handleCopy(result.raw)}
              className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl border border-slate-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 hover:border-slate-400 active:scale-95 text-xs font-bold text-slate-800 dark:text-zinc-200 transition-colors shadow-2xs"
            >
              {copied ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
              )}
              {copied ? t.preview.copied : t.scanner.copyResult}
            </button>

            {result.type === 'url' && (
              <button
                type="button"
                onClick={() => setShowConfirmUrlModal(result.raw)}
                className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                {t.scanner.openLink}
              </button>
            )}

            {result.type === 'phone' && (
              <a
                href={result.raw}
                className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-colors"
              >
                <Phone className="w-4 h-4" />
                {t.scanner.dialPhone}
              </a>
            )}

            {result.type === 'email' && (
              <a
                href={result.raw}
                className="flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-colors"
              >
                <Mail className="w-4 h-4" />
                {t.scanner.sendEmail}
              </a>
            )}
          </div>
        </div>
      )}

      {/* URL Safety Confirmation Modal */}
      {showConfirmUrlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="card-elevated rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-600 dark:text-amber-500">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h4 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                {locale === 'fa' ? 'تأیید باز کردن لینک' : 'Security Warning'}
              </h4>
            </div>

            <p className="text-xs font-medium text-slate-600 dark:text-zinc-400 leading-relaxed">
              {t.scanner.openLinkWarn}
            </p>

            <div
              dir="ltr"
              className="p-3 rounded-xl bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 break-all select-all shadow-inner"
            >
              {showConfirmUrlModal}
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowConfirmUrlModal(null)}
                className="py-2 px-4 rounded-xl border border-slate-300 dark:border-zinc-700 text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 shadow-2xs"
              >
                {t.scanner.cancel}
              </button>
              <a
                href={showConfirmUrlModal}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowConfirmUrlModal(null)}
                className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-indigo-600/25 flex items-center gap-1.5 cursor-pointer"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {t.scanner.openLink}
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
