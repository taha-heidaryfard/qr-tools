import { QROptions, ReadabilityCheckResult } from '@/types/qr';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    return {
      r: parseInt(clean[0] + clean[0], 16),
      g: parseInt(clean[1] + clean[1], 16),
      b: parseInt(clean[2] + clean[2], 16),
    };
  }
  if (clean.length === 6) {
    return {
      r: parseInt(clean.slice(0, 2), 16),
      g: parseInt(clean.slice(2, 4), 16),
      b: parseInt(clean.slice(4, 6), 16),
    };
  }
  return null;
}

function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function calculateContrast(color1: string, color2: string): number {
  if (color2 === 'transparent') {
    // Assume white background for contrast calculation
    color2 = '#ffffff';
  }
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) return 21; // fallback safe

  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
}

export function checkReadability(text: string, options: QROptions): ReadabilityCheckResult {
  const messages: { fa: string; en: string }[] = [];
  let score: 'good' | 'warning' | 'danger' = 'good';

  const contrast = calculateContrast(options.foregroundColor, options.backgroundColor);

  if (contrast < 2.5) {
    score = 'danger';
    messages.push({
      fa: 'کنتراست بین رنگ QR و پس‌زمینه بسیار کم است. ممکن است دوربین‌ها قادر به خواندن آن نباشند.',
      en: 'Contrast between QR color and background is critically low. Cameras may fail to scan it.',
    });
  } else if (contrast < 4.5) {
    score = 'warning';
    messages.push({
      fa: 'کنتراست رنگ‌ها متوسط است. در محیط‌های کم‌نور ممکن است اسکن سخت‌تر شود.',
      en: 'Color contrast is moderate. Scanning may be difficult in low-light environments.',
    });
  }

  // Check error correction level when logo is present
  if (options.logo?.src) {
    if (options.errorCorrectionLevel === 'L') {
      score = 'danger';
      messages.push({
        fa: 'هنگام استفاده از لوگو، سطح تصحیح خطای L ممکن است باعث غیرقابل خواندن شدن QR شود. سطح H یا Q را انتخاب کنید.',
        en: 'Using a logo with error correction level L may make the QR unreadable. Please choose level H or Q.',
      });
    } else if (options.errorCorrectionLevel === 'M') {
      if (score !== 'danger') score = 'warning';
      messages.push({
        fa: 'برای اسکن بهتر هنگام استفاده از لوگو، سطح تصحیح خطای H توصیه می‌شود.',
        en: 'For optimal scanning reliability with a logo, error correction level H is recommended.',
      });
    }

    if (options.logo.sizeRatio > 0.28) {
      if (score !== 'danger') score = 'warning';
      messages.push({
        fa: 'اندازه لوگو بزرگ است و بخش زیادی از کد را می‌پوشاند.',
        en: 'Logo size is relatively large and obscures significant QR data.',
      });
    }
  }

  // Text length warning
  if (text.length > 1500) {
    if (score !== 'danger') score = 'warning';
    messages.push({
      fa: 'حجم داده بالاست و دانسیته نقاط QR بسیار زیاد خواهد شد. برای اسکن راحت‌تر، از لینک کوتاه‌تر استفاده کنید.',
      en: 'Data length is very high resulting in dense QR dots. Consider a shorter link for easier scanning.',
    });
  }

  if (messages.length === 0) {
    messages.push({
      fa: 'خوانایی و تنظیمات QR بسیار مطلوب است.',
      en: 'QR readability and settings look optimal.',
    });
  }

  return {
    score,
    messages,
    contrastRatio: Number(contrast.toFixed(2)),
  };
}
