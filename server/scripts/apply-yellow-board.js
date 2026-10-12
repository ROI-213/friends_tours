import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../..');

export function renderHighResPlate(targetW, targetH, options = {}) {
  const { rotate = 0, skewX = 0, skewY = 0 } = options;
  const W = targetW * 4;
  const H = targetH * 4;

  const indW = Math.round(W * 0.11);
  const textX = indW + (W - indW) / 2;
  
  const fs1 = Math.round(H * 0.22);
  const fs2 = Math.round(H * 0.19);
  const y1 = Math.round(H * 0.44);
  const y2 = Math.round(H * 0.78);

  const svg = `
  <svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="plateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#FFD400" />
        <stop offset="100%" stop-color="#F5B400" />
      </linearGradient>
    </defs>
    <!-- Yellow Plate Background with dark outer border -->
    <rect x="2" y="2" width="${W - 4}" height="${H - 4}" rx="8" fill="url(#plateGrad)" stroke="#111111" stroke-width="5" />
    
    <!-- Left Blue IND Band -->
    <rect x="4" y="4" width="${indW}" height="${H - 8}" rx="5" fill="#003893" />
    <circle cx="${4 + indW/2}" cy="${H * 0.30}" r="${Math.round(H * 0.08)}" fill="none" stroke="#ffffff" stroke-width="3" />
    <text x="${4 + indW/2}" y="${H * 0.72}" font-family="Arial, Helvetica, sans-serif" font-weight="bold" font-size="${Math.round(H * 0.18)}" fill="#ffffff" text-anchor="middle">IND</text>

    <!-- Black Commercial Taxi Plate Text -->
    <g transform="rotate(${rotate} ${textX} ${H/2}) skewX(${skewX}) skewY(${skewY})">
      <text x="${textX}" y="${y1}" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="${fs1}" fill="#000000" text-anchor="middle" letter-spacing="0.5">FRIENDS TOURS</text>
      <text x="${textX}" y="${y2}" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="${fs2}" fill="#000000" text-anchor="middle" letter-spacing="0.5">AND TRAVELS</text>
    </g>
  </svg>
  `;

  return sharp(Buffer.from(svg))
    .resize(targetW, targetH, { kernel: 'lanczos3' })
    .png()
    .toBuffer();
}

const CAR_CONFIGS = [
  {
    name: 'Audi A-6',
    file: 'audi-a6-white.jpg',
    width: 94,
    height: 38,
    left: 140,
    top: 340,
    rotate: 0,
    skewX: 0,
    skewY: 0
  },
  {
    name: 'BMW 7 Series',
    file: 'bmw-7-white.jpg',
    width: 80,
    height: 27,
    left: 208,
    top: 430,
    rotate: -1,
    skewX: 0,
    skewY: 0
  },
  {
    name: 'M.Benz-E Class E-350',
    file: 'mercedes-e-white.jpg',
    width: 78,
    height: 26,
    left: 762,
    top: 352,
    rotate: -1,
    skewX: 0,
    skewY: 0
  },
  {
    name: 'M.Benz-S Class S-350',
    file: 'mercedes-s-white.jpg',
    width: 82,
    height: 26,
    left: 768,
    top: 414,
    rotate: 1,
    skewX: 0,
    skewY: 0
  },
  {
    name: 'Toyota Corolla AC',
    file: 'corolla-white.jpg',
    width: 86,
    height: 28,
    left: 169,
    top: 377,
    rotate: 0,
    skewX: 0,
    skewY: 0
  }
];

async function applyPlates() {
  for (const car of CAR_CONFIGS) {
    const inputPath = path.join(root, 'public/fleet', car.file);
    const backupPath = path.join(root, 'public/fleet', 'backup-' + car.file);
    
    // Always composite onto the pristine original backup
    const sourcePath = fs.existsSync(backupPath) ? backupPath : inputPath;

    const plateBuffer = await renderHighResPlate(car.width, car.height, {
      rotate: car.rotate,
      skewX: car.skewX,
      skewY: car.skewY
    });

    const outputImg = await sharp(sourcePath)
      .composite([{
        input: plateBuffer,
        left: car.left,
        top: car.top
      }])
      .jpeg({ quality: 96 })
      .toBuffer();

    fs.writeFileSync(inputPath, outputImg);
    console.log(`Applied pixel-perfect yellow board to: ${car.name} (${car.file})`);
  }
}

applyPlates().catch(console.error);
