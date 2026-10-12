import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../..');

export function makePlateSvg(width, height) {
  const indW = Math.round(width * 0.10);
  const textLeft = indW + Math.round(width * 0.04);
  const textW = width - textLeft - Math.round(width * 0.04);
  const fs1 = Math.round(height * 0.28);
  const fs2 = Math.round(height * 0.25);
  const y1 = Math.round(height * 0.42);
  const y2 = Math.round(height * 0.80);

  return `
  <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="3" fill="#FFD000" stroke="#111111" stroke-width="1.5" />
    <rect x="1" y="1" width="${indW}" height="${height - 2}" rx="2" fill="#003399" />
    <circle cx="${1 + indW/2}" cy="${height * 0.3}" r="${Math.max(1, Math.round(height * 0.09))}" fill="none" stroke="#ffffff" stroke-width="0.8" />
    <text x="${1 + indW/2}" y="${height * 0.72}" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="${Math.round(height * 0.20)}" fill="#ffffff" text-anchor="middle">IND</text>
    <text x="${textLeft}" y="${y1}" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="${fs1}" fill="#000000" text-anchor="start" textLength="${textW}" lengthAdjust="spacingAndGlyphs">FRIENDS TOURS</text>
    <text x="${textLeft + Math.round(textW * 0.03)}" y="${y2}" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="${fs2}" fill="#000000" text-anchor="start" textLength="${Math.round(textW * 0.94)}" lengthAdjust="spacingAndGlyphs">AND TRAVELS</text>
  </svg>
  `;
}

async function run() {
  await sharp(Buffer.from(makePlateSvg(180, 60))).png().toFile(path.join(root, 'public/fleet/test-plate.png'));
  console.log('Saved test-plate.png successfully');
}

run().catch(console.error);
