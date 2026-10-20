import { QRTemplate } from '@/types/qr';

export const QR_TEMPLATES: QRTemplate[] = [
  {
    id: 'classic',
    name: {
      fa: 'کلاسیک سیاه و سفید',
      en: 'Classic Black & White',
    },
    options: {
      foregroundColor: '#000000',
      backgroundColor: '#ffffff',
      dotStyle: 'square',
      cornerSquareStyle: 'square',
      cornerDotStyle: 'square',
      cornerSquareColor: '#000000',
      cornerDotColor: '#000000',
    },
  },
  {
    id: 'modern-slate',
    name: {
      fa: 'مدرن سنگی',
      en: 'Modern Slate',
    },
    options: {
      foregroundColor: '#0f172a',
      backgroundColor: '#f8fafc',
      dotStyle: 'rounded',
      cornerSquareStyle: 'rounded',
      cornerDotStyle: 'rounded',
      cornerSquareColor: '#0f172a',
      cornerDotColor: '#0f172a',
    },
  },
  {
    id: 'indigo-tech',
    name: {
      fa: 'نیلی فناوری',
      en: 'Tech Indigo',
    },
    options: {
      foregroundColor: '#4338ca',
      backgroundColor: '#eef2ff',
      dotStyle: 'dots',
      cornerSquareStyle: 'rounded',
      cornerDotStyle: 'dot',
      cornerSquareColor: '#312e81',
      cornerDotColor: '#4338ca',
    },
  },
  {
    id: 'emerald-mint',
    name: {
      fa: 'زمرد و نعنا',
      en: 'Emerald & Mint',
    },
    options: {
      foregroundColor: '#047857',
      backgroundColor: '#ecfdf5',
      dotStyle: 'rounded',
      cornerSquareStyle: 'extra-rounded',
      cornerDotStyle: 'dot',
      cornerSquareColor: '#065f46',
      cornerDotColor: '#047857',
    },
  },
  {
    id: 'sunset-rose',
    name: {
      fa: 'غروب رز',
      en: 'Sunset Rose',
    },
    options: {
      foregroundColor: '#be123c',
      backgroundColor: '#fff1f2',
      dotStyle: 'classy',
      cornerSquareStyle: 'rounded',
      cornerDotStyle: 'rounded',
      cornerSquareColor: '#9f1239',
      cornerDotColor: '#be123c',
    },
  },
  {
    id: 'royal-violet',
    name: {
      fa: 'بنفش رویال',
      en: 'Royal Violet',
    },
    options: {
      foregroundColor: '#6d28d9',
      backgroundColor: '#f5f3ff',
      dotStyle: 'rounded',
      cornerSquareStyle: 'rounded',
      cornerDotStyle: 'dot',
      cornerSquareColor: '#5b21b6',
      cornerDotColor: '#7c3aed',
    },
  },
  {
    id: 'ocean-teal',
    name: {
      fa: 'اقیانوسی فیروزه‌ای',
      en: 'Ocean Teal',
    },
    options: {
      foregroundColor: '#0f766e',
      backgroundColor: '#f0fdfa',
      dotStyle: 'dots',
      cornerSquareStyle: 'dot',
      cornerDotStyle: 'dot',
      cornerSquareColor: '#115e59',
      cornerDotColor: '#0d9488',
    },
  },
  {
    id: 'night-mode',
    name: {
      fa: 'حالت شب معکوس',
      en: 'Inverted Dark',
    },
    options: {
      foregroundColor: '#ffffff',
      backgroundColor: '#09090b',
      dotStyle: 'rounded',
      cornerSquareStyle: 'rounded',
      cornerDotStyle: 'rounded',
      cornerSquareColor: '#ffffff',
      cornerDotColor: '#ffffff',
    },
  },
  {
    id: 'warm-amber',
    name: {
      fa: 'کهربایی گرم',
      en: 'Warm Amber',
    },
    options: {
      foregroundColor: '#b45309',
      backgroundColor: '#fffbeb',
      dotStyle: 'rounded',
      cornerSquareStyle: 'rounded',
      cornerDotStyle: 'dot',
      cornerSquareColor: '#92400e',
      cornerDotColor: '#b45309',
    },
  },
];
