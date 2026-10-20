import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { I18nProvider } from '@/context/I18nContext';
import { ToastProvider } from '@/context/ToastContext';

const cairo = localFont({
  src: './fonts/cairo.ttf',
  variable: '--font-cairo',
  display: 'swap',
  weight: '200 1000',
});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'QR Tools | تولید، شخصی‌سازی و اسکن حرفه‌ای QR Code',
  description:
    'مجموعه ابزار جامع و حرفه‌ای تولید، طراحی، تولید گروهی و اسکن آنی QR Code با پشتیبانی کامل از زبان فارسی و انگلیسی. بدون ارسال داده به سرور و ۱۰۰٪ محلی در مرورگر.',
  keywords: [
    'QR Code',
    'QR Code Generator',
    'QR Scanner',
    'ساخت QR Code',
    'اسکنر QR',
    'تولید بارکد دوبعدی',
    'تولید گروهی QR',
    'QR Code فارسی',
    'شخصی سازی QR',
  ],
  authors: [{ name: 'QR Tools' }],
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },
  openGraph: {
    title: 'QR Tools | جعبه ابزار جامع QR Code',
    description:
      'تولید، شخصی‌سازی، تولید گروهی و اسکن آنی QR Code با حفظ حریم خصوصی ۱۰۰٪ و بدون نیاز به سرور.',
    type: 'website',
    locale: 'fa_IR',
    alternateLocale: ['en_US'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR Tools | جعبه ابزار جامع QR Code',
    description: 'تولید حرفه‌ای، شخصی‌سازی، و اسکن آنی QR Code در مرورگر شما.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning className="h-full">
      <body
        className={`${cairo.variable} font-sans min-h-full flex flex-col antialiased selection:bg-indigo-500/20`}
      >
        <ThemeProvider>
          <I18nProvider>
            <ToastProvider>{children}</ToastProvider>
          </I18nProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
