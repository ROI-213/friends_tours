import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../..');

export function renderHighResPlate(targetW, targetH) {
  // Scale factor = 4
  const W = targetW * 4;
  const H = targetH * 4;

  const indW = Math.round(W * 0.11);
  const textX = indW + (W - indW) / 2;
  
  // Sizing calculated so it fits comfortably within W - indW
  // "FRIENDS TOURS" is 13 chars. At font-size = H * 0.32, it fits with ample room.
  const fs1 = Math.round(H * 0.22);
  const fs2 = Math.round(H * 0.20);
  const y1 = Math.round(H * 0.44);
  const y2 = Math.round(H * 0.78);

  const svg = `
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="plateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#FFD600" />
        <stop offset="100%" stop-color="#F5B400" />
      </linearGradient>
    </defs>
    <!-- Yellow Plate Background with black outer border -->
    <rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="10" fill="url(#plateGrad)" stroke="#111111" stroke-width="6" />
    
    <!-- Left Blue IND Band -->
    <rect x="5" y="5" width="${indW}" height="${H - 10}" rx="6" fill="#003893" />
    <circle cx="${5 + indW/2}" cy="${H * 0.30}" r="${Math.round(H * 0.08)}" fill="none" stroke="#ffffff" stroke-width="3" />
    <text x="${5 + indW/2}" y="${H * 0.72}" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="${Math.round(H * 0.18)}" fill="#ffffff" text-anchor="middle">IND</text>

    <!-- Black Embossed Text -->
    <text x="${textX}" y="${y1}" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="${fs1}" fill="#000000" text-anchor="middle">FRIENDS TOURS</text>
    <text x="${textX}" y="${y2}" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="${fs2}" fill="#000000" text-anchor="middle">AND TRAVELS</text>
  </svg>
  `;

  return sharp(Buffer.from(svg))
    .resize(targetW, targetH, { kernel: 'lanczos3' })
    .png()
    .toBuffer();
}

async function test() {
  const buf = await renderHighResPlate(180, 60);
  await sharp(buf).toFile(path.join(root, 'public/fleet/test-res-plate.png'));
  console.log('Saved test-res-plate.png');
}

test().catch(console.error);
