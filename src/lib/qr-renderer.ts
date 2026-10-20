import QRCode from 'qrcode';
import { QROptions } from '@/types/qr';

interface FinderPosition {
  row: number;
  col: number;
}

export function isFinderPattern(row: number, col: number, matrixSize: number): boolean {
  if (row < 7 && col < 7) return true; // Top-left
  if (row < 7 && col >= matrixSize - 7) return true; // Top-right
  if (row >= matrixSize - 7 && col < 7) return true; // Bottom-left
  return false;
}

export function getFinderOrigins(matrixSize: number): FinderPosition[] {
  return [
    { row: 0, col: 0 },
    { row: 0, col: matrixSize - 7 },
    { row: matrixSize - 7, col: 0 },
  ];
}

// Calculate mathematically symmetrical clearance around center for logo
export function getLogoModuleClearance(matrixSize: number, logoRatio: number): {
  halfK: number;
  count: number;
  center: number;
} {
  const center = (matrixSize - 1) / 2;
  // Compute integer module radius so clearance is 100% symmetrical
  const halfK = Math.max(1, Math.floor((matrixSize * (logoRatio || 0.22)) / 2));
  return {
    halfK,
    count: halfK * 2 + 1,
    center,
  };
}

export function isUnderLogo(
  row: number,
  col: number,
  matrixSize: number,
  logoRatio: number
): boolean {
  if (!logoRatio) return false;
  const { halfK, center } = getLogoModuleClearance(matrixSize, logoRatio);
  return (
    Math.abs(row - center) <= halfK &&
    Math.abs(col - center) <= halfK
  );
}

// Helper to draw rounded rectangle in Canvas
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Generate SVG path for a rounded rectangle
function svgRoundedRectPath(x: number, y: number, w: number, h: number, r: number): string {
  const radius = Math.min(r, w / 2, h / 2);
  return `M${x + radius},${y} ` +
    `L${x + w - radius},${y} ` +
    `Q${x + w},${y} ${x + w},${y + radius} ` +
    `L${x + w},${y + h - radius} ` +
    `Q${x + w},${y + h} ${x + w - radius},${y + h} ` +
    `L${x + radius},${y + h} ` +
    `Q${x},${y + h} ${x},${y + h - radius} ` +
    `L${x},${y + radius} ` +
    `Q${x},${y} ${x + radius},${y} Z`;
}

// Generate QR BitMatrix from qrcode library
export function createQRMatrix(text: string, level: QROptions['errorCorrectionLevel']) {
  return QRCode.create(text || ' ', {
    errorCorrectionLevel: level || 'M',
  });
}

