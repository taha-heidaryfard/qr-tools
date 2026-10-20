import {
  EmailData,
  PhoneData,
  SmsData,
  SocialData,
  SocialPlatform,
  VCardData,
  WifiData,
} from '@/types/qr';

export function formatUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return '';
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:\/\//.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

function escapeWifiString(str: string): string {
  return str.replace(/([\\;,:"])/g, '\\$1');
}

export function formatWifi(data: WifiData): string {
  const ssid = escapeWifiString(data.ssid.trim());
  const pass = data.encryption === 'nopass' ? '' : escapeWifiString(data.password);
  const enc = data.encryption || 'WPA';
  const hidden = data.hidden ? 'true' : 'false';
  return `WIFI:T:${enc};S:${ssid};P:${pass};H:${hidden};;`;
}

export function formatEmail(data: EmailData): string {
  const to = data.to.trim();
  const params = new URLSearchParams();
  if (data.subject.trim()) params.append('subject', data.subject.trim());
  if (data.body.trim()) params.append('body', data.body.trim());
  const query = params.toString();
  return query ? `mailto:${to}?${query}` : `mailto:${to}`;
}

export function formatPhone(data: PhoneData): string {
  const clean = data.phone.replace(/[\s-]/g, '').trim();
  return `tel:${clean}`;
}

export function formatSms(data: SmsData): string {
  const clean = data.phone.replace(/[\s-]/g, '').trim();
  return `smsto:${clean}:${data.message.trim()}`;
}

export function formatVCard(data: VCardData): string {
  const lines: string[] = ['BEGIN:VCARD', 'VERSION:3.0'];

  const n = `${data.lastName.trim()};${data.firstName.trim()};;;`;
  lines.push(`N:${n}`);

  const fn = [data.firstName.trim(), data.lastName.trim()].filter(Boolean).join(' ');
  if (fn) lines.push(`FN:${fn}`);

  if (data.organization.trim()) {
    lines.push(`ORG:${data.organization.trim()}`);
  }
  if (data.title.trim()) {
    lines.push(`TITLE:${data.title.trim()}`);
  }
  if (data.phone.trim()) {
    lines.push(`TEL;TYPE=WORK,VOICE:${data.phone.trim()}`);
  }
  if (data.cellPhone.trim()) {
    lines.push(`TEL;TYPE=CELL,VOICE:${data.cellPhone.trim()}`);
  }
  if (data.email.trim()) {
    lines.push(`EMAIL;TYPE=PREF,INTERNET:${data.email.trim()}`);
  }
  if (data.url.trim()) {
    lines.push(`URL:${formatUrl(data.url)}`);
  }
  if (data.street.trim() || data.city.trim() || data.postalCode.trim() || data.country.trim()) {
    lines.push(
      `ADR;TYPE=WORK:;;${data.street.trim()};${data.city.trim()};;${data.postalCode.trim()};${data.country.trim()}`
    );
  }
  if (data.note.trim()) {
    lines.push(`NOTE:${data.note.trim().replace(/\n/g, '\\n')}`);
  }

  lines.push('END:VCARD');
  return lines.join('\n');
}

export function formatSocial(data: SocialData): string {
  let user = data.username.trim();
  if (user.startsWith('@')) user = user.substring(1);
  if (!user) return '';

  // If user pasted a full URL, return formatted URL
  if (user.startsWith('http://') || user.startsWith('https://')) {
    return user;
  }

  const map: Record<SocialPlatform, (u: string) => string> = {
    whatsapp: (u) => `https://wa.me/${u.replace(/[^0-9]/g, '')}`,
    telegram: (u) => `https://t.me/${u}`,
    instagram: (u) => `https://instagram.com/${u}`,
    twitter: (u) => `https://x.com/${u}`,
    linkedin: (u) => `https://linkedin.com/in/${u}`,
    github: (u) => `https://github.com/${u}`,
    youtube: (u) => `https://youtube.com/@${u}`,
    facebook: (u) => `https://facebook.com/${u}`,
  };

  const formatter = map[data.platform];
  return formatter ? formatter(user) : user;
}

export interface ParsedQR {
  type: 'url' | 'wifi' | 'email' | 'phone' | 'sms' | 'vcard' | 'text';
  raw: string;
  data: Record<string, string | boolean>;
}

export function parseQRContent(content: string): ParsedQR {
  const text = content.trim();

  // Wi-Fi
  if (text.startsWith('WIFI:') || text.startsWith('wifi:')) {
    const ssidMatch = text.match(/S:([^;]+)/);
    const passMatch = text.match(/P:([^;]*)/);
    const typeMatch = text.match(/T:([^;]*)/);
    const hiddenMatch = text.match(/H:([^;]*)/);
    return {
      type: 'wifi',
      raw: text,
      data: {
        ssid: ssidMatch ? ssidMatch[1].replace(/\\([\\;,:"])/g, '$1') : '',
        password: passMatch ? passMatch[1].replace(/\\([\\;,:"])/g, '$1') : '',
        encryption: typeMatch ? typeMatch[1] : 'WPA',
        hidden: hiddenMatch ? hiddenMatch[1].toLowerCase() === 'true' : false,
      },
    };
  }

  // vCard
  if (/^BEGIN:VCARD/i.test(text)) {
    const fnMatch = text.match(/\nFN:(.*)/i);
    const telMatch = text.match(/\nTEL[^:]*:(.*)/i);
    const emailMatch = text.match(/\nEMAIL[^:]*:(.*)/i);
    const orgMatch = text.match(/\nORG:(.*)/i);
    return {
      type: 'vcard',
      raw: text,
      data: {
        name: fnMatch ? fnMatch[1].trim() : '',
        phone: telMatch ? telMatch[1].trim() : '',
        email: emailMatch ? emailMatch[1].trim() : '',
        org: orgMatch ? orgMatch[1].trim() : '',
      },
    };
  }

  // Email
  if (/^mailto:/i.test(text)) {
    const withoutPrefix = text.replace(/^mailto:/i, '');
    const [emailPart, queryPart] = withoutPrefix.split('?');
    const params = new URLSearchParams(queryPart || '');
    return {
      type: 'email',
      raw: text,
      data: {
        to: decodeURIComponent(emailPart || ''),
        subject: params.get('subject') || '',
        body: params.get('body') || '',
      },
    };
  }

  // Phone
  if (/^tel:/i.test(text)) {
    return {
      type: 'phone',
      raw: text,
      data: {
        phone: text.replace(/^tel:/i, '').trim(),
      },
    };
  }

  // SMS
  if (/^smsto:/i.test(text)) {
    const withoutPrefix = text.replace(/^smsto:/i, '');
    const colonIndex = withoutPrefix.indexOf(':');
    const phone = colonIndex > -1 ? withoutPrefix.slice(0, colonIndex) : withoutPrefix;
    const message = colonIndex > -1 ? withoutPrefix.slice(colonIndex + 1) : '';
    return {
      type: 'sms',
      raw: text,
      data: {
        phone: phone.trim(),
        message: message.trim(),
      },
    };
  }

  // URL
  if (/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i.test(text)) {
    return {
      type: 'url',
      raw: text,
      data: {
        url: text,
      },
    };
  }

  // Plain Text
  return {
    type: 'text',
    raw: text,
    data: {
      text,
    },
  };
}
