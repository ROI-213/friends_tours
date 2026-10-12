import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '../..');

async function testGridBMW() {
  const svg = `
  <svg width="1000" height="600" xmlns="http://www.w3.org/2000/svg">
    ${[300, 350, 400, 420, 430, 440, 450, 460, 500].map(y => `
      <line x1="0" y1="${y}" x2="1000" y2="${y}" stroke="red" stroke-width="1" />
      <text x="10" y="${y - 3}" fill="red" font-size="12">y=${y}</text>
    `).join('')}

    ${[150, 180, 200, 220, 240, 260, 280, 300, 700, 740, 760, 780, 800, 820, 840, 860].map(x => `
      <line x1="${x}" y1="0" x2="${x}" y2="600" stroke="blue" stroke-width="1" />
      <text x="${x + 2}" y="20" fill="blue" font-size="12">x=${x}</text>
    `).join('')}
  </svg>
  `;
  await sharp(path.join(root, 'public/fleet/backup-bmw-7-white.jpg'))
    .composite([{ input: Buffer.from(svg) }])
    .toFile(path.join(root, 'public/fleet/bmw-grid.jpg'));

  await sharp(path.join(root, 'public/fleet/backup-mercedes-s-white.jpg'))
    .composite([{ input: Buffer.from(svg) }])
    .toFile(path.join(root, 'public/fleet/mercedes-s-grid.jpg'));

  await sharp(path.join(root, 'public/fleet/backup-mercedes-e-white.jpg'))
    .composite([{ input: Buffer.from(svg) }])
    .toFile(path.join(root, 'public/fleet/mercedes-e-grid.jpg'));

  await sharp(path.join(root, 'public/fleet/backup-corolla-white.jpg'))
    .composite([{ input: Buffer.from(svg) }])
    .toFile(path.join(root, 'public/fleet/corolla-grid.jpg'));

  console.log('All grids generated');
}

testGridBMW().catch(console.error);