// Render QR to an HTML Canvas with natural logo integration
export async function renderToCanvas(
  canvas: HTMLCanvasElement,
  text: string,
  options: QROptions
): Promise<void> {
  const qr = createQRMatrix(text, options.errorCorrectionLevel);
  const matrixSize = qr.modules.size;
  const margin = options.margin ?? 2;
  const totalModules = matrixSize + margin * 2;
  const size = options.size || 360;
  const cellSize = size / totalModules;

  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Clear / Background
  ctx.clearRect(0, 0, size, size);
  if (options.backgroundColor && options.backgroundColor !== 'transparent') {
    ctx.fillStyle = options.backgroundColor;
    ctx.fillRect(0, 0, size, size);
  }

  const fgColor = options.foregroundColor || '#000000';
  const cornerSquareColor = options.cornerSquareColor || fgColor;
  const cornerDotColor = options.cornerDotColor || fgColor;

  // Draw 3 Finder Patterns
  const finders = getFinderOrigins(matrixSize);
  for (const finder of finders) {
    const ox = (finder.col + margin) * cellSize;
    const oy = (finder.row + margin) * cellSize;
    const outerDim = 7 * cellSize;
    const innerRingOffset = 1 * cellSize;
    const innerRingDim = 5 * cellSize;
    const centerDim = 3 * cellSize;
    const centerOffset = 2 * cellSize;

    // Draw Outer 7x7 Frame
    ctx.fillStyle = cornerSquareColor;
    ctx.beginPath();

    let outerRadius = 0;
    if (options.cornerSquareStyle === 'rounded') {
      outerRadius = 1.6 * cellSize;
    } else if (options.cornerSquareStyle === 'extra-rounded' || options.cornerSquareStyle === 'dot') {
      outerRadius = 3.5 * cellSize;
    }

    if (outerRadius > 0) {
      drawRoundedRect(ctx, ox, oy, outerDim, outerDim, outerRadius);
    } else {
      ctx.rect(ox, oy, outerDim, outerDim);
    }

    // Cut out inner 5x5 hollow
    const cutoutBg =
      options.backgroundColor && options.backgroundColor !== 'transparent'
        ? options.backgroundColor
        : '#ffffff';

    ctx.fill();

    ctx.fillStyle = cutoutBg;
    ctx.beginPath();
    let innerCutoutRadius = 0;
    if (options.cornerSquareStyle === 'rounded') {
      innerCutoutRadius = 1.0 * cellSize;
    } else if (options.cornerSquareStyle === 'extra-rounded' || options.cornerSquareStyle === 'dot') {
      innerCutoutRadius = 2.5 * cellSize;
    }

    if (innerCutoutRadius > 0) {
      drawRoundedRect(
        ctx,
        ox + innerRingOffset,
        oy + innerRingOffset,
        innerRingDim,
        innerRingDim,
        innerCutoutRadius
      );
    } else {
      ctx.rect(ox + innerRingOffset, oy + innerRingOffset, innerRingDim, innerRingDim);
    }
    ctx.fill();

    // Draw Inner Center 3x3 Dot
    ctx.fillStyle = cornerDotColor;
    ctx.beginPath();
    const cx = ox + centerOffset;
    const cy = oy + centerOffset;

    if (options.cornerDotStyle === 'dot') {
      ctx.arc(cx + centerDim / 2, cy + centerDim / 2, centerDim / 2, 0, Math.PI * 2);
    } else if (options.cornerDotStyle === 'rounded') {
      drawRoundedRect(ctx, cx, cy, centerDim, centerDim, 0.9 * cellSize);
    } else {
      ctx.rect(cx, cy, centerDim, centerDim);
    }
    ctx.fill();
  }

  // Draw Data Modules
  ctx.fillStyle = fgColor;
  const logoRatio = options.logo?.src ? options.logo.sizeRatio : 0;

  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      if (isFinderPattern(r, c, matrixSize)) continue;
      if (logoRatio && isUnderLogo(r, c, matrixSize, logoRatio)) continue;

      if (qr.modules.get(r, c)) {
        const x = (c + margin) * cellSize;
        const y = (r + margin) * cellSize;

        if (options.dotStyle === 'dots') {
          ctx.beginPath();
          ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize * 0.44, 0, Math.PI * 2);
          ctx.fill();
        } else if (options.dotStyle === 'rounded') {
          const pad = cellSize * 0.08;
          ctx.beginPath();
          drawRoundedRect(
            ctx,
            x + pad,
            y + pad,
            cellSize - 2 * pad,
            cellSize - 2 * pad,
            cellSize * 0.35
          );
          ctx.fill();
        } else if (options.dotStyle === 'classy') {
          ctx.beginPath();
          const half = cellSize / 2;
          ctx.moveTo(x + half, y + cellSize * 0.05);
          ctx.lineTo(x + cellSize * 0.95, y + half);
          ctx.lineTo(x + half, y + cellSize * 0.95);
          ctx.lineTo(x + cellSize * 0.05, y + half);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillRect(x, y, cellSize + 0.2, cellSize + 0.2);
        }
      }
    }
  }

  // Render Natural, High-End Logo Badge
  if (options.logo?.src) {
    await new Promise<void>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const { count } = getLogoModuleClearance(matrixSize, options.logo!.sizeRatio);
        const clearDim = count * cellSize;
        // Badge size is harmonized with the symmetrical clearance
        const badgeSize = clearDim - cellSize * 0.25;
        const bx = (size - badgeSize) / 2;
        const by = (size - badgeSize) / 2;
        const centerPos = size / 2;
        const shape = options.logo!.shape || 'rounded';

        // Draw soft depth shadow & badge background (if not transparent)
        if (shape !== 'none') {
          ctx.save();
          ctx.shadowColor = 'rgba(0, 0, 0, 0.12)';
          ctx.shadowBlur = Math.max(6, cellSize * 1.5);
          ctx.shadowOffsetY = Math.max(1, cellSize * 0.25);

          const badgeBg = options.logo!.bgColor || '#ffffff';
          ctx.fillStyle = badgeBg;

          if (shape === 'circle') {
            ctx.beginPath();
            ctx.arc(centerPos, centerPos, badgeSize / 2, 0, Math.PI * 2);
            ctx.fill();
          } else if (shape === 'square') {
            ctx.beginPath();
            drawRoundedRect(ctx, bx, by, badgeSize, badgeSize, cellSize * 0.3);
            ctx.fill();
          } else {
            // Rounded
            const radius = badgeSize * ((options.logo!.borderRadius ?? 22) / 100);
            ctx.beginPath();
            drawRoundedRect(ctx, bx, by, badgeSize, badgeSize, radius);
            ctx.fill();
          }
          ctx.restore();

          // Draw subtle, elegant badge border for clean edge definition
          ctx.save();
          ctx.strokeStyle = 'rgba(0, 0, 0, 0.07)';
          ctx.lineWidth = 1.2;
          if (shape === 'circle') {
            ctx.beginPath();
            ctx.arc(centerPos, centerPos, badgeSize / 2, 0, Math.PI * 2);
            ctx.stroke();
          } else if (shape === 'square') {
            ctx.beginPath();
            drawRoundedRect(ctx, bx, by, badgeSize, badgeSize, cellSize * 0.3);
            ctx.stroke();
          } else {
            const radius = badgeSize * ((options.logo!.borderRadius ?? 22) / 100);
            ctx.beginPath();
            drawRoundedRect(ctx, bx, by, badgeSize, badgeSize, radius);
            ctx.stroke();
          }
          ctx.restore();
        }

        // Draw user logo with TRUE aspect ratio preservation (object-fit: contain)
        const padding = options.logo!.padding ?? Math.round(badgeSize * 0.14);
        const maxContentSize = Math.max(10, badgeSize - padding * 2);

        const imgWidth = img.naturalWidth || maxContentSize;
        const imgHeight = img.naturalHeight || maxContentSize;
        const scale = Math.min(maxContentSize / imgWidth, maxContentSize / imgHeight);
        const drawW = imgWidth * scale;
        const drawH = imgHeight * scale;
        const drawX = (size - drawW) / 2;
        const drawY = (size - drawH) / 2;

        ctx.save();
        // Clip inside badge area if shaped
        if (shape === 'circle') {
          ctx.beginPath();
          ctx.arc(centerPos, centerPos, badgeSize / 2 - 1, 0, Math.PI * 2);
          ctx.clip();
        } else if (shape === 'rounded') {
          const radius = badgeSize * ((options.logo!.borderRadius ?? 22) / 100);
          ctx.beginPath();
          drawRoundedRect(ctx, bx + 1, by + 1, badgeSize - 2, badgeSize - 2, Math.max(0, radius - 1));
          ctx.clip();
        }

        ctx.drawImage(img, drawX, drawY, drawW, drawH);
        ctx.restore();

        resolve();
      };

      img.onerror = () => {
        resolve();
      };
      img.src = options.logo!.src;
    });
  }
}

