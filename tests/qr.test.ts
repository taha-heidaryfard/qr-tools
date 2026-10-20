import { describe, expect, it } from 'vitest';
import {
  formatEmail,
  formatPhone,
  formatSms,
  formatSocial,
  formatUrl,
  formatVCard,
  formatWifi,
  parseQRContent,
} from '../src/lib/formats';
import {
  getFinderOrigins,
  isFinderPattern,
  isUnderLogo,
  renderToSVG,
} from '../src/lib/qr-renderer';
import { calculateContrast, checkReadability } from '../src/lib/validator';
import { QROptions } from '../src/types/qr';

describe('QR Formatters', () => {
  it('formats URLs properly', () => {
    expect(formatUrl('example.com')).toBe('https://example.com');
    expect(formatUrl('http://example.com')).toBe('http://example.com');
    expect(formatUrl('https://example.com/path')).toBe('https://example.com/path');
    expect(formatUrl('   ')).toBe('');
  });

  it('formats Wi-Fi strings with escaping', () => {
    const wifi = formatWifi({
      ssid: 'Home;Network',
      password: 'p:a;s\\s',
      encryption: 'WPA',
      hidden: false,
    });
    expect(wifi).toBe('WIFI:T:WPA;S:Home\\;Network;P:p\\:a\\;s\\\\s;H:false;;');

    const nopass = formatWifi({
      ssid: 'OpenNet',
      password: '',
      encryption: 'nopass',
      hidden: true,
    });
    expect(nopass).toBe('WIFI:T:nopass;S:OpenNet;P:;H:true;;');
  });

  it('formats Email strings', () => {
    const email = formatEmail({
      to: 'info@test.com',
      subject: 'Hello World',
      body: 'Message content',
    });
    expect(email).toContain('mailto:info@test.com?');
    expect(email).toContain('subject=Hello+World');
  });

  it('formats Phone & SMS', () => {
    expect(formatPhone({ phone: '+98 912 345 6789' })).toBe('tel:+989123456789');
    expect(formatSms({ phone: '+1-234-567', message: 'Hi' })).toBe('smsto:+1234567:Hi');
  });

  it('formats vCard 3.0', () => {
    const vcard = formatVCard({
      firstName: 'John',
      lastName: 'Doe',
      organization: 'Acme',
      title: 'Dev',
      phone: '123',
      cellPhone: '456',
      email: 'john@acme.com',
      url: 'acme.com',
      street: '1st Ave',
      city: 'NY',
      postalCode: '10001',
      country: 'USA',
      note: 'Note',
    });
    expect(vcard).toContain('BEGIN:VCARD');
    expect(vcard).toContain('VERSION:3.0');
    expect(vcard).toContain('FN:John Doe');
    expect(vcard).toContain('ORG:Acme');
    expect(vcard).toContain('END:VCARD');
  });

  it('formats Social media handles', () => {
    expect(formatSocial({ platform: 'telegram', username: 'john' })).toBe('https://t.me/john');
    expect(formatSocial({ platform: 'whatsapp', username: '+1 234 567' })).toBe('https://wa.me/1234567');
    expect(formatSocial({ platform: 'github', username: '@octocat' })).toBe('https://github.com/octocat');
  });
});

describe('QR Content Parser', () => {
  it('parses Wi-Fi configurations', () => {
    const parsed = parseQRContent('WIFI:T:WPA;S:MyWiFi;P:Secret123;H:false;;');
    expect(parsed.type).toBe('wifi');
    expect(parsed.data.ssid).toBe('MyWiFi');
    expect(parsed.data.password).toBe('Secret123');
  });

  it('parses URLs', () => {
    const parsed = parseQRContent('https://antigravity.google.com');
    expect(parsed.type).toBe('url');
    expect(parsed.data.url).toBe('https://antigravity.google.com');
  });

  it('parses Emails', () => {
    const parsed = parseQRContent('mailto:test@example.com?subject=Test');
    expect(parsed.type).toBe('email');
    expect(parsed.data.to).toBe('test@example.com');
    expect(parsed.data.subject).toBe('Test');
  });

  it('parses Phone and SMS', () => {
    expect(parseQRContent('tel:+123456').type).toBe('phone');
    expect(parseQRContent('smsto:+123456:Hello').type).toBe('sms');
  });
});

describe('QR Matrix and Geometric Calculations', () => {
  it('accurately identifies finder patterns', () => {
    const size = 25; // standard version 2 QR
    // Top-left
    expect(isFinderPattern(0, 0, size)).toBe(true);
    expect(isFinderPattern(6, 6, size)).toBe(true);
    // Top-right
    expect(isFinderPattern(0, 18, size)).toBe(true);
    expect(isFinderPattern(6, 24, size)).toBe(true);
    // Bottom-left
    expect(isFinderPattern(18, 0, size)).toBe(true);
    expect(isFinderPattern(24, 6, size)).toBe(true);

    // Data module area (center)
    expect(isFinderPattern(12, 12, size)).toBe(false);
  });

  it('identifies modules under logo', () => {
    const size = 25;
    expect(isUnderLogo(12, 12, size, 0.25)).toBe(true);
    expect(isUnderLogo(0, 0, size, 0.25)).toBe(false);
  });

  it('returns exactly 3 finder origins', () => {
    const origins = getFinderOrigins(29);
    expect(origins.length).toBe(3);
    expect(origins[0]).toEqual({ row: 0, col: 0 });
  });
});

describe('Readability & Contrast Validator', () => {
  it('calculates contrast correctly', () => {
    const blackWhite = calculateContrast('#000000', '#ffffff');
    expect(blackWhite).toBeGreaterThan(15);

    const lowContrast = calculateContrast('#888888', '#999999');
    expect(lowContrast).toBeLessThan(2);
  });

  it('warns when error correction is low with logo', () => {
    const opts: QROptions = {
      foregroundColor: '#000000',
      backgroundColor: '#ffffff',
      errorCorrectionLevel: 'L',
      size: 300,
      margin: 2,
      dotStyle: 'square',
      cornerSquareStyle: 'square',
      cornerDotStyle: 'square',
      logo: {
        src: 'data:image/svg+xml,...',
        sizeRatio: 0.25,
        padding: 4,
        bgColor: '#ffffff',
        borderRadius: 20,
      },
    };

    const res = checkReadability('https://example.com', opts);
    expect(res.score).toBe('danger');
    expect(res.messages.length).toBeGreaterThan(0);
  });
});

describe('Vector SVG Renderer', () => {
  it('generates valid SVG XML string', async () => {
    const opts: QROptions = {
      foregroundColor: '#2563eb',
      backgroundColor: '#f8fafc',
      errorCorrectionLevel: 'M',
      size: 320,
      margin: 2,
      dotStyle: 'rounded',
      cornerSquareStyle: 'rounded',
      cornerDotStyle: 'dot',
    };

    const svg = await renderToSVG('https://example.com', opts);
    expect(svg).toContain('<?xml version="1.0" encoding="utf-8"?>');
    expect(svg).toContain('<svg');
    expect(svg).toContain('viewBox="0 0 320 320"');
    expect(svg).toContain('fill="#2563eb"');
    expect(svg).toContain('</svg>');
  });
});
