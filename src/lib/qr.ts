import { renderToDataURL } from './qr-renderer';
import { QROptions } from '@/types/qr';

export async function generateQR(
  text: string,
  options?: Partial<QROptions>
): Promise<string> {
  const defaultOpts: QROptions = {
    errorCorrectionLevel: 'M',
    size: 360,
    margin: 2,
    foregroundColor: '#000000',
    backgroundColor: '#ffffff',
    dotStyle: 'square',
    cornerSquareStyle: 'square',
    cornerDotStyle: 'square',
    ...options,
  };

  return renderToDataURL(text, defaultOpts);
}

export * from './qr-renderer';