// Generate Data URL (PNG)
export async function renderToDataURL(text: string, options: QROptions): Promise<string> {
  if (typeof document === 'undefined') {
    return QRCode.toDataURL(text || ' ', {
      errorCorrectionLevel: options.errorCorrectionLevel,
      margin: options.margin,
      width: options.size,
      color: {
        dark: options.foregroundColor,
        light: options.backgroundColor,
      },
    });
  }

  const canvas = document.createElement('canvas');
  await renderToCanvas(canvas, text, options);
  return canvas.toDataURL('image/png');
}

// Generate scalable SVG string with natural logo integration
export async function renderToSVG(text: string, options: QROptions): Promise<string> {
  const qr = createQRMatrix(text, options.errorCorrectionLevel);
  const matrixSize = qr.modules.size;
  const margin = options.margin ?? 2;
  const totalModules = matrixSize + margin * 2;
  const size = options.size || 360;
  const cellSize = size / totalModules;

  const fgColor = options.foregroundColor || '#000000';
  const bgColor = options.backgroundColor || '#ffffff';
  const cornerSquareColor = options.cornerSquareColor || fgColor;
  const cornerDotColor = options.cornerDotColor || fgColor;

  let defs = '';
  let svgElements = '';

  // Background
  if (bgColor !== 'transparent') {
    svgElements += `<rect width="${size}" height="${size}" fill="${bgColor}" />\n`;
  }

  // Finder Patterns
  const finders = getFinderOrigins(matrixSize);
  for (const finder of finders) {
    const ox = (finder.col + margin) * cellSize;
    const oy = (finder.row + margin) * cellSize;
    const outerDim = 7 * cellSize;
    const innerDim = 5 * cellSize;
    const innerOffset = 1 * cellSize;
    const centerDim = 3 * cellSize;
    const centerOffset = 2 * cellSize;

    let outerRadius = 0;
    if (options.cornerSquareStyle === 'rounded') outerRadius = 1.6 * cellSize;
    else if (options.cornerSquareStyle === 'extra-rounded' || options.cornerSquareStyle === 'dot')
      outerRadius = 3.5 * cellSize;

    let innerRadius = 0;
    if (options.cornerSquareStyle === 'rounded') innerRadius = 1.0 * cellSize;
    else if (options.cornerSquareStyle === 'extra-rounded' || options.cornerSquareStyle === 'dot')
      innerRadius = 2.5 * cellSize;

    if (outerRadius > 0) {
      svgElements += `<path d="${svgRoundedRectPath(
        ox,
        oy,
        outerDim,
        outerDim,
        outerRadius
      )}" fill="${cornerSquareColor}" />\n`;
    } else {
      svgElements += `<rect x="${ox}" y="${oy}" width="${outerDim}" height="${outerDim}" fill="${cornerSquareColor}" />\n`;
    }

    const cutoutBg = bgColor === 'transparent' ? '#ffffff' : bgColor;
    if (innerRadius > 0) {
      svgElements += `<path d="${svgRoundedRectPath(
        ox + innerOffset,
        oy + innerOffset,
        innerDim,
        innerDim,
        innerRadius
      )}" fill="${cutoutBg}" />\n`;
    } else {
      svgElements += `<rect x="${ox + innerOffset}" y="${oy + innerOffset}" width="${innerDim}" height="${innerDim}" fill="${cutoutBg}" />\n`;
    }

    const cx = ox + centerOffset;
    const cy = oy + centerOffset;
    if (options.cornerDotStyle === 'dot') {
      svgElements += `<circle cx="${cx + centerDim / 2}" cy="${cy + centerDim / 2}" r="${
        centerDim / 2
      }" fill="${cornerDotColor}" />\n`;
    } else if (options.cornerDotStyle === 'rounded') {
      svgElements += `<path d="${svgRoundedRectPath(
        cx,
        cy,
        centerDim,
        centerDim,
        0.9 * cellSize
      )}" fill="${cornerDotColor}" />\n`;
    } else {
      svgElements += `<rect x="${cx}" y="${cy}" width="${centerDim}" height="${centerDim}" fill="${cornerDotColor}" />\n`;
    }
  }

  // Data Dots
  const logoRatio = options.logo?.src ? options.logo.sizeRatio : 0;
  for (let r = 0; r < matrixSize; r++) {
    for (let c = 0; c < matrixSize; c++) {
      if (isFinderPattern(r, c, matrixSize)) continue;
      if (logoRatio && isUnderLogo(r, c, matrixSize, logoRatio)) continue;

      if (qr.modules.get(r, c)) {
        const x = (c + margin) * cellSize;
        const y = (r + margin) * cellSize;

        if (options.dotStyle === 'dots') {
          svgElements += `<circle cx="${x + cellSize / 2}" cy="${
            y + cellSize / 2
          }" r="${cellSize * 0.44}" fill="${fgColor}" />\n`;
        } else if (options.dotStyle === 'rounded') {
          const pad = cellSize * 0.08;
          svgElements += `<path d="${svgRoundedRectPath(
            x + pad,
            y + pad,
            cellSize - 2 * pad,
            cellSize - 2 * pad,
            cellSize * 0.35
          )}" fill="${fgColor}" />\n`;
        } else if (options.dotStyle === 'classy') {
          const half = cellSize / 2;
          svgElements += `<polygon points="${x + half},${y + cellSize * 0.05} ${
            x + cellSize * 0.95
          },${y + half} ${x + half},${y + cellSize * 0.95} ${x + cellSize * 0.05},${
            y + half
          }" fill="${fgColor}" />\n`;
        } else {
          svgElements += `<rect x="${x}" y="${y}" width="${cellSize + 0.1}" height="${
            cellSize + 0.1
          }" fill="${fgColor}" />\n`;
        }
      }
    }
  }

  // Logo in SVG with clean shadow and badge
  if (options.logo?.src) {
    const { count } = getLogoModuleClearance(matrixSize, options.logo.sizeRatio);
    const clearDim = count * cellSize;
    const badgeSize = clearDim - cellSize * 0.25;
    const bx = (size - badgeSize) / 2;
    const by = (size - badgeSize) / 2;
    const centerPos = size / 2;
    const shape = options.logo.shape || 'rounded';
    const shieldBg = options.logo.bgColor || '#ffffff';
    const padding = options.logo.padding ?? Math.round(badgeSize * 0.14);
    const maxContent = Math.max(10, badgeSize - padding * 2);

    defs += `
    <filter id="qr-logo-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.12" />
    </filter>`;

    if (shape !== 'none') {
      if (shape === 'circle') {
        svgElements += `<circle cx="${centerPos}" cy="${centerPos}" r="${
          badgeSize / 2
        }" fill="${shieldBg}" stroke="rgba(0,0,0,0.07)" stroke-width="1.2" filter="url(#qr-logo-shadow)" />\n`;
      } else if (shape === 'square') {
        svgElements += `<rect x="${bx}" y="${by}" width="${badgeSize}" height="${badgeSize}" rx="${
          cellSize * 0.3
        }" fill="${shieldBg}" stroke="rgba(0,0,0,0.07)" stroke-width="1.2" filter="url(#qr-logo-shadow)" />\n`;
      } else {
        const radius = badgeSize * ((options.logo.borderRadius ?? 22) / 100);
        svgElements += `<path d="${svgRoundedRectPath(
          bx,
          by,
          badgeSize,
          badgeSize,
          radius
        )}" fill="${shieldBg}" stroke="rgba(0,0,0,0.07)" stroke-width="1.2" filter="url(#qr-logo-shadow)" />\n`;
      }
    }

    svgElements += `<image href="${options.logo.src}" x="${(size - maxContent) / 2}" y="${
      (size - maxContent) / 2
    }" width="${maxContent}" height="${maxContent}" preserveAspectRatio="xMidYMid meet" />\n`;
  }

  return `<?xml version="1.0" encoding="utf-8"?>
<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
<defs>${defs}</defs>
${svgElements}</svg>`;
}
