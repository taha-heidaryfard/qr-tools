'use client';

import React, { useMemo, useState } from 'react';
import {
  FileText,
  Globe,
  Mail,
  MessageSquare,
  Phone,
  Share2,
  Sparkles,
  UserCheck,
  Wifi,
} from 'lucide-react';
import { useI18n } from '@/context/I18nContext';
import {
  formatEmail,
  formatPhone,
  formatSms,
  formatSocial,
  formatUrl,
  formatVCard,
  formatWifi,
} from '@/lib/formats';
import {
  ContentType,
  EmailData,
  PhoneData,
  QROptions,
  SmsData,
  SocialData,
  VCardData,
  WifiData,
} from '@/types/qr';
import { EmailForm } from './forms/EmailForm';
import { PhoneForm } from './forms/PhoneForm';
import { SmsForm } from './forms/SmsForm';
import { SocialForm } from './forms/SocialForm';
import { TextForm } from './forms/TextForm';
import { UrlForm } from './forms/UrlForm';
import { VCardForm } from './forms/VCardForm';
import { WifiForm } from './forms/WifiForm';
import { QRCustomizer } from './QRCustomizer';
import { QRPreview } from './QRPreview';

const DEFAULT_OPTIONS: QROptions = {
  errorCorrectionLevel: 'M',
  size: 380,
  margin: 2,
  foregroundColor: '#0f172a',
  backgroundColor: '#ffffff',
  dotStyle: 'rounded',
  cornerSquareStyle: 'rounded',
  cornerDotStyle: 'rounded',
};

export function QRGenerator() {
  const { t, locale } = useI18n();

  const [contentType, setContentType] = useState<ContentType>('url');
  const [options, setOptions] = useState<QROptions>(DEFAULT_OPTIONS);

  // Form states
  const [textVal, setTextVal] = useState('https://github.com');
  const [urlVal, setUrlVal] = useState('https://github.com');
  const [wifiVal, setWifiVal] = useState<WifiData>({
    ssid: 'FastFiber_5G',
    password: 'SecurePassword2026',
    encryption: 'WPA',
    hidden: false,
  });
  const [emailVal, setEmailVal] = useState<EmailData>({
    to: 'contact@example.com',
    subject: 'Project Inquiry',
    body: 'Hi, I would like to get in touch.',
  });
  const [phoneVal, setPhoneVal] = useState<PhoneData>({
    phone: '+989123456789',
  });
  const [smsVal, setSmsVal] = useState<SmsData>({
    phone: '+989123456789',
    message: 'Hello! I scanned your QR code.',
  });
  const [vcardVal, setVcardVal] = useState<VCardData>({
    firstName: 'Sarah',
    lastName: 'Tehrani',
    organization: 'Creative Studio',
    title: 'Lead Product Designer',
    phone: '+982188888888',
    cellPhone: '+989123456789',
    email: 'sarah@creativestudio.ir',
    url: 'https://creativestudio.ir',
    street: 'Valiasr Ave',
    city: 'Tehran',
    postalCode: '1900000000',
    country: 'Iran',
    note: 'Let’s build something amazing together.',
  });
  const [socialVal, setSocialVal] = useState<SocialData>({
    platform: 'telegram',
    username: 'durov',
  });

  // Calculate encoded content in real-time
  const encodedContent = useMemo(() => {
    switch (contentType) {
      case 'text':
        return textVal;
      case 'url':
        return formatUrl(urlVal);
      case 'wifi':
        return formatWifi(wifiVal);
      case 'email':
        return formatEmail(emailVal);
      case 'phone':
        return formatPhone(phoneVal);
      case 'sms':
        return formatSms(smsVal);
      case 'vcard':
        return formatVCard(vcardVal);
      case 'social':
        return formatSocial(socialVal);
      default:
        return textVal;
    }
  }, [
    contentType,
    textVal,
    urlVal,
    wifiVal,
    emailVal,
    phoneVal,
    smsVal,
    vcardVal,
    socialVal,
  ]);

  const typeTabs: { id: ContentType; label: string; icon: React.ReactNode }[] = [
    { id: 'url', label: t.types.url, icon: <Globe className="w-4 h-4" /> },
    { id: 'text', label: t.types.text, icon: <FileText className="w-4 h-4" /> },
    { id: 'wifi', label: t.types.wifi, icon: <Wifi className="w-4 h-4" /> },
    { id: 'vcard', label: t.types.vcard, icon: <UserCheck className="w-4 h-4" /> },
    { id: 'social', label: t.types.social, icon: <Share2 className="w-4 h-4" /> },
    { id: 'email', label: t.types.email, icon: <Mail className="w-4 h-4" /> },
    { id: 'phone', label: t.types.phone, icon: <Phone className="w-4 h-4" /> },
    { id: 'sms', label: t.types.sms, icon: <MessageSquare className="w-4 h-4" /> },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Form & Customizer (7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        {/* Content Type Selector */}
        <div className="card-elevated rounded-3xl p-3 sm:p-4 transition-all">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {typeTabs.map((tab) => {
              const isActive = contentType === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setContentType(tab.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all duration-200 active:scale-95 ${
                    isActive
                      ? 'bg-indigo-600 text-white border border-indigo-600 shadow-md shadow-indigo-600/30 scale-[1.02]'
                      : 'bg-slate-50 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <span className={`${isActive ? 'text-white' : 'text-indigo-600 dark:text-indigo-400'}`}>
                    {tab.icon}
                  </span>
                  <span className="truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Input Card with quick status */}
        <div className="card-elevated rounded-3xl p-6 space-y-5 transition-all">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-zinc-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
              {locale === 'fa' ? 'اطلاعات ورودی محتوا' : 'Content Parameters'}
            </span>
            <span className="text-xs font-mono font-semibold text-slate-600 dark:text-zinc-400 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              {encodedContent.length} bytes
            </span>
          </div>

          {contentType === 'url' && <UrlForm value={urlVal} onChange={setUrlVal} />}
          {contentType === 'text' && <TextForm value={textVal} onChange={setTextVal} />}
          {contentType === 'wifi' && <WifiForm data={wifiVal} onChange={setWifiVal} />}
          {contentType === 'email' && <EmailForm data={emailVal} onChange={setEmailVal} />}
          {contentType === 'phone' && <PhoneForm data={phoneVal} onChange={setPhoneVal} />}
          {contentType === 'sms' && <SmsForm data={smsVal} onChange={setSmsVal} />}
          {contentType === 'vcard' && <VCardForm data={vcardVal} onChange={setVcardVal} />}
          {contentType === 'social' && <SocialForm data={socialVal} onChange={setSocialVal} />}
        </div>

        {/* Visual Customization Card */}
        <QRCustomizer
          text={encodedContent}
          options={options}
          onChange={setOptions}
        />
      </div>

      {/* Right Column: Sticky Live Preview (5 cols) */}
      <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
        <QRPreview text={encodedContent} options={options} />
      </div>
    </div>
  );
}
