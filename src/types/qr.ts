export type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

export type DotStyle = 'square' | 'rounded' | 'dots' | 'classy';

export type CornerSquareStyle = 'square' | 'rounded' | 'extra-rounded' | 'dot';

export type CornerDotStyle = 'square' | 'dot' | 'rounded';

export type ContentType =
  | 'text'
  | 'url'
  | 'wifi'
  | 'email'
  | 'phone'
  | 'sms'
  | 'vcard'
  | 'social';

export type WifiEncryption = 'WPA' | 'WEP' | 'nopass';

export interface WifiData {
  ssid: string;
  password: string;
  encryption: WifiEncryption;
  hidden: boolean;
}

export interface EmailData {
  to: string;
  subject: string;
  body: string;
}

export interface PhoneData {
  phone: string;
}

export interface SmsData {
  phone: string;
  message: string;
}

export interface VCardData {
  firstName: string;
  lastName: string;
  organization: string;
  title: string;
  phone: string;
  cellPhone: string;
  email: string;
  url: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  note: string;
}

export type SocialPlatform =
  | 'whatsapp'
  | 'telegram'
  | 'instagram'
  | 'twitter'
  | 'linkedin'
  | 'github'
  | 'youtube'
  | 'facebook';

export interface SocialData {
  platform: SocialPlatform;
  username: string;
}

export type LogoShape = 'rounded' | 'circle' | 'square' | 'none';

export interface QRLogo {
  src: string;
  sizeRatio: number; // between 0.15 and 0.30
  padding: number;
  bgColor: string;
  borderRadius: number; // percentage (0 = square, 50 = circle)
  shape?: LogoShape;
}

export interface QROptions {
  errorCorrectionLevel: ErrorCorrectionLevel;
  size: number;
  margin: number;
  foregroundColor: string;
  backgroundColor: string;
  dotStyle: DotStyle;
  cornerSquareStyle: CornerSquareStyle;
  cornerDotStyle: CornerDotStyle;
  cornerSquareColor?: string;
  cornerDotColor?: string;
  logo?: QRLogo;
}

export interface QRTemplate {
  id: string;
  name: {
    fa: string;
    en: string;
  };
  options: Partial<QROptions>;
}

export interface ReadabilityCheckResult {
  score: 'good' | 'warning' | 'danger';
  messages: {
    fa: string;
    en: string;
  }[];
  contrastRatio: number;
}
