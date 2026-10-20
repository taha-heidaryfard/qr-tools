import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'QR Tools - Complete QR Code Suite',
    short_name: 'QR Tools',
    description: 'Professional QR code generation, styling, batching, and scanning right in your browser.',
    start_url: './',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#2563eb',
    icons: [
      {
        src: 'favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